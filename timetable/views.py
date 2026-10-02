from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Teacher, Group, Subject, Room, Schedule
from .serializers import (
    TeacherSerializer,
    GroupSerializer,
    SubjectSerializer,
    RoomSerializer,
    ScheduleSerializer,
)


def schedule_dashboard(request):
    """Отображение HTML страницы управления расписанием"""
    return render(request, 'timetable/index.html')


class TeacherViewSet(viewsets.ModelViewSet):
    """API для управления преподавателями"""
    queryset = Teacher.objects.all().order_by('last_name', 'first_name')
    serializer_class = TeacherSerializer
    permission_classes = [permissions.AllowAny]


class GroupViewSet(viewsets.ModelViewSet):
    """API для управления учебными группами"""
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.AllowAny]


class SubjectViewSet(viewsets.ModelViewSet):
    """API для управления учебными предметами"""
    queryset = Subject.objects.all().order_by('name')
    serializer_class = SubjectSerializer
    permission_classes = [permissions.AllowAny]


class RoomViewSet(viewsets.ModelViewSet):
    """API для управления кабинетами"""
    queryset = Room.objects.all().order_by('number')
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]


class ScheduleViewSet(viewsets.ModelViewSet):
    """
    API для управления расписанием уроков.
    Поддерживает фильтрацию по teacher, group, subject, room, day_of_week.
    """
    serializer_class = ScheduleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Schedule.objects.select_related(
            'teacher', 'group', 'subject', 'room'
        ).all().order_by('day_of_week', 'start_time')

        # Фильтры через query_params
        teacher_id = self.request.query_params.get('teacher')
        group_id = self.request.query_params.get('group')
        subject_id = self.request.query_params.get('subject')
        room_id = self.request.query_params.get('room')
        day_of_week = self.request.query_params.get('day_of_week')

        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        if group_id:
            queryset = queryset.filter(group_id=group_id)
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        if day_of_week:
            queryset = queryset.filter(day_of_week=day_of_week)

        return queryset

    @action(detail=False, methods=['get'])
    def by_teacher(self, request):
        """Получить расписание конкретного преподавателя"""
        teacher_id = request.query_params.get('teacher_id')
        if not teacher_id:
            return Response(
                {"error": "Параметр 'teacher_id' обязателен."},
                status=status.HTTP_400_BAD_REQUEST
            )
        schedules = self.get_queryset().filter(teacher_id=teacher_id)
        serializer = self.get_serializer(schedules, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_group(self, request):
        """Получить расписание конкретной группы"""
        group_id = request.query_params.get('group_id')
        if not group_id:
            return Response(
                {"error": "Параметр 'group_id' обязателен."},
                status=status.HTTP_400_BAD_REQUEST
            )
        schedules = self.get_queryset().filter(group_id=group_id)
        serializer = self.get_serializer(schedules, many=True)
        return Response(serializer.data)
