from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'middle_name', 'phone', 'photo', 'role', 'school',
                  'school_name', 'is_active', 'password']

    def validate(self, data):
        request = self.context.get('request')

        if not request or not request.user.is_authenticated:
            return data

        if request.user.is_superuser or request.user.role == 'super_admin':
            return data

        data['school'] = request.user.school
        if data.get('role') == 'super_admin':
            raise serializers.ValidationError({
                'role': 'Only a super administrator can create this role.'
            })

        return data

    def create_role_profile(self, user):
        if user.role in ['teacher', 'class_teacher']:
            Teacher.objects.get_or_create(user=user)
        elif user.role == 'student':
            Student.objects.get_or_create(user=user)
        elif user.role == 'parent':
            Parent.objects.get_or_create(user=user)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)

        if password:
            user.set_password(password)
            user.save()

        self.create_role_profile(user)
        return user

    def update(self, user, validated_data):
        password = validated_data.pop('password', None)

        for field, value in validated_data.items():
            setattr(user, field, value)

        if password:
            user.set_password(password)

        user.save()
        self.create_role_profile(user)
        return user


class SchoolSerializer(serializers.ModelSerializer):
    students_count = serializers.SerializerMethodField()
    teachers_count = serializers.SerializerMethodField()
    buildings_count = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = ['id', 'name', 'address', 'phone', 'email', 'logo',
                  'status', 'created_at', 'students_count',
                  'teachers_count', 'buildings_count']

    def get_students_count(self, school):
        return school.users.filter(role='student').count()

    def get_teachers_count(self, school):
        return school.users.filter(role__in=['teacher', 'class_teacher']).count()

    def get_buildings_count(self, school):
        return school.buildings.count()


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
