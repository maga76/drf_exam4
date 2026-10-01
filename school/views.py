from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import *
from .permissions import (
    IsDeputy,
    IsDeputyOrReadOnly,
    IsOwnerOrAdmin,
    IsSchoolAdmin,
    IsSchoolAdminOrReadOnly,
    IsSuperAdmin,
    IsTeacher,
    IsTeacherOrReadOnly,
)
from .serializers import *


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(generics.GenericAPIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserListCreateView(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsSchoolAdmin]

    def get_queryset(self):
        user = self.request.user
        queryset = User.objects.select_related('school').all().order_by('-date_joined')

        if user.is_superuser or user.role == 'super_admin':
            school_id = self.request.query_params.get('school')
            if school_id:
                queryset = queryset.filter(school_id=school_id)
            return queryset

        return queryset.filter(school=user.school).exclude(role='super_admin')

    def perform_create(self, serializer):
        user = self.request.user
        if not (user.is_superuser or user.role == 'super_admin'):
            serializer.save(school=user.school)
        else:
            serializer.save()


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsSchoolAdmin]

    def get_queryset(self):
        user = self.request.user
        queryset = User.objects.select_related('school').all()

        if user.is_superuser or user.role == 'super_admin':
            return queryset

        return queryset.filter(school=user.school).exclude(role='super_admin')


class SchoolListCreateView(generics.ListCreateAPIView):
    queryset = School.objects.all().order_by('name')
    serializer_class = SchoolSerializer
    permission_classes = [IsSuperAdmin]


class SchoolDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsSuperAdmin]


# Helper to get school scoped queryset
def get_school_queryset(model, user, school_field='school'):
    qs = model.objects.all()
    if user.is_superuser or user.role == 'super_admin':
        return qs
    if user.school_id:
        filter_kwargs = {school_field: user.school_id}
        return qs.filter(**filter_kwargs)
    return qs.none()


class BuildingListCreateView(generics.ListCreateAPIView):
    serializer_class = BuildingSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Building, self.request.user).select_related('school')

    def perform_create(self, serializer):
        user = self.request.user
        if not (user.is_superuser or user.role == 'super_admin') and user.school:
            serializer.save(school=user.school)
        else:
            serializer.save()


class BuildingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BuildingSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Building, self.request.user)


class AcademicYearListCreateView(generics.ListCreateAPIView):
    serializer_class = AcademicYearSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(AcademicYear, self.request.user).order_by('-start_date')

    def perform_create(self, serializer):
        user = self.request.user
        if not (user.is_superuser or user.role == 'super_admin') and user.school:
            serializer.save(school=user.school)
        else:
            serializer.save()


class AcademicYearDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AcademicYearSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(AcademicYear, self.request.user)


class SubjectListCreateView(generics.ListCreateAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Subject, self.request.user).order_by('name')

    def perform_create(self, serializer):
        user = self.request.user
        if not (user.is_superuser or user.role == 'super_admin') and user.school:
            serializer.save(school=user.school)
        else:
            serializer.save()


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Subject, self.request.user)


class RoomListCreateView(generics.ListCreateAPIView):
    serializer_class = RoomSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Room, self.request.user).select_related('building', 'school').prefetch_related('suitable_for').order_by('number')

    def perform_create(self, serializer):
        user = self.request.user
        if not (user.is_superuser or user.role == 'super_admin') and user.school:
            serializer.save(school=user.school)
        else:
            serializer.save()


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RoomSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Room, self.request.user).select_related('building')


class GradeListCreateView(generics.ListCreateAPIView):
    serializer_class = GradeSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Grade, self.request.user).select_related(
            'academic_year', 'class_teacher', 'home_room', 'school'
        ).prefetch_related('students').order_by('number', 'letter')

    def perform_create(self, serializer):
        user = self.request.user
        if not (user.is_superuser or user.role == 'super_admin') and user.school:
            serializer.save(school=user.school)
        else:
            serializer.save()


class GradeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GradeSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Grade, self.request.user).select_related(
            'academic_year', 'class_teacher', 'home_room'
        )


class TeacherListCreateView(generics.ListCreateAPIView):
    serializer_class = TeacherSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Teacher, self.request.user, school_field='user__school').select_related(
            'user', 'main_room'
        ).prefetch_related('subjects', 'grades').order_by('user__last_name', 'user__first_name')


class TeacherDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TeacherSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Teacher, self.request.user, school_field='user__school').select_related(
            'user', 'main_room'
        ).prefetch_related('subjects', 'grades')


class TeacherAvailabilityListCreateView(generics.ListCreateAPIView):
    serializer_class = TeacherAvailabilitySerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = TeacherAvailability.objects.select_related('teacher__user').all()
        if user.is_superuser or user.role in ['super_admin', 'school_admin', 'deputy']:
            if user.school:
                qs = qs.filter(teacher__user__school=user.school)
            return qs
        if hasattr(user, 'teacher_profile'):
            return qs.filter(teacher=user.teacher_profile)
        return qs.none()


class TeacherAvailabilityDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TeacherAvailabilitySerializer
    permission_classes = [IsTeacherOrReadOnly]
    queryset = TeacherAvailability.objects.select_related('teacher__user')


class StudentListCreateView(generics.ListCreateAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Student, self.request.user, school_field='user__school').select_related(
            'user', 'grade'
        ).order_by('user__last_name', 'user__first_name')


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudentSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Student, self.request.user, school_field='user__school').select_related(
            'user', 'grade'
        )


class ParentListCreateView(generics.ListCreateAPIView):
    serializer_class = ParentSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Parent, self.request.user, school_field='user__school').select_related(
            'user'
        ).prefetch_related('children__user')


class ParentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ParentSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Parent, self.request.user, school_field='user__school').select_related(
            'user'
        ).prefetch_related('children__user')


class TimeSlotListCreateView(generics.ListCreateAPIView):
    serializer_class = TimeSlotSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(TimeSlot, self.request.user).order_by('shift', 'lesson_number')

    def perform_create(self, serializer):
        user = self.request.user
        if not (user.is_superuser or user.role == 'super_admin') and user.school:
            serializer.save(school=user.school)
        else:
            serializer.save()


class TimeSlotDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TimeSlotSerializer
    permission_classes = [IsSchoolAdminOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(TimeSlot, self.request.user)


class ScheduleListCreateView(generics.ListCreateAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [IsDeputyOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Schedule, self.request.user).select_related(
            'academic_year', 'created_by'
        ).order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        school = user.school if not (user.is_superuser or user.role == 'super_admin') else serializer.validated_data.get('school', user.school)
        serializer.save(created_by=user, school=school)


class ScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ScheduleSerializer
    permission_classes = [IsDeputyOrReadOnly]

    def get_queryset(self):
        return get_school_queryset(Schedule, self.request.user).select_related(
            'academic_year', 'created_by'
        )


class LessonListCreateView(generics.ListCreateAPIView):
    serializer_class = LessonSerializer
    permission_classes = [IsDeputyOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Lesson.objects.select_related(
            'schedule', 'grade', 'subject', 'teacher__user', 'room', 'time_slot'
        ).all()
        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(schedule__school=user.school)
        return qs.none()


class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LessonSerializer
    permission_classes = [IsDeputyOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Lesson.objects.select_related(
            'schedule', 'grade', 'subject', 'teacher__user', 'room', 'time_slot'
        ).all()
        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(schedule__school=user.school)
        return qs.none()


class SubjectHoursListCreateView(generics.ListCreateAPIView):
    serializer_class = SubjectHoursSerializer
    permission_classes = [IsDeputyOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = SubjectHours.objects.select_related('grade', 'subject').all()
        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(grade__school=user.school)
        return qs.none()


class SubjectHoursDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubjectHoursSerializer
    permission_classes = [IsDeputyOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = SubjectHours.objects.select_related('grade', 'subject').all()
        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(grade__school=user.school)
        return qs.none()


class LessonReplacementListCreateView(generics.ListCreateAPIView):
    serializer_class = LessonReplacementSerializer
    permission_classes = [IsDeputyOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = LessonReplacement.objects.select_related(
            'lesson__grade', 'lesson__subject', 'original_teacher__user',
            'replacement_teacher__user', 'replacement_room', 'created_by'
        ).all().order_by('-date', '-created_at')

        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(lesson__schedule__school=user.school)
        return qs.none()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class LessonReplacementDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LessonReplacementSerializer
    permission_classes = [IsDeputyOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = LessonReplacement.objects.select_related(
            'lesson', 'original_teacher__user', 'replacement_teacher__user', 'replacement_room'
        ).all()
        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(lesson__schedule__school=user.school)
        return qs.none()


class AttendanceListCreateView(generics.ListCreateAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Attendance.objects.select_related('student__user', 'lesson__subject', 'marked_by').all().order_by('-date')

        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.role == 'student' and hasattr(user, 'student_profile'):
            return qs.filter(student=user.student_profile)
        if user.role == 'parent' and hasattr(user, 'parent_profile'):
            return qs.filter(student__in=user.parent_profile.children.all())
        if user.school:
            return qs.filter(lesson__schedule__school=user.school)
        return qs.none()

    def perform_create(self, serializer):
        serializer.save(marked_by=self.request.user)


class AttendanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Attendance.objects.select_related('student__user', 'lesson', 'marked_by').all()
        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(lesson__schedule__school=user.school)
        return qs.none()


class MarkListCreateView(generics.ListCreateAPIView):
    serializer_class = MarkSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Mark.objects.select_related('student__user', 'subject', 'teacher__user').all().order_by('-date')

        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.role == 'student' and hasattr(user, 'student_profile'):
            return qs.filter(student=user.student_profile)
        if user.role == 'parent' and hasattr(user, 'parent_profile'):
            return qs.filter(student__in=user.parent_profile.children.all())
        if user.school:
            return qs.filter(teacher__user__school=user.school)
        return qs.none()

    def perform_create(self, serializer):
        user = self.request.user
        teacher = getattr(user, 'teacher_profile', None)
        if teacher:
            serializer.save(teacher=teacher)
        else:
            serializer.save()


class MarkDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MarkSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Mark.objects.select_related('student__user', 'subject', 'teacher__user').all()
        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(teacher__user__school=user.school)
        return qs.none()


class HomeworkListCreateView(generics.ListCreateAPIView):
    serializer_class = HomeworkSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Homework.objects.select_related('teacher__user', 'grade', 'subject').all().order_by('-deadline', '-created_at')

        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.role == 'student' and hasattr(user, 'student_profile') and user.student_profile.grade:
            return qs.filter(grade=user.student_profile.grade)
        if user.school:
            return qs.filter(grade__school=user.school)
        return qs.none()

    def perform_create(self, serializer):
        user = self.request.user
        teacher = getattr(user, 'teacher_profile', None)
        if teacher:
            serializer.save(teacher=teacher)
        else:
            serializer.save()


class HomeworkDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HomeworkSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Homework.objects.select_related('teacher__user', 'grade', 'subject').all()
        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(grade__school=user.school)
        return qs.none()


class AnnouncementListCreateView(generics.ListCreateAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Announcement.objects.select_related('school', 'author', 'target_grade').all().order_by('-created_at')

        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            school_announcements = qs.filter(school=user.school)
            if user.role == 'student':
                return school_announcements.filter(Q(target__in=['all', 'students']) | Q(target='grade', target_grade=user.student_profile.grade if hasattr(user, 'student_profile') else None))
            elif user.role == 'parent':
                return school_announcements.filter(target__in=['all', 'parents'])
            elif user.role in ['teacher', 'class_teacher']:
                return school_announcements.filter(target__in=['all', 'teachers'])
            return school_announcements
        return qs.none()

    def perform_create(self, serializer):
        user = self.request.user
        school = user.school if not (user.is_superuser or user.role == 'super_admin') else serializer.validated_data.get('school', user.school)
        serializer.save(author=user, school=school)


class AnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        return Announcement.objects.select_related('school', 'author')


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


class NotificationDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class QSearchFilter(SearchFilter):
    search_param = 'q'


class TeacherSearchView(generics.ListAPIView):
    serializer_class = TeacherSerializer
    filter_backends = [QSearchFilter]
    search_fields = ['user__first_name', 'user__last_name', 'user__middle_name', 'subjects__name']

    def get_queryset(self):
        user = self.request.user
        qs = Teacher.objects.select_related('user', 'main_room').prefetch_related('subjects').distinct()
        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(user__school=user.school)
        return qs.none()


class FreeTeacherListView(generics.ListAPIView):
    serializer_class = TeacherSerializer

    def get_queryset(self):
        user = self.request.user
        now = timezone.localtime()
        iso_day = now.isoweekday()

        busy_teachers = Lesson.objects.filter(
            schedule__status='active',
            day_of_week=iso_day,
            time_slot__start_time__lte=now.time(),
            time_slot__end_time__gte=now.time()
        ).values_list('teacher_id', flat=True)

        qs = Teacher.objects.select_related('user', 'main_room').prefetch_related('subjects').filter(
            status='free'
        ).exclude(id__in=busy_teachers)

        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(user__school=user.school)
        return qs.none()


class TeacherScheduleView(generics.ListAPIView):
    serializer_class = LessonSerializer

    def get_queryset(self):
        teacher = get_object_or_404(Teacher, id=self.kwargs['pk'])
        return Lesson.objects.filter(
            teacher=teacher,
            schedule__status='active'
        ).select_related('schedule', 'grade', 'subject', 'room', 'time_slot').order_by(
            'day_of_week', 'time_slot__lesson_number'
        )


class TeacherWorkloadView(generics.GenericAPIView):
    def get(self, request, pk):
        teacher = get_object_or_404(Teacher.objects.select_related('user'), id=pk)
        scheduled = Lesson.objects.filter(teacher=teacher, schedule__status='active').count()

        return Response({
            'teacher_id': teacher.id,
            'teacher_name': teacher.user.full_name,
            'hours_per_week': teacher.hours_per_week,
            'scheduled_lessons': scheduled,
            'max_hours_per_day': teacher.max_hours_per_day,
            'status': teacher.status,
        })


class GradeScheduleView(generics.ListAPIView):
    serializer_class = LessonSerializer

    def get_queryset(self):
        grade = get_object_or_404(Grade, id=self.kwargs['pk'])
        return Lesson.objects.filter(
            grade=grade,
            schedule__status='active'
        ).select_related('schedule', 'grade', 'subject', 'teacher__user', 'room', 'time_slot').order_by(
            'day_of_week', 'time_slot__lesson_number'
        )


class GradeStudentListView(generics.ListAPIView):
    serializer_class = StudentSerializer

    def get_queryset(self):
        grade = get_object_or_404(Grade, id=self.kwargs['pk'])
        return Student.objects.filter(grade=grade).select_related('user', 'grade')


class FreeRoomListView(generics.ListAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        user = self.request.user
        now = timezone.localtime()
        iso_day = now.isoweekday()

        busy_rooms = Lesson.objects.filter(
            schedule__status='active',
            day_of_week=iso_day,
            time_slot__start_time__lte=now.time(),
            time_slot__end_time__gte=now.time()
        ).values_list('room_id', flat=True)

        qs = Room.objects.select_related('building', 'school').exclude(id__in=busy_rooms)
        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(school=user.school)
        return qs.none()


class RoomScheduleView(generics.ListAPIView):
    serializer_class = LessonSerializer

    def get_queryset(self):
        room = get_object_or_404(Room, id=self.kwargs['pk'])
        return Lesson.objects.filter(
            room=room,
            schedule__status='active'
        ).select_related('schedule', 'grade', 'subject', 'teacher__user', 'time_slot').order_by(
            'day_of_week', 'time_slot__lesson_number'
        )


class LiveLessonListView(generics.ListAPIView):
    serializer_class = LessonSerializer

    def get_queryset(self):
        user = self.request.user
        now = timezone.localtime()
        iso_day = now.isoweekday()

        qs = Lesson.objects.filter(
            schedule__status='active',
            day_of_week=iso_day,
            time_slot__start_time__lte=now.time(),
            time_slot__end_time__gte=now.time()
        ).select_related('schedule', 'grade', 'subject', 'teacher__user', 'room', 'time_slot')

        if user.is_superuser or user.role == 'super_admin':
            return qs
        if user.school:
            return qs.filter(schedule__school=user.school)
        return qs.none()


class LessonReplaceView(generics.CreateAPIView):
    serializer_class = LessonReplacementSerializer
    permission_classes = [IsDeputy]

    def perform_create(self, serializer):
        lesson = get_object_or_404(Lesson.objects.select_related('teacher'), id=self.kwargs['pk'])
        serializer.save(
            lesson=lesson,
            original_teacher=lesson.teacher,
            created_by=self.request.user
        )


class AttendanceStatsView(generics.GenericAPIView):
    def get(self, request):
        user = request.user
        qs = Attendance.objects.all()

        if not (user.is_superuser or user.role == 'super_admin') and user.school:
            qs = qs.filter(lesson__schedule__school=user.school)

        grade_id = request.query_params.get('grade')
        if grade_id:
            qs = qs.filter(student__grade_id=grade_id)

        date = request.query_params.get('date')
        if date:
            qs = qs.filter(date=date)

        stats = qs.values('status').annotate(total=Count('id'))
        total_records = qs.count()

        return Response({
            'total_records': total_records,
            'breakdown': stats
        })


class StudentMarkListView(generics.ListAPIView):
    serializer_class = MarkSerializer

    def get_queryset(self):
        student = get_object_or_404(Student, id=self.kwargs['pk'])
        return Mark.objects.filter(student=student).select_related(
            'student__user', 'subject', 'teacher__user'
        ).order_by('-date')


class NotificationReadView(generics.GenericAPIView):
    def patch(self, request, pk):
        notification = get_object_or_404(Notification, id=pk, user=request.user)
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)


class DashboardView(generics.GenericAPIView):
    def get(self, request):
        school = request.user.school
        is_global = request.user.is_superuser or request.user.role == 'super_admin'

        teachers = Teacher.objects.all()
        students = Student.objects.all()
        grades = Grade.objects.all()
        lessons = Lesson.objects.filter(schedule__status='active')
        rooms = Room.objects.all()
        absent = Teacher.objects.filter(status__in=['absent', 'sick'])

        if not is_global and school:
            teachers = teachers.filter(user__school=school)
            students = students.filter(user__school=school)
            grades = grades.filter(school=school)
            lessons = lessons.filter(schedule__school=school)
            rooms = rooms.filter(school=school)
            absent = absent.filter(user__school=school)

        today = timezone.localdate()
        now_time = timezone.localtime().time()
        iso_day = today.isoweekday()

        live_lessons_count = lessons.filter(
            day_of_week=iso_day,
            time_slot__start_time__lte=now_time,
            time_slot__end_time__gte=now_time
        ).count()

        today_lessons_count = lessons.filter(day_of_week=iso_day).count()

        return Response({
            'teachers': teachers.count(),
            'students': students.count(),
            'grades': grades.count(),
            'lessons': today_lessons_count,
            'live_lessons': live_lessons_count,
            'absent_teachers': absent.count(),
            'rooms': rooms.count(),
            'school_name': school.name if school else 'Все школы',
        })
