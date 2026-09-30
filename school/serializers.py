from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'middle_name', 'phone', 'photo', 'role', 'school',
                  'password']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user

    def update(self, user, validated_data):
        password = validated_data.pop('password', None)

        for field, value in validated_data.items():
            setattr(user, field, value)

        if password:
            user.set_password(password)

        user.save()
        return user


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name', 'address', 'phone', 'email', 'logo',
                  'status', 'created_at']


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = ['id', 'school', 'name', 'address']


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['id', 'school', 'name', 'start_date', 'end_date',
                  'is_current']


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'school', 'name', 'short_name',
                  'requires_special_room']


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'school', 'building', 'number', 'room_type',
                  'floor', 'capacity', 'suitable_for']


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['id', 'school', 'academic_year', 'number', 'letter',
                  'shift', 'class_teacher', 'home_room']


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['id', 'user', 'subjects', 'grades', 'hours_per_week',
                  'max_hours_per_day', 'main_room', 'status']


class TeacherAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherAvailability
        fields = ['id', 'teacher', 'day_of_week', 'is_available',
                  'time_from', 'time_to']


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'user', 'grade', 'date_of_birth', 'student_id']


class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = ['id', 'user', 'children']


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'school', 'shift', 'lesson_number', 'start_time',
                  'end_time']


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'school', 'academic_year', 'name', 'status',
                  'created_by', 'created_at']


class LessonSerializer(serializers.ModelSerializer):
    grade_name = serializers.StringRelatedField(source='grade', read_only=True)
    subject_name = serializers.StringRelatedField(source='subject', read_only=True)
    teacher_name = serializers.StringRelatedField(source='teacher', read_only=True)
    room_number = serializers.CharField(source='room.number', read_only=True)
    start_time = serializers.TimeField(source='time_slot.start_time', read_only=True)
    end_time = serializers.TimeField(source='time_slot.end_time', read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'schedule', 'grade', 'grade_name', 'subject',
                  'subject_name', 'teacher', 'teacher_name', 'room',
                  'room_number', 'time_slot', 'start_time', 'end_time',
                  'day_of_week']


class SubjectHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectHours
        fields = ['id', 'grade', 'subject', 'hours']


class LessonReplacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonReplacement
        fields = ['id', 'lesson', 'date', 'original_teacher',
                  'replacement_teacher', 'replacement_room', 'status',
                  'reason', 'created_by', 'created_at']


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'lesson', 'date', 'status', 'comment',
                  'marked_by']


class MarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mark
        fields = ['id', 'student', 'subject', 'teacher', 'value',
                  'mark_type', 'date', 'comment']


class HomeworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homework
        fields = ['id', 'teacher', 'grade', 'subject', 'title',
                  'description', 'file', 'deadline', 'created_at']


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'school', 'author', 'title', 'text', 'target',
                  'target_grade', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'notification_type', 'title', 'message',
                  'is_read', 'created_at']
