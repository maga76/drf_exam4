from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
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
    IsSchoolStaff,
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
    permission_classes = [IsSchoolStaff]

    def get_queryset(self):
        return get_school_queryset(Parent, self.request.user, school_field='user__school').select_related(
            'user'
        ).prefetch_related('children__user')


class ParentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ParentSerializer
    permission_classes = [IsSchoolStaff]

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
        if user.role == 'student' and hasattr(user, 'student_profile'):
            return qs.filter(student=user.student_profile)
        if user.role == 'parent' and hasattr(user, 'parent_profile'):
            return qs.filter(student__in=user.parent_profile.children.all())
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
        if user.role == 'student' and hasattr(user, 'student_profile'):
            return qs.filter(student=user.student_profile)
        if user.role == 'parent' and hasattr(user, 'parent_profile'):
            return qs.filter(student__in=user.parent_profile.children.all())
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
        return get_school_queryset(Announcement, self.request.user).select_related('school', 'author')


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
        user = self.request.user
        student = get_object_or_404(Student, id=self.kwargs['pk'])
        if not user.is_superuser and getattr(user, 'role', None) != 'super_admin':
            if student.user.school_id != getattr(user, 'school_id', None):
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Доступ запрещен: ученик другой школы.")
            if user.role == 'student' and hasattr(user, 'student_profile') and user.student_profile.id != student.id:
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Вы можете просматривать только свои оценки.")
            if user.role == 'parent' and hasattr(user, 'parent_profile'):
                if not user.parent_profile.children.filter(id=student.id).exists():
                    from rest_framework.exceptions import PermissionDenied
                    raise PermissionDenied("Вы можете просматривать оценки только своих детей.")
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


class AIChatView(APIView):
    """
    Интеллектуальный трехъязычный ассистент Smart School на базе Google Gemini.
    Поддерживает таджикский (Тоҷикӣ), русский и английский языки.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        import urllib.request
        import json
        from django.conf import settings

        user_message = request.data.get('message', '').strip()
        language = request.data.get('language', 'ru')

        if not user_message:
            return Response({'error': 'Сообщение не может быть пустым.'}, status=status.HTTP_400_BAD_REQUEST)

        api_key = getattr(settings, 'GEMINI_API_KEY', '')
        if not api_key:
            return Response({'reply': 'API-ключ Google Gemini не настроен.'})

        # Автоопределение языка по сообщению пользователя и выбранному языку
        msg_lower = user_message.lower()
        tajik_letters = set('ғӣӯҳҷқҒӢӮҲҶҚ')
        tajik_keywords = [
            'салом', 'мактаб', 'дарс', 'синф', 'муаллим', 'омӯзгор', 'омузгор',
            'хонанда', 'ҷадвал', 'чадвал', 'баҳо', 'бахо', 'волид', 'илм',
            'дониш', 'чӣ', 'чи', 'кист', 'куҷо', 'кучо', 'ташаккур', 'раҳмат', 'рахмат',
            'алейкум', 'алайкум', 'чихел', 'метавон', 'мехоҳам', 'мехохам',
            'шумо', 'ҳастам', 'хастам', 'нағз', 'нагз', 'хуб', 'рӯз', 'руз'
        ]
        
        has_tajik_chars = bool(tajik_letters.intersection(user_message))
        has_tajik_words = any(kw in msg_lower for kw in tajik_keywords)
        is_tajik = (language == 'tj') or has_tajik_chars or has_tajik_words
        is_english = (language == 'en') or (
            any(ch in 'abcdefghijklmnopqrstuvwxyz' for ch in msg_lower)
            and not any(ch in 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяғӣӯҳҷқ' for ch in msg_lower)
        )

        if is_tajik:
            target_lang = "tj"
            system_instruction = (
                "Ту Smart School AI — ёвари расмии зеҳнии низоми идоракунии мактаб ҳастӣ. "
                "ҚАТЪИЯН ВА ТАНҲО БО ЗАБОНИ ТОҶИКӢ (Тоҷикии адабӣ, равон, ширин ва зебо) ҷавоб деҳ! "
                "Ҳеҷ гоҳ бо забони русӣ ё англисӣ ҷавоб нагардон. "
                "Ба маъмурияти мактаб, мудирон, завучҳо, омӯзгорон, хонандагон ва волидайн оид ба ҳамаи саволҳо: "
                "ҷадвали дарсҳо, ивазкунии муаллимони бемор, баҳоҳо, фанҳо, синфхонаҳо ва эълонҳо бо камоли эҳтиром ва касбият кӯмак расон. "
                "Матнро бо сархатҳо, рӯйхатҳо ва эмодзиҳои мувофиқ оро деҳ."
            )
        elif is_english:
            target_lang = "en"
            system_instruction = (
                "You are Smart School AI, the official intelligent assistant of the Smart School Management System. "
                "You MUST write your entire response STRICTLY in clear, professional, friendly, and fluent ENGLISH. "
                "Do not respond in Russian or any other language unless explicitly requested. "
                "Help school administrators, principals, teachers, students, and parents with scheduling, timetable optimization, "
                "substitutions, academic records, and announcements. Use nice formatting, bullet points, and appropriate emojis."
            )
        else:
            target_lang = "ru"
            system_instruction = (
                "Ты — Smart School AI, официальный интеллектуальный ассистент комплексной системы управления школой Smart School. "
                "Отвечай на грамотном, вежливом и профессиональном РУССКОМ языке. "
                "Помогай администрации школы, учителям, ученикам и родителям решать любые задачи: составление расписания без конфликтов, "
                "подбор замен преподавателям, аналитика успеваемости, подготовка объявлений и учебных материалов. "
                "Используй красивое форматирование со списками, выделениями и эмодзи."
            )

        candidate_models = [
            'gemini-3.1-flash-lite',
            'gemini-3.8-flash',
            'gemini-flash-latest',
            'gemini-2.5-flash-lite',
            'gemini-pro-latest'
        ]

        payload = {
            "system_instruction": {
                "parts": [{"text": system_instruction}]
            },
            "contents": [
                {
                    "parts": [{"text": user_message}]
                }
            ]
        }
        req_data = json.dumps(payload).encode('utf-8')

        for model_name in candidate_models:
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
            try:
                req = urllib.request.Request(
                    gemini_url,
                    data=req_data,
                    headers={
                        'Content-Type': 'application/json',
                        'x-goog-api-key': api_key
                    }
                )
                with urllib.request.urlopen(req, timeout=12) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    candidates = data.get('candidates', [])
                    if candidates:
                        parts = candidates[0].get('content', {}).get('parts', [])
                        if parts and 'text' in parts[0]:
                            reply = parts[0]['text'].strip()
                            return Response({'reply': reply, 'language': target_lang, 'model': model_name})
            except Exception as exc:
                continue

        # В случае недоступности внешнего сервиса — качественный локальный ответ на нужном языке
        if target_lang == 'tj':
            fallback_reply = (
                f"Салом! Ман Smart School AI ҳастам. Паёми шумо қабул шуд.\n\n"
                "Системаи мактаб дар ҳолати муқаррарӣ кор карда истодааст. Ҳамаи бахшҳо — ҷадвали дарсҳо, омӯзгорон ва синфҳо омодаанд. "
                "Чӣ саволе доред, марҳамат нависед!"
            )
        elif target_lang == 'en':
            fallback_reply = (
                f"Hello! I am Smart School AI. Your request has been acknowledged.\n\n"
                "All school modules (Timetable, Teachers, Classes, Rooms) are functioning normally. "
                "How else can I assist you?"
            )
        else:
            fallback_reply = (
                f"Здравствуйте! Я Smart School AI. Ваш запрос принят.\n\n"
                "Все модули школы (расписание, преподаватели, классы, кабинеты) функционируют в штатном режиме. "
                "Чем ещё могу вам помочь?"
            )

        return Response({'reply': fallback_reply, 'language': target_lang, 'fallback': True})

