from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Teacher, Group, Subject, Room, Schedule


class TeacherSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Teacher
        fields = ['id', 'first_name', 'last_name', 'patronymic', 'full_name', 'email', 'phone']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code']


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'number', 'capacity']


class ScheduleSerializer(serializers.ModelSerializer):
    day_of_week_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    room_number = serializers.CharField(source='room.number', read_only=True)

    class Meta:
        model = Schedule
        fields = [
            'id',
            'teacher',
            'group',
            'subject',
            'room',
            'day_of_week',
            'day_of_week_display',
            'start_time',
            'end_time',
            'teacher_name',
            'group_name',
            'subject_name',
            'room_number',
        ]

    def validate(self, attrs):
        # Собираем инстанс для проверки clean()
        instance = Schedule(
            teacher=attrs.get('teacher', getattr(self.instance, 'teacher', None)),
            group=attrs.get('group', getattr(self.instance, 'group', None)),
            subject=attrs.get('subject', getattr(self.instance, 'subject', None)),
            room=attrs.get('room', getattr(self.instance, 'room', None)),
            day_of_week=attrs.get('day_of_week', getattr(self.instance, 'day_of_week', None)),
            start_time=attrs.get('start_time', getattr(self.instance, 'start_time', None)),
            end_time=attrs.get('end_time', getattr(self.instance, 'end_time', None)),
        )
        if self.instance:
            instance.pk = self.instance.pk

        try:
            instance.clean()
        except DjangoValidationError as exc:
            if hasattr(exc, 'message_dict'):
                raise serializers.ValidationError(exc.message_dict)
            raise serializers.ValidationError(exc.messages)

        return attrs
