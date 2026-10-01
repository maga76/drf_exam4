from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from school.models import (
    AcademicYear, Grade, Lesson, Room, Schedule, School,
    Subject, Teacher, TimeSlot, User
)


class SmartSchoolAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create Schools
        self.school_1 = School.objects.create(name="Школа №1", address="ул. Ленина 1", status="active")
        self.school_2 = School.objects.create(name="Школа №2", address="ул. Мира 5", status="active")

        # Create Users
        self.super_admin = User.objects.create_superuser(
            username="superadmin", email="super@school.tj", password="password123",
            first_name="Бахтиёр", last_name="Содиков", role="super_admin"
        )
        self.admin_1 = User.objects.create_user(
            username="admin1", email="admin1@school.tj", password="password123",
            first_name="Фарангис", last_name="Ахмедова", role="school_admin", school=self.school_1
        )
        self.teacher_user = User.objects.create_user(
            username="teacher1", email="teacher1@school.tj", password="password123",
            first_name="Мадина", last_name="Каримова", role="teacher", school=self.school_1
        )
        self.teacher_profile, _ = Teacher.objects.get_or_create(user=self.teacher_user)

        self.student_user = User.objects.create_user(
            username="student1", email="student1@school.tj", password="password123",
            first_name="Алишер", last_name="Шарипов", role="student", school=self.school_1
        )

        # Academic Year, Room, Subject, Grade
        self.ay = AcademicYear.objects.create(
            school=self.school_1, name="2025-2026", start_date="2025-09-01", end_date="2026-05-25", is_current=True
        )
        self.room = Room.objects.create(school=self.school_1, number="101", floor=1, capacity=30)
        self.subject = Subject.objects.create(school=self.school_1, name="Алгебра", short_name="Алг")
        self.grade = Grade.objects.create(
            school=self.school_1, academic_year=self.ay, number=7, letter="A", home_room=self.room
        )
        self.slot = TimeSlot.objects.create(
            school=self.school_1, shift=1, lesson_number=1, start_time="08:00:00", end_time="08:45:00"
        )
        self.schedule = Schedule.objects.create(
            school=self.school_1, academic_year=self.ay, name="Основное расписание", status="active"
        )
        self.lesson = Lesson.objects.create(
            schedule=self.schedule, grade=self.grade, subject=self.subject,
            teacher=self.teacher_profile, room=self.room, time_slot=self.slot, day_of_week=1
        )

    def test_custom_jwt_login(self):
        """Test that login returns tokens and rich user details"""
        response = self.client.post('/api/auth/login/', {
            'username': 'admin1',
            'password': 'password123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['role'], 'school_admin')
        self.assertEqual(response.data['user']['school'], self.school_1.id)
        self.assertEqual(response.data['user']['school_name'], 'Школа №1')

    def test_auth_me(self):
        """Test /api/auth/me/ endpoint returns current authenticated user"""
        self.client.force_authenticate(user=self.teacher_user)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'teacher1')
        self.assertEqual(response.data['role'], 'teacher')

    def test_dashboard_stats(self):
        """Test dashboard returns correct aggregated counts"""
        self.client.force_authenticate(user=self.admin_1)
        response = self.client.get('/api/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('teachers', response.data)
        self.assertIn('grades', response.data)
        self.assertIn('rooms', response.data)
        self.assertEqual(response.data['teachers'], 1)
        self.assertEqual(response.data['grades'], 1)
        self.assertEqual(response.data['rooms'], 1)

    def test_teacher_workload(self):
        """Test teacher workload endpoint with active scheduled lessons"""
        self.client.force_authenticate(user=self.admin_1)
        response = self.client.get(f'/api/teachers/{self.teacher_profile.id}/workload/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['scheduled_lessons'], 1)
        self.assertEqual(response.data['teacher_id'], self.teacher_profile.id)

    def test_teacher_workload_not_found(self):
        """Test teacher workload returns 404 instead of 500 when teacher doesn't exist"""
        self.client.force_authenticate(user=self.admin_1)
        response = self.client.get('/api/teachers/99999/workload/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_student_cannot_delete_grade(self):
        """Test student has read-only access and cannot delete grades (Security Check)"""
        self.client.force_authenticate(user=self.student_user)
        # GET should be allowed (Read Only)
        get_res = self.client.get('/api/grades/')
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)

        # DELETE must be forbidden (403)
        del_res = self.client.delete(f'/api/grades/{self.grade.id}/')
        self.assertEqual(del_res.status_code, status.HTTP_403_FORBIDDEN)
