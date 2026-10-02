from django.contrib import admin
from .models import Teacher, Group, Subject, Room, Schedule


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'last_name', 'first_name', 'patronymic', 'email', 'phone')
    search_fields = ('last_name', 'first_name', 'patronymic', 'email', 'phone')
    ordering = ('last_name', 'first_name')


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code')
    search_fields = ('name', 'code')
    ordering = ('name',)


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'number', 'capacity')
    search_fields = ('number',)
    ordering = ('number',)


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'teacher',
        'group',
        'subject',
        'room',
        'day_of_week',
        'start_time',
        'end_time',
    )
    list_filter = ('day_of_week', 'group', 'teacher', 'subject', 'room')
    search_fields = (
        'teacher__last_name',
        'teacher__first_name',
        'group__name',
        'subject__name',
        'room__number',
    )
    ordering = ('day_of_week', 'start_time')
    list_select_related = ('teacher', 'group', 'subject', 'room')
