from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    TeacherViewSet,
    GroupViewSet,
    SubjectViewSet,
    RoomViewSet,
    ScheduleViewSet,
    schedule_dashboard,
)

router = DefaultRouter()
router.register(r'teachers', TeacherViewSet, basename='timetable-teacher')
router.register(r'groups', GroupViewSet, basename='timetable-group')
router.register(r'subjects', SubjectViewSet, basename='timetable-subject')
router.register(r'rooms', RoomViewSet, basename='timetable-room')
router.register(r'schedules', ScheduleViewSet, basename='timetable-schedule')

urlpatterns = [
    path('timetable/', schedule_dashboard, name='timetable_dashboard'),
    path('api/timetable/', include(router.urls)),
]
