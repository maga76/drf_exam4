from datetime import time

from rest_framework import status
from rest_framework.test import APITestCase

from .models import (
    AcademicYear,
    Grade,
    Mark,
    Notification,
    Room,
    Schedule,
    School,
    Student,
    Subject,
    SubjectHours,
    Teacher,
    TimeSlot,
    User,
)
from .scheduler import generate_schedule


class SmartSchoolApiTests(APITestCase):
    def setUp(self):
        self.school = School.objects.create(
            name='Smart School',
            address='Dushanbe',
            status='active'
        )

        self.admin = User.objects.create_user(
            username='admin',
            password='admin123',
            role='super_admin',
            school=self.school
        )

        self.client.force_authenticate(self.admin)

    def test_login(self):
        self.client.force_authenticate(user=None)
        response = self.client.post('/api/auth/login/', {
            'username': 'admin',
            'password': 'admin123',
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_school_list(self):
        response = self.client.get('/api/schools/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_super_admin_can_create_school_and_role_accounts(self):
        school_response = self.client.post('/api/schools/', {
            'name': 'New School',
            'address': 'Khujand',
            'phone': '+992900000000',
            'email': 'school@example.com',
            'status': 'active',
        })

        self.assertEqual(school_response.status_code, status.HTTP_201_CREATED)
        school_id = school_response.data['id']

        roles = ['school_admin', 'deputy', 'teacher', 'student', 'parent']
        for role in roles:
            response = self.client.post('/api/users/', {
                'username': role,
                'password': 'password123',
                'first_name': role,
                'last_name': 'Test',
                'role': role,
                'school': school_id,
                'is_active': True,
            })
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        teacher = User.objects.get(username='teacher')
        student = User.objects.get(username='student')
        parent = User.objects.get(username='parent')

        self.assertTrue(teacher.check_password('password123'))
        self.assertTrue(hasattr(teacher, 'teacher_profile'))
        self.assertTrue(hasattr(student, 'student_profile'))
        self.assertTrue(hasattr(parent, 'parent_profile'))

    def test_school_admin_sees_only_own_school_users(self):
        other_school = School.objects.create(name='Other', address='Hisor')
        User.objects.create_user(
            username='other_student',
            password='password123',
            role='student',
            school=other_school,
        )
        school_admin = User.objects.create_user(
            username='school_director',
            password='password123',
            role='school_admin',
            school=self.school,
        )
        User.objects.create_user(
            username='own_student',
            password='password123',
            role='student',
            school=self.school,
        )

        self.client.force_authenticate(school_admin)
        response = self.client.get('/api/users/')
        usernames = [item['username'] for item in response.data]

        self.assertIn('own_student', usernames)
        self.assertNotIn('other_student', usernames)
        self.assertNotIn('admin', usernames)

    def test_schedule_generator(self):
        year = AcademicYear.objects.create(
            school=self.school,
            name='2026/2027',
            start_date='2026-09-01',
            end_date='2027-06-01',
            is_current=True
        )
        subject = Subject.objects.create(
            school=self.school,
            name='Math',
            short_name='Math'
        )
        room = Room.objects.create(
            school=self.school,
            number='101'
        )
        grade = Grade.objects.create(
            school=self.school,
            academic_year=year,
            number=9,
            letter='A',
            home_room=room
        )
        teacher_user = User.objects.create_user(
            username='teacher',
            password='teacher123',
            role='teacher',
            school=self.school
        )
        teacher = Teacher.objects.create(user=teacher_user)
        teacher.subjects.add(subject)
        teacher.grades.add(grade)

        TimeSlot.objects.create(
            school=self.school,
            shift=1,
            lesson_number=1,
            start_time=time(8, 0),
            end_time=time(8, 45)
        )
        SubjectHours.objects.create(
            grade=grade,
            subject=subject,
            hours=1
        )
        schedule = Schedule.objects.create(
            school=self.school,
            academic_year=year,
            name='Main schedule',
            created_by=self.admin
        )

        result = generate_schedule(schedule)

        self.assertEqual(result['conflicts'], 0)
        self.assertEqual(schedule.lessons.count(), 1)

    def test_mark_creates_notification(self):
        year = AcademicYear.objects.create(
            school=self.school,
            name='2026/2027',
            start_date='2026-09-01',
            end_date='2027-06-01'
        )
        subject = Subject.objects.create(
            school=self.school,
            name='English'
        )
        grade = Grade.objects.create(
            school=self.school,
            academic_year=year,
            number=8,
            letter='B'
        )
        student_user = User.objects.create_user(
            username='student',
            password='student123',
            role='student',
            school=self.school
        )
        student = Student.objects.create(
            user=student_user,
            grade=grade,
            student_id='S001'
        )
        teacher_user = User.objects.create_user(
            username='teacher2',
            password='teacher123',
            role='teacher',
            school=self.school
        )
        teacher = Teacher.objects.create(user=teacher_user)

        Mark.objects.create(
            student=student,
            subject=subject,
            teacher=teacher,
            value=5,
            date='2026-09-30'
        )

        notification_exists = Notification.objects.filter(
            user=student_user,
            notification_type='new_mark'
        ).exists()

        self.assertTrue(notification_exists)
