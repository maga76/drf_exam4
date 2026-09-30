from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import *
from .permissions import IsDeputy, IsSchoolAdmin, IsSuperAdmin
from .scheduler import generate_schedule
from .serializers import *
from .tasks import generate_schedule_task


class LogoutView(generics.GenericAPIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=400)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out'})
        except Exception:
            return Response({'error': 'Invalid token'}, status=400)


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSchoolAdmin]


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSchoolAdmin]


class SchoolListCreateView(generics.ListCreateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsSuperAdmin]


class SchoolDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsSuperAdmin]


class BuildingListCreateView(generics.ListCreateAPIView):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer


class BuildingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer


class AcademicYearListCreateView(generics.ListCreateAPIView):
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer


class AcademicYearDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AcademicYear.objects.all()
    serializer_class = AcademicYearSerializer


class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer


class RoomListCreateView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GradeListCreateView(generics.ListCreateAPIView):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer


class GradeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer


class TeacherListCreateView(generics.ListCreateAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer


class TeacherDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer


class TeacherAvailabilityListCreateView(generics.ListCreateAPIView):
    queryset = TeacherAvailability.objects.all()
    serializer_class = TeacherAvailabilitySerializer


class TeacherAvailabilityDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeacherAvailability.objects.all()
    serializer_class = TeacherAvailabilitySerializer


class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class ParentListCreateView(generics.ListCreateAPIView):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer


class ParentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer


class TimeSlotListCreateView(generics.ListCreateAPIView):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer


class TimeSlotDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer


class ScheduleListCreateView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer


class ScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer


class LessonListCreateView(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer


class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer


class SubjectHoursListCreateView(generics.ListCreateAPIView):
    queryset = SubjectHours.objects.all()
    serializer_class = SubjectHoursSerializer


class SubjectHoursDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubjectHours.objects.all()
    serializer_class = SubjectHoursSerializer


class LessonReplacementListCreateView(generics.ListCreateAPIView):
    queryset = LessonReplacement.objects.all()
    serializer_class = LessonReplacementSerializer


class LessonReplacementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LessonReplacement.objects.all()
    serializer_class = LessonReplacementSerializer


class AttendanceListCreateView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer


class AttendanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer


class MarkListCreateView(generics.ListCreateAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializer


class MarkDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializer


class HomeworkListCreateView(generics.ListCreateAPIView):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializer


class HomeworkDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializer


class AnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer


class AnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class TeacherSearchView(generics.ListAPIView):
    serializer_class = TeacherSerializer

    def get_queryset(self):
        text = self.request.query_params.get('q', '')
        return Teacher.objects.filter(
            Q(user__first_name__icontains=text) |
            Q(user__last_name__icontains=text) |
            Q(user__middle_name__icontains=text)
        )


class FreeTeacherListView(generics.ListAPIView):
    serializer_class = TeacherSerializer

    def get_queryset(self):
        now = timezone.localtime()
        busy_teachers = Lesson.objects.filter(
            schedule__status='active',
            day_of_week=now.isoweekday(),
            time_slot__start_time__lte=now.time(),
            time_slot__end_time__gte=now.time()
        ).values_list('teacher_id', flat=True)

        return Teacher.objects.filter(status='free').exclude(id__in=busy_teachers)


class TeacherScheduleView(generics.ListAPIView):
    serializer_class = LessonSerializer

    def get_queryset(self):
        return Lesson.objects.filter(teacher_id=self.kwargs['pk']).order_by(
            'day_of_week', 'time_slot__lesson_number'
        )


class TeacherWorkloadView(generics.GenericAPIView):
    def get(self, request, pk):
        teacher = Teacher.objects.get(id=pk)
        lessons = Lesson.objects.filter(teacher=teacher).count()

        return Response({
            'teacher_id': teacher.id,
            'hours_per_week': teacher.hours_per_week,
            'scheduled_lessons': lessons,
        })


class GradeScheduleView(generics.ListAPIView):
    serializer_class = LessonSerializer

    def get_queryset(self):
        return Lesson.objects.filter(grade_id=self.kwargs['pk']).order_by(
            'day_of_week', 'time_slot__lesson_number'
        )


class GradeStudentListView(generics.ListAPIView):
    serializer_class = StudentSerializer

    def get_queryset(self):
        return Student.objects.filter(grade_id=self.kwargs['pk'])


class FreeRoomListView(generics.ListAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        now = timezone.localtime()
        busy_rooms = Lesson.objects.filter(
            schedule__status='active',
            day_of_week=now.isoweekday(),
            time_slot__start_time__lte=now.time(),
            time_slot__end_time__gte=now.time()
        ).values_list('room_id', flat=True)

        return Room.objects.exclude(id__in=busy_rooms)


class RoomScheduleView(generics.ListAPIView):
    serializer_class = LessonSerializer

    def get_queryset(self):
        return Lesson.objects.filter(room_id=self.kwargs['pk']).order_by(
            'day_of_week', 'time_slot__lesson_number'
        )


class ScheduleGenerateView(generics.GenericAPIView):
    permission_classes = [IsDeputy]

    def post(self, request):
        schedule_id = request.data.get('schedule_id')
        schedule = Schedule.objects.get(id=schedule_id)

        try:
            task = generate_schedule_task.delay(schedule.id)
            return Response({
                'status': 'started',
                'task_id': task.id,
                'schedule_id': schedule.id,
            }, status=status.HTTP_202_ACCEPTED)
        except Exception:
            result = generate_schedule(schedule)
            return Response(result)


class LiveLessonListView(generics.ListAPIView):
    serializer_class = LessonSerializer

    def get_queryset(self):
        now = timezone.localtime()
        return Lesson.objects.filter(
            schedule__status='active',
            day_of_week=now.isoweekday(),
            time_slot__start_time__lte=now.time(),
            time_slot__end_time__gte=now.time()
        )


class LessonReplaceView(generics.CreateAPIView):
    serializer_class = LessonReplacementSerializer
    permission_classes = [IsDeputy]

    def perform_create(self, serializer):
        lesson = Lesson.objects.get(id=self.kwargs['pk'])
        serializer.save(
            lesson=lesson,
            original_teacher=lesson.teacher,
            created_by=self.request.user
        )


class AttendanceStatsView(generics.GenericAPIView):
    def get(self, request):
        stats = Attendance.objects.values('status').annotate(total=Count('id'))
        return Response(stats)


class StudentMarkListView(generics.ListAPIView):
    serializer_class = MarkSerializer

    def get_queryset(self):
        return Mark.objects.filter(student_id=self.kwargs['pk']).order_by('-date')


class NotificationReadView(generics.GenericAPIView):
    def patch(self, request, pk):
        notification = Notification.objects.get(id=pk, user=request.user)
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)


class DashboardView(generics.GenericAPIView):
    def get(self, request):
        school = request.user.school

        teachers = Teacher.objects.all()
        grades = Grade.objects.all()
        lessons = Lesson.objects.filter(schedule__status='active')
        rooms = Room.objects.all()

        if school:
            teachers = teachers.filter(user__school=school)
            grades = grades.filter(school=school)
            lessons = lessons.filter(schedule__school=school)
            rooms = rooms.filter(school=school)

        today = timezone.localdate()
        absent = Teacher.objects.filter(status__in=['absent', 'sick'])

        if school:
            absent = absent.filter(user__school=school)

        return Response({
            'teachers': teachers.count(),
            'grades': grades.count(),
            'lessons': lessons.filter(day_of_week=today.isoweekday()).count(),
            'absent_teachers': absent.count(),
            'rooms': rooms.count(),
        })
