from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views


urlpatterns = [
    path('auth/login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/me/', views.MeView.as_view(), name='me'),

    path('users/', views.UserListCreateView.as_view()),
    path('users/<int:pk>/', views.UserDetailView.as_view()),

    path('schools/', views.SchoolListCreateView.as_view()),
    path('schools/<int:pk>/', views.SchoolDetailView.as_view()),

    path('buildings/', views.BuildingListCreateView.as_view()),
    path('buildings/<int:pk>/', views.BuildingDetailView.as_view()),

    path('academic-years/', views.AcademicYearListCreateView.as_view()),
    path('academic-years/<int:pk>/', views.AcademicYearDetailView.as_view()),

    path('subjects/', views.SubjectListCreateView.as_view()),
    path('subjects/<int:pk>/', views.SubjectDetailView.as_view()),

    path('rooms/', views.RoomListCreateView.as_view()),
    path('rooms/free/', views.FreeRoomListView.as_view()),
    path('rooms/<int:pk>/', views.RoomDetailView.as_view()),
    path('rooms/<int:pk>/schedule/', views.RoomScheduleView.as_view()),

    path('grades/', views.GradeListCreateView.as_view()),
    path('grades/<int:pk>/', views.GradeDetailView.as_view()),
    path('grades/<int:pk>/schedule/', views.GradeScheduleView.as_view()),
    path('grades/<int:pk>/students/', views.GradeStudentListView.as_view()),

    path('teachers/', views.TeacherListCreateView.as_view()),
    path('teachers/search/', views.TeacherSearchView.as_view()),
    path('teachers/free/', views.FreeTeacherListView.as_view()),
    path('teachers/<int:pk>/', views.TeacherDetailView.as_view()),
    path('teachers/<int:pk>/schedule/', views.TeacherScheduleView.as_view()),
    path('teachers/<int:pk>/workload/', views.TeacherWorkloadView.as_view()),

    path('teacher-availability/', views.TeacherAvailabilityListCreateView.as_view()),
    path('teacher-availability/<int:pk>/', views.TeacherAvailabilityDetailView.as_view()),

    path('students/', views.StudentListCreateView.as_view()),
    path('students/<int:pk>/', views.StudentDetailView.as_view()),

    path('parents/', views.ParentListCreateView.as_view()),
    path('parents/<int:pk>/', views.ParentDetailView.as_view()),

    path('time-slots/', views.TimeSlotListCreateView.as_view()),
    path('time-slots/<int:pk>/', views.TimeSlotDetailView.as_view()),

    path('schedules/', views.ScheduleListCreateView.as_view()),
    path('schedules/live/', views.LiveLessonListView.as_view()),
    path('schedules/<int:pk>/', views.ScheduleDetailView.as_view()),

    path('lessons/', views.LessonListCreateView.as_view()),
    path('lessons/<int:pk>/', views.LessonDetailView.as_view()),
    path('lessons/<int:pk>/replace/', views.LessonReplaceView.as_view()),

    path('subject-hours/', views.SubjectHoursListCreateView.as_view()),
    path('subject-hours/<int:pk>/', views.SubjectHoursDetailView.as_view()),

    path('replacements/', views.LessonReplacementListCreateView.as_view()),
    path('replacements/<int:pk>/', views.LessonReplacementDetailView.as_view()),

    path('attendance/', views.AttendanceListCreateView.as_view()),
    path('attendance/stats/', views.AttendanceStatsView.as_view()),
    path('attendance/<int:pk>/', views.AttendanceDetailView.as_view()),

    path('marks/', views.MarkListCreateView.as_view()),
    path('marks/student/<int:pk>/', views.StudentMarkListView.as_view()),
    path('marks/<int:pk>/', views.MarkDetailView.as_view()),

    path('homework/', views.HomeworkListCreateView.as_view()),
    path('homework/<int:pk>/', views.HomeworkDetailView.as_view()),

    path('announcements/', views.AnnouncementListCreateView.as_view()),
    path('announcements/<int:pk>/', views.AnnouncementDetailView.as_view()),

    path('notifications/', views.NotificationListView.as_view()),
    path('notifications/<int:pk>/', views.NotificationDetailView.as_view()),
    path('notifications/<int:pk>/read/', views.NotificationReadView.as_view()),

    path('dashboard/', views.DashboardView.as_view()),
]
