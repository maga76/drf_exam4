from django.contrib import admin
from .models import (
    User, School, Building, AcademicYear,
    Subject, Room, Grade,
    Teacher, TeacherAvailability,
    Student, Parent,
    TimeSlot, Schedule, Lesson, SubjectHours, LessonReplacement,
    Attendance, Mark, Homework,
    Announcement, Notification,
)

admin.site.register(User)
admin.site.register(School)
admin.site.register(Building)
admin.site.register(AcademicYear)
admin.site.register(Subject)
admin.site.register(Room)
admin.site.register(Grade)
admin.site.register(Teacher)
admin.site.register(TeacherAvailability)
admin.site.register(Student)
admin.site.register(Parent)
admin.site.register(TimeSlot)
admin.site.register(Schedule)
admin.site.register(Lesson)
admin.site.register(SubjectHours)
admin.site.register(LessonReplacement)
admin.site.register(Attendance)
admin.site.register(Mark)
admin.site.register(Homework)
admin.site.register(Announcement)
admin.site.register(Notification)
