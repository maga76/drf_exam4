from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        photo_url = user.photo.url if user.photo else None

        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'middle_name': user.middle_name,
            'full_name': user.full_name,
            'phone': user.phone,
            'role': user.role,
            'school': user.school_id,
            'school_name': user.school.name if user.school else None,
            'photo': photo_url,
            'is_active': user.is_active,
        }
        return data


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    school_name = serializers.CharField(source='school.name', read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'middle_name', 'full_name', 'phone', 'photo', 'role', 'school',
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
        user = User(**validated_data)

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

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
    building_name = serializers.CharField(source='building.name', read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'school', 'building', 'building_name', 'number',
                  'room_type', 'floor', 'capacity', 'suitable_for']


class GradeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    students_count = serializers.SerializerMethodField()
    class_teacher_name = serializers.CharField(source='class_teacher.full_name', read_only=True)
    home_room_number = serializers.CharField(source='home_room.number', read_only=True)

    class Meta:
        model = Grade
        fields = ['id', 'school', 'academic_year', 'number', 'letter',
                  'name', 'shift', 'class_teacher', 'class_teacher_name',
                  'home_room', 'home_room_number', 'students_count']

    def get_name(self, obj):
        return f"{obj.number}{obj.letter}"

    def get_students_count(self, obj):
        return obj.students.count()


class TeacherSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    photo = serializers.ImageField(source='user.photo', read_only=True)
    room_number = serializers.CharField(source='main_room.number', read_only=True)
    subjects_details = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = ['id', 'user', 'full_name', 'first_name', 'last_name',
                  'email', 'phone', 'photo', 'subjects', 'subjects_details',
                  'grades', 'hours_per_week', 'max_hours_per_day',
                  'main_room', 'room_number', 'status']

    def get_subjects_details(self, obj):
        return [{'id': s.id, 'name': s.name, 'short_name': s.short_name} for s in obj.subjects.all()]


class TeacherAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherAvailability
        fields = ['id', 'teacher', 'day_of_week', 'is_available',
                  'time_from', 'time_to']


class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    photo = serializers.ImageField(source='user.photo', read_only=True)
    grade_name = serializers.StringRelatedField(source='grade', read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'user', 'full_name', 'first_name', 'last_name',
                  'email', 'phone', 'photo', 'grade', 'grade_name',
                  'date_of_birth', 'student_id']


class ParentSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = Parent
        fields = ['id', 'user', 'full_name', 'email', 'phone', 'children']


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'school', 'shift', 'lesson_number', 'start_time',
                  'end_time']


class ScheduleSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)

    class Meta:
        model = Schedule
        fields = ['id', 'school', 'academic_year', 'name', 'status',
                  'created_by', 'created_by_name', 'created_at']
        read_only_fields = ['created_by']


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
    grade_name = serializers.StringRelatedField(source='grade', read_only=True)
    subject_name = serializers.StringRelatedField(source='subject', read_only=True)

    class Meta:
        model = SubjectHours
        fields = ['id', 'grade', 'grade_name', 'subject', 'subject_name', 'hours']


class LessonReplacementSerializer(serializers.ModelSerializer):
    original_teacher_name = serializers.CharField(source='original_teacher.user.full_name', read_only=True)
    replacement_teacher_name = serializers.CharField(source='replacement_teacher.user.full_name', read_only=True)
    replacement_room_number = serializers.CharField(source='replacement_room.number', read_only=True)
    lesson_subject_name = serializers.CharField(source='lesson.subject.name', read_only=True)
    lesson_grade_name = serializers.CharField(source='lesson.grade.__str__', read_only=True)

    class Meta:
        model = LessonReplacement
        fields = ['id', 'lesson', 'date', 'original_teacher',
                  'original_teacher_name', 'replacement_teacher',
                  'replacement_teacher_name', 'replacement_room',
                  'replacement_room_number', 'lesson_subject_name',
                  'lesson_grade_name', 'status', 'reason', 'created_by',
                  'created_at']
        read_only_fields = ['lesson', 'original_teacher', 'created_by']


class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.full_name', read_only=True)
    marked_by_name = serializers.CharField(source='marked_by.full_name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'student_name', 'lesson', 'date',
                  'status', 'comment', 'marked_by', 'marked_by_name']
        read_only_fields = ['marked_by']


class MarkSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.full_name', read_only=True)

    class Meta:
        model = Mark
        fields = ['id', 'student', 'student_name', 'subject', 'subject_name',
                  'teacher', 'teacher_name', 'value', 'mark_type', 'date', 'comment']
        read_only_fields = ['teacher']

    def validate_value(self, value):
        if value < 1 or value > 100:
            raise serializers.ValidationError('Оценка должна быть от 1 до 100')
        return value


class HomeworkSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.user.full_name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    grade_name = serializers.StringRelatedField(source='grade', read_only=True)

    class Meta:
        model = Homework
        fields = ['id', 'teacher', 'teacher_name', 'grade', 'grade_name',
                  'subject', 'subject_name', 'title', 'description', 'file',
                  'deadline', 'created_at']
        read_only_fields = ['teacher']


class AnnouncementSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.full_name', read_only=True)

    class Meta:
        model = Announcement
        fields = ['id', 'school', 'author', 'author_name', 'title',
                  'text', 'target', 'target_grade', 'created_at']
        read_only_fields = ['school', 'author']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'notification_type', 'title', 'message',
                  'is_read', 'created_at']
