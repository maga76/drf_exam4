from django.core.management.base import BaseCommand
from datetime import time
from timetable.models import Teacher, Group, Subject, Room, Schedule


class Command(BaseCommand):
    help = "Заполнить базу начальными данными для расписания"

    def handle(self, *args, **options):
        # 1. Преподаватели
        teachers_data = [
            {"first_name": "Алишер", "last_name": "Каримов", "patronymic": "Рустамович", "email": "karimov@school.tj", "phone": "+992900010101"},
            {"first_name": "Нигина", "last_name": "Рахимова", "patronymic": "Саидовна", "email": "rahimova@school.tj", "phone": "+992900010102"},
            {"first_name": "Фарход", "last_name": "Шарипов", "patronymic": "Икромович", "email": "sharipov@school.tj", "phone": "+992900010103"},
            {"first_name": "Тахмина", "last_name": "Юсупова", "patronymic": "Бахромовна", "email": "yusupova@school.tj", "phone": "+992900010104"},
            {"first_name": "Джамшед", "last_name": "Назаров", "patronymic": "Холматович", "email": "nazarov@school.tj", "phone": "+992900010105"},
        ]
        teachers = []
        for td in teachers_data:
            teacher, _ = Teacher.objects.get_or_create(
                first_name=td["first_name"],
                last_name=td["last_name"],
                defaults=td
            )
            teachers.append(teacher)

        # 2. Предметы
        subjects_data = [
            {"name": "Высшая математика", "code": "MATH101"},
            {"name": "Информатика и Python", "code": "CS102"},
            {"name": "Физика", "code": "PHYS103"},
            {"name": "Английский язык", "code": "ENG104"},
            {"name": "История", "code": "HIST105"},
        ]
        subjects = []
        for sd in subjects_data:
            subj, _ = Subject.objects.get_or_create(name=sd["name"], defaults=sd)
            subjects.append(subj)

        # 3. Группы
        groups_data = ["ИТ-21", "ИТ-22", "10-А", "11-Б", "ФИЗ-1"]
        groups = []
        for gd in groups_data:
            grp, _ = Group.objects.get_or_create(name=gd)
            groups.append(grp)

        # 4. Кабинеты
        rooms_data = [
            {"number": "101", "capacity": 30},
            {"number": "205", "capacity": 35},
            {"number": "310", "capacity": 40},
            {"number": "Лаборатория IT", "capacity": 25},
            {"number": "Актовый зал", "capacity": 100},
        ]
        rooms = []
        for rd in rooms_data:
            rm, _ = Room.objects.get_or_create(number=rd["number"], defaults=rd)
            rooms.append(rm)

        # 5. Расписание
        # Пн, Вт, Ср, Чт, Пт
        schedules_plan = [
            # Понедельник
            (teachers[0], groups[0], subjects[0], rooms[0], 1, time(9, 0), time(10, 30)),
            (teachers[1], groups[1], subjects[1], rooms[3], 1, time(9, 0), time(10, 30)),
            (teachers[0], groups[1], subjects[0], rooms[0], 1, time(10, 45), time(12, 15)),
            (teachers[2], groups[0], subjects[2], rooms[1], 1, time(10, 45), time(12, 15)),
            # Вторник
            (teachers[3], groups[0], subjects[3], rooms[2], 2, time(9, 0), time(10, 30)),
            (teachers[4], groups[2], subjects[4], rooms[1], 2, time(9, 0), time(10, 30)),
            (teachers[1], groups[0], subjects[1], rooms[3], 2, time(11, 0), time(12, 30)),
            # Среда
            (teachers[0], groups[2], subjects[0], rooms[0], 3, time(9, 0), time(10, 30)),
            (teachers[2], groups[1], subjects[2], rooms[1], 3, time(9, 0), time(10, 30)),
            (teachers[3], groups[1], subjects[3], rooms[2], 3, time(11, 0), time(12, 30)),
            # Четверг
            (teachers[1], groups[0], subjects[1], rooms[3], 4, time(9, 0), time(10, 30)),
            (teachers[4], groups[0], subjects[4], rooms[1], 4, time(10, 45), time(12, 15)),
            # Пятница
            (teachers[0], groups[0], subjects[0], rooms[0], 5, time(9, 0), time(10, 30)),
            (teachers[3], groups[2], subjects[3], rooms[2], 5, time(9, 0), time(10, 30)),
        ]

        count = 0
        for t, g, s, r, day, st, en in schedules_plan:
            if not Schedule.objects.filter(day_of_week=day, start_time=st, teacher=t).exists():
                Schedule.objects.create(
                    teacher=t,
                    group=g,
                    subject=s,
                    room=r,
                    day_of_week=day,
                    start_time=st,
                    end_time=en
                )
                count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Успешно инициализированы данные! Преподавателей: {len(teachers)}, Групп: {len(groups)}, "
            f"Предметов: {len(subjects)}, Кабинетов: {len(rooms)}, Создано уроков в расписании: {count}"
        ))
