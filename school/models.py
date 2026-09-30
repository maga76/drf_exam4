from django.contrib.auth.models import AbstractUser
from django.db import models


ROLE_CHOICES = (
    ('super_admin', 'Super Admin'),
    ('school_admin', 'School Admin'),
    ('deputy', 'Deputy'),
    ('teacher', 'Teacher'),
    ('class_teacher', 'Class Teacher'),
    ('student', 'Student'),
    ('parent', 'Parent'),
)

SCHOOL_STATUS_CHOICES = (
    ('active', 'Active'),
    ('blocked', 'Blocked'),
    ('trial', 'Trial'),
)

ROOM_TYPE_CHOICES = (
    ('regular', 'Regular'),
    ('computer', 'Computer'),
    ('gym', 'Gym'),
    ('chemistry', 'Chemistry'),
    ('physics', 'Physics'),
    ('art', 'Art'),
    ('music', 'Music'),
    ('other', 'Other'),
)

TEACHER_STATUS_CHOICES = (
    ('free', 'Free'),
    ('in_lesson', 'In Lesson'),
    ('absent', 'Absent'),
    ('sick', 'Sick'),
    ('vacation', 'Vacation'),
)

DAY_CHOICES = (
    (1, 'Monday'),
    (2, 'Tuesday'),
    (3, 'Wednesday'),
    (4, 'Thursday'),
    (5, 'Friday'),
    (6, 'Saturday'),
)

SCHEDULE_STATUS_CHOICES = (
    ('draft', 'Draft'),
    ('active', 'Active'),
    ('archived', 'Archived'),
)

REPLACEMENT_STATUS_CHOICES = (
    ('pending', 'Pending'),
    ('confirmed', 'Confirmed'),
    ('cancelled', 'Cancelled'),
)

ATTENDANCE_STATUS_CHOICES = (
    ('present', 'Present'),
    ('absent', 'Absent'),
    ('late', 'Late'),
    ('excused', 'Excused'),
)

MARK_TYPE_CHOICES = (
    ('regular', 'Regular'),
    ('test', 'Test'),
    ('exam', 'Exam'),
    ('homework', 'Homework'),
)

ANNOUNCEMENT_TARGET_CHOICES = (
    ('all', 'All'),
    ('teachers', 'Teachers'),
    ('students', 'Students'),
    ('parents', 'Parents'),
    ('grade', 'Grade'),
)

NOTIFICATION_TYPE_CHOICES = (
    ('lesson_changed', 'Lesson Changed'),
    ('teacher_replaced', 'Teacher Replaced'),
    ('room_changed', 'Room Changed'),
    ('lesson_cancelled', 'Lesson Cancelled'),
    ('new_homework', 'New Homework'),
    ('new_mark', 'New Mark'),
    ('announcement', 'Announcement'),
)


class User(AbstractUser):
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    middle_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to='users/photos/', blank=True, null=True)
    school = models.ForeignKey('School', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    def __str__(self):
        return self.last_name + ' ' + self.first_name


class School(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    logo = models.ImageField(upload_to='schools/logos/', blank=True, null=True)
    status = models.CharField(max_length=10, choices=SCHOOL_STATUS_CHOICES, default='trial')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Building(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='buildings')
    name = models.CharField(max_length=100)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.name


class AcademicYear(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='academic_years')
    name = models.CharField(max_length=20)
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Subject(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=20, blank=True)
    requires_special_room = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Room(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='rooms')
    building = models.ForeignKey(Building, on_delete=models.SET_NULL, null=True, blank=True, related_name='rooms')
    number = models.CharField(max_length=20)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPE_CHOICES, default='regular')
    floor = models.IntegerField(default=1)
    capacity = models.IntegerField(default=30)
    suitable_for = models.ManyToManyField(Subject, blank=True, related_name='rooms')

    def __str__(self):
        return 'Room ' + self.number


class Grade(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='grades')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name='grades')
    number = models.IntegerField()
    letter = models.CharField(max_length=5)
    shift = models.IntegerField(default=1)
    class_teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_grades')
    home_room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True, related_name='home_grades')

    def __str__(self):
        return str(self.number) + self.letter

    class Meta:
        unique_together = ('school', 'academic_year', 'number', 'letter')


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    subjects = models.ManyToManyField(Subject, related_name='teachers')
    grades = models.ManyToManyField(Grade, blank=True, related_name='teachers')
    hours_per_week = models.IntegerField(default=18)
    max_hours_per_day = models.IntegerField(default=6)
    main_room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True, related_name='main_teachers')
    status = models.CharField(max_length=20, choices=TEACHER_STATUS_CHOICES, default='free')

    def __str__(self):
        return str(self.user)


class TeacherAvailability(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='availability')
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    is_available = models.BooleanField(default=True)
    time_from = models.TimeField()
    time_to = models.TimeField()

    def __str__(self):
        return str(self.teacher) + ' - ' + self.get_day_of_week_display()


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    grade = models.ForeignKey(Grade, on_delete=models.SET_NULL, null=True, blank=True, related_name='students')
    date_of_birth = models.DateField(null=True, blank=True)
    student_id = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return str(self.user)


class Parent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='parent_profile')
    children = models.ManyToManyField(Student, related_name='parents')

    def __str__(self):
        return str(self.user)


class TimeSlot(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='time_slots')
    shift = models.IntegerField(default=1)
    lesson_number = models.IntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return 'Lesson ' + str(self.lesson_number)

    class Meta:
        ordering = ['shift', 'lesson_number']


class Schedule(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='schedules')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE, related_name='schedules')
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=SCHEDULE_STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_schedules')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Lesson(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='lessons')
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name='lessons')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='lessons')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='lessons')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='lessons')
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, related_name='lessons')
    day_of_week = models.IntegerField(choices=DAY_CHOICES)

    def __str__(self):
        return str(self.grade) + ' - ' + str(self.subject)

    class Meta:
        unique_together = [
            ('schedule', 'teacher', 'day_of_week', 'time_slot'),
            ('schedule', 'grade', 'day_of_week', 'time_slot'),
            ('schedule', 'room', 'day_of_week', 'time_slot'),
        ]


class SubjectHours(models.Model):
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name='subject_hours')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='grade_hours')
    hours = models.IntegerField()

    def __str__(self):
        return str(self.grade) + ' - ' + str(self.subject)

    class Meta:
        unique_together = ('grade', 'subject')


class LessonReplacement(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='replacements')
    date = models.DateField()
    original_teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='original_replacements')
    replacement_teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True, related_name='replacement_lessons')
    replacement_room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=15, choices=REPLACEMENT_STATUS_CHOICES, default='pending')
    reason = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_replacements')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'Replacement ' + str(self.date)


class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='attendance')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=ATTENDANCE_STATUS_CHOICES, default='present')
    comment = models.TextField(blank=True)
    marked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return str(self.student) + ' - ' + str(self.date)

    class Meta:
        unique_together = ('student', 'lesson', 'date')


class Mark(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='marks')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='marks')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='given_marks')
    value = models.IntegerField()
    mark_type = models.CharField(max_length=10, choices=MARK_TYPE_CHOICES, default='regular')
    date = models.DateField()
    comment = models.TextField(blank=True)

    def __str__(self):
        return str(self.student) + ' - ' + str(self.value)


class Homework(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='homeworks')
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name='homeworks')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='homeworks')
    title = models.CharField(max_length=200)
    description = models.TextField()
    file = models.FileField(upload_to='homeworks/', blank=True, null=True)
    deadline = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Announcement(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='announcements')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='announcements')
    title = models.CharField(max_length=200)
    text = models.TextField()
    target = models.CharField(max_length=10, choices=ANNOUNCEMENT_TARGET_CHOICES, default='all')
    target_grade = models.ForeignKey(Grade, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
