from datetime import time
from django.test import TestCase
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Teacher, Group, Subject, Room, Schedule


class ScheduleModelValidationTests(TestCase):
    def setUp(self):
        self.teacher1 = Teacher.objects.create(first_name="Иван", last_name="Иванов")
        self.teacher2 = Teacher.objects.create(first_name="Петр", last_name="Петров")
        self.group1 = Group.objects.create(name="10-А")
        self.group2 = Group.objects.create(name="10-Б")
        self.subject1 = Subject.objects.create(name="Алгебра")
        self.subject2 = Subject.objects.create(name="Геометрия")
        self.room1 = Room.objects.create(number="101")
        self.room2 = Room.objects.create(number="102")

        # Базовое занятие: Понедельник, 10:00 - 11:00
        self.base_schedule = Schedule.objects.create(
            teacher=self.teacher1,
            group=self.group1,
            subject=self.subject1,
            room=self.room1,
            day_of_week=1,
            start_time=time(10, 0),
            end_time=time(11, 0)
        )

    def test_invalid_time_order(self):
        """Проверка ошибки, если время окончания меньше или равно времени начала"""
        schedule = Schedule(
            teacher=self.teacher2,
            group=self.group2,
            subject=self.subject2,
            room=self.room2,
            day_of_week=1,
            start_time=time(12, 0),
            end_time=time(11, 0)
        )
        with self.assertRaises(ValidationError) as ctx:
            schedule.clean()
        self.assertIn('end_time', ctx.exception.message_dict)

    def test_teacher_conflict_partial_overlap(self):
        """Преподаватель не может вести два урока одновременно (10:30 - 11:30 при существующем 10:00 - 11:00)"""
        conflict_schedule = Schedule(
            teacher=self.teacher1, # Тот же преподаватель!
            group=self.group2,
            subject=self.subject2,
            room=self.room2,
            day_of_week=1,
            start_time=time(10, 30),
            end_time=time(11, 30)
        )
        with self.assertRaises(ValidationError) as ctx:
            conflict_schedule.clean()
        self.assertIn('teacher', ctx.exception.message_dict)

    def test_room_conflict_partial_overlap(self):
        """Кабинет не может быть занят двумя группами в одно время (10:15 - 10:45)"""
        conflict_schedule = Schedule(
            teacher=self.teacher2,
            group=self.group2,
            subject=self.subject2,
            room=self.room1, # Тот же кабинет!
            day_of_week=1,
            start_time=time(10, 15),
            end_time=time(10, 45)
        )
        with self.assertRaises(ValidationError) as ctx:
            conflict_schedule.clean()
        self.assertIn('room', ctx.exception.message_dict)

    def test_group_conflict_partial_overlap(self):
        """Группа не может быть на двух уроках одновременно (09:30 - 10:30)"""
        conflict_schedule = Schedule(
            teacher=self.teacher2,
            group=self.group1, # Та же группа!
            subject=self.subject2,
            room=self.room2,
            day_of_week=1,
            start_time=time(9, 30),
            end_time=time(10, 30)
        )
        with self.assertRaises(ValidationError) as ctx:
            conflict_schedule.clean()
        self.assertIn('group', ctx.exception.message_dict)

    def test_no_conflict_different_day_or_consecutive_time(self):
        """Занятие сразу после (11:00 - 12:00) или в другой день допустимо"""
        # Сразу следующее занятие (11:00 стык в стык)
        consecutive = Schedule(
            teacher=self.teacher1,
            group=self.group1,
            subject=self.subject1,
            room=self.room1,
            day_of_week=1,
            start_time=time(11, 0),
            end_time=time(12, 0)
        )
        consecutive.clean() # Должно пройти без ошибок!

        # В другой день (Вторник 10:00 - 11:00)
        different_day = Schedule(
            teacher=self.teacher1,
            group=self.group1,
            subject=self.subject1,
            room=self.room1,
            day_of_week=2,
            start_time=time(10, 0),
            end_time=time(11, 0)
        )
        different_day.clean() # Должно пройти без ошибок!


class ScheduleAPITests(APITestCase):
    def setUp(self):
        self.teacher = Teacher.objects.create(first_name="Анна", last_name="Смирнова")
        self.group = Group.objects.create(name="9-В")
        self.subject = Subject.objects.create(name="Химия")
        self.room = Room.objects.create(number="305")

        self.schedule = Schedule.objects.create(
            teacher=self.teacher,
            group=self.group,
            subject=self.subject,
            room=self.room,
            day_of_week=1,
            start_time=time(8, 30),
            end_time=time(9, 15)
        )

    def test_list_schedules(self):
        response = self.client.get('/api/timetable/schedules/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_filter_schedules_by_teacher(self):
        response = self.client.get(f'/api/timetable/schedules/?teacher={self.teacher.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['teacher_name'], self.teacher.full_name)

    def test_api_conflict_error_returned_cleanly(self):
        """API должно возвращать HTTP 400 и структурированное сообщение об ошибке при конфликте"""
        data = {
            "teacher": self.teacher.id, # Конфликт учителя
            "group": self.group.id,
            "subject": self.subject.id,
            "room": self.room.id,
            "day_of_week": 1,
            "start_time": "08:45:00",
            "end_time": "09:30:00"
        }
        response = self.client.post('/api/timetable/schedules/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Должен быть ключ ошибки по учителю или группе
        self.assertTrue('teacher' in response.data or 'group' in response.data or 'room' in response.data)

    def test_create_valid_schedule_api(self):
        data = {
            "teacher": self.teacher.id,
            "group": self.group.id,
            "subject": self.subject.id,
            "room": self.room.id,
            "day_of_week": 2, # Вторник (нет конфликта)
            "start_time": "08:30:00",
            "end_time": "09:15:00"
        }
        response = self.client.post('/api/timetable/schedules/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
