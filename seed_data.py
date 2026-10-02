import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from school.models import (
    School, Building, AcademicYear, Subject, Room, Grade, Teacher, Student, TimeSlot, Schedule, Lesson, LessonReplacement
)
from django.contrib.auth import get_user_model
from datetime import date

User = get_user_model()

print("Populating database with real school data...")

# 1. School
school, _ = School.objects.get_or_create(
    name="СОШ №12 им. А. Рудаки",
    defaults={
        "address": "г. Душанбе, ул. Рудаки, 142",
        "phone": "+992 (37) 224-55-12",
        "email": "info@school12.tj",
        "status": "active"
    }
)

# 2. Building
bld, _ = Building.objects.get_or_create(
    school=school,
    name="Главный корпус",
    defaults={"address": "ул. Рудаки, 142"}
)

# 3. Academic Year
ay, _ = AcademicYear.objects.get_or_create(
    school=school,
    name="2025–2026",
    defaults={"start_date": "2025-09-01", "end_date": "2026-05-25", "is_current": True}
)

# 4. Rooms
rooms_data = [
    ("101", "regular", 30, 1),
    ("102", "regular", 25, 1),
    ("201", "computer", 28, 2),
    ("204", "regular", 32, 2),
    ("208", "chemistry", 26, 2),
    ("301", "physics", 30, 3),
    ("302", "regular", 32, 3),
    ("Спортзал", "gym", 60, 1),
]
created_rooms = {}
for num, rtype, cap, fl in rooms_data:
    r, _ = Room.objects.get_or_create(
        school=school,
        number=num,
        defaults={"room_type": rtype, "capacity": cap, "floor": fl, "building": bld}
    )
    created_rooms[num] = r

# 5. Subjects
subjects_data = [
    ("Математика", "МАТ"),
    ("Алгебра", "АЛГ"),
    ("Геометрия", "ГЕО"),
    ("Русский язык и литература", "РУС"),
    ("Информатика", "ИНФ"),
    ("Физика", "ФИЗ"),
    ("Химия", "ХИМ"),
    ("Английский язык", "АНГ"),
    ("Физическая культура", "ФИЗ-РА"),
    ("История", "ИСТ"),
]
created_subjects = {}
for name, short in subjects_data:
    sub, _ = Subject.objects.get_or_create(
        school=school,
        name=name,
        defaults={"short_name": short}
    )
    created_subjects[name] = sub

# 6. Teachers
teachers_list = [
    ("Саидова Нигора Акмаловна", "Русский язык и литература", "saidova_n", "+992918884433", "101"),
    ("Рахимов Фарход Зарифович", "Информатика", "rakhimov_f", "+992985551234", "201"),
    ("Холматов Бахром Салимович", "Химия", "kholmatov_b", "+992927112233", "208"),
    ("Юсупова Зебо Давлатовна", "Английский язык", "yusupova_z", "+992934446677", "102"),
    ("Назаров Джамшед Шухратович", "Физическая культура", "nazarov_d", "+992903216543", "Спортзал"),
    ("Алиев Сардор Каримович", "Физика", "aliev_s", "+992931112233", "301"),
    ("Бобоев Темур Исламович", "Алгебра", "boboev_t", "+992924445566", "302"),
]

created_teachers = {}
for full_name, sub_name, uname, phone, rnum in teachers_list:
    parts = full_name.split()
    u, _ = User.objects.get_or_create(
        username=uname,
        defaults={
            "first_name": parts[1] if len(parts) > 1 else "",
            "last_name": parts[0],
            "middle_name": parts[2] if len(parts) > 2 else "",
            "role": "teacher",
            "school": school,
            "phone": phone
        }
    )
    u.set_password("teacher123")
    u.save()

    t, _ = Teacher.objects.get_or_create(
        user=u,
        defaults={
            "main_room": created_rooms.get(rnum),
            "hours_per_week": 24
        }
    )
    if sub_name in created_subjects:
        t.subjects.add(created_subjects[sub_name])
    created_teachers[full_name] = t

# 7. Grades
grades_list = [
    (7, "А", 1, "Саидова Нигора Акмаловна", "101"),
    (7, "Б", 1, "Юсупова Зебо Давлатовна", "102"),
    (8, "А", 1, "Рахимов Фарход Зарифович", "201"),
    (9, "Б", 2, "Холматов Бахром Салимович", "208"),
    (10, "А", 1, "Бобоев Темур Исламович", "302"),
    (11, "А", 1, "Алиев Сардор Каримович", "301"),
]

created_grades = {}
for g_num, letter, shift, ht_name, rnum in grades_list:
    ht_user = created_teachers[ht_name].user if ht_name in created_teachers else None
    grade, _ = Grade.objects.get_or_create(
        school=school,
        academic_year=ay,
        number=g_num,
        letter=letter,
        defaults={
            "shift": shift,
            "class_teacher": ht_user,
            "home_room": created_rooms.get(rnum)
        }
    )
    created_grades[f"{g_num}{letter}"] = grade

# 8. Students
students_list = [
    ("Азизов Далер Сардорович", "7А", "azizov_d"),
    ("Каримова Мадина Рустамовна", "7А", "karimova_m"),
    ("Мирзоев Джахонгир Бахтиёрович", "7А", "mirzoev_j"),
    ("Саидова Фарангис Алишеровна", "7Б", "saidova_f"),
    ("Шарипов Умед Шухратович", "8А", "sharipov_u"),
    ("Хамидова Зарина Олимовна", "9Б", "khamidova_z"),
    ("Юсупов Амир Фарходович", "10А", "yusupov_a"),
    ("Эргашев Шохин Бахромович", "11А", "ergashev_sh"),
]

for full_name, g_name, uname in students_list:
    parts = full_name.split()
    u, _ = User.objects.get_or_create(
        username=uname,
        defaults={
            "first_name": parts[1] if len(parts) > 1 else "",
            "last_name": parts[0],
            "middle_name": parts[2] if len(parts) > 2 else "",
            "role": "student",
            "school": school
        }
    )
    u.set_password("student123")
    u.save()

    Student.objects.get_or_create(
        user=u,
        defaults={"grade": created_grades.get(g_name), "student_id": f"ST-{uname}"}
    )

# 9. Time Slots
slots_data = [
    (1, "08:30:00", "09:15:00", 1),
    (2, "09:25:00", "10:10:00", 1),
    (3, "10:30:00", "11:15:00", 1),
    (4, "11:25:00", "12:10:00", 1),
    (5, "12:20:00", "13:05:00", 1),
]

created_slots = {}
for num, start, end, shift in slots_data:
    slot, _ = TimeSlot.objects.get_or_create(
        school=school,
        lesson_number=num,
        shift=shift,
        defaults={"start_time": start, "end_time": end}
    )
    created_slots[num] = slot

# 10. Schedule and Lessons
admin_user = User.objects.filter(is_superuser=True).first()
main_schedule, _ = Schedule.objects.get_or_create(
    school=school,
    academic_year=ay,
    name="Основное расписание 2025-2026",
    defaults={"status": "published", "created_by": admin_user}
)

schedule_plan = [
    # (день 1=Пн..6=Сб, слот 1..5, класс, предмет, учитель, комната)
    (1, 1, "7А", "Алгебра", "Бобоев Темур Исламович", "302"),
    (1, 2, "7А", "Русский язык и литература", "Саидова Нигора Акмаловна", "101"),
    (1, 3, "7А", "Информатика", "Рахимов Фарход Зарифович", "201"),
    (1, 4, "7А", "Физическая культура", "Назаров Джамшед Шухратович", "Спортзал"),
    (1, 5, "7А", "Английский язык", "Юсупова Зебо Давлатовна", "102"),

    (2, 1, "7А", "Физика", "Алиев Сардор Каримович", "301"),
    (2, 2, "7А", "Алгебра", "Бобоев Темур Исламович", "302"),
    (2, 3, "7А", "Химия", "Холматов Бахром Салимович", "208"),
    (2, 4, "7А", "Русский язык и литература", "Саидова Нигора Акмаловна", "101"),

    (3, 1, "7А", "Информатика", "Рахимов Фарход Зарифович", "201"),
    (3, 2, "7А", "Английский язык", "Юсупова Зебо Давлатовна", "102"),
    (3, 3, "7А", "Физика", "Алиев Сардор Каримович", "301"),
    (3, 4, "7А", "Физическая культура", "Назаров Джамшед Шухратович", "Спортзал"),

    (4, 1, "7А", "Алгебра", "Бобоев Темур Исламович", "302"),
    (4, 2, "7А", "Химия", "Холматов Бахром Салимович", "208"),
    (4, 3, "7А", "Русский язык и литература", "Саидова Нигора Акмаловна", "101"),

    (5, 1, "7А", "Информатика", "Рахимов Фарход Зарифович", "201"),
    (5, 2, "7А", "Английский язык", "Юсупова Зебо Давлатовна", "102"),
    (5, 3, "7А", "Физическая культура", "Назаров Джамшед Шухратович", "Спортзал"),

    (6, 1, "7А", "Геометрия", "Бобоев Темур Исламович", "302"),
    (6, 2, "7А", "История", "Саидова Нигора Акмаловна", "101"),
]

for day, slot_num, g_name, s_name, t_name, r_num in schedule_plan:
    Lesson.objects.get_or_create(
        schedule=main_schedule,
        grade=created_grades[g_name],
        day_of_week=day,
        time_slot=created_slots[slot_num],
        defaults={
            "subject": created_subjects[s_name],
            "teacher": created_teachers[t_name],
            "room": created_rooms[r_num],
        }
    )

# 11. Replacement
t_yusupova = created_teachers.get("Юсупова Зебо Давлатовна")
t_saidova = created_teachers.get("Саидова Нигора Акмаловна")
first_lesson = Lesson.objects.first()
if t_yusupova and t_saidova and first_lesson:
    LessonReplacement.objects.get_or_create(
        lesson=first_lesson,
        date=date.today(),
        defaults={
            "original_teacher": t_yusupova,
            "replacement_teacher": t_saidova,
            "reason": "Больничный лист",
            "status": "confirmed"
        }
    )

print("SUCCESS: Real school database is populated with teachers, students, rooms, and schedule!")
