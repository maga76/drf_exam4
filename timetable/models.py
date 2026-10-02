from django.db import models
from django.core.exceptions import ValidationError


class Teacher(models.Model):
    """Модель преподавателя"""
    first_name = models.CharField(max_length=100, verbose_name="Имя")
    last_name = models.CharField(max_length=100, verbose_name="Фамилия")
    patronymic = models.CharField(max_length=100, blank=True, default="", verbose_name="Отчество")
    email = models.EmailField(blank=True, default="", verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, default="", verbose_name="Телефон")

    class Meta:
        verbose_name = "Преподаватель"
        verbose_name_plural = "Преподаватели"
        ordering = ['last_name', 'first_name']

    @property
    def full_name(self):
        parts = [self.last_name, self.first_name, self.patronymic]
        return " ".join(p for p in parts if p).strip()

    def __str__(self):
        return self.full_name


class Group(models.Model):
    """Модель учебной группы"""
    name = models.CharField(max_length=50, unique=True, verbose_name="Название группы")

    class Meta:
        verbose_name = "Учебная группа"
        verbose_name_plural = "Учебные группы"
        ordering = ['name']

    def __str__(self):
        return self.name


class Subject(models.Model):
    """Модель учебного предмета"""
    name = models.CharField(max_length=100, unique=True, verbose_name="Название предмета")
    code = models.CharField(max_length=20, blank=True, default="", verbose_name="Код предмета")

    class Meta:
        verbose_name = "Предмет"
        verbose_name_plural = "Предметы"
        ordering = ['name']

    def __str__(self):
        return self.name


class Room(models.Model):
    """Модель учебного кабинета / аудитории"""
    number = models.CharField(max_length=50, unique=True, verbose_name="Номер кабинета")
    capacity = models.PositiveIntegerField(default=30, verbose_name="Вместимость")

    class Meta:
        verbose_name = "Кабинет"
        verbose_name_plural = "Кабинеты"
        ordering = ['number']

    def __str__(self):
        return f"Кабинет {self.number}"


class Schedule(models.Model):
    """Модель расписания занятий с валидацией пересечений времени"""
    DAY_CHOICES = [
        (1, "Понедельник"),
        (2, "Вторник"),
        (3, "Среда"),
        (4, "Четверг"),
        (5, "Пятница"),
        (6, "Суббота"),
        (7, "Воскресенье"),
    ]

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="schedules",
        verbose_name="Преподаватель"
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="schedules",
        verbose_name="Группа"
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="schedules",
        verbose_name="Предмет"
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="schedules",
        verbose_name="Кабинет"
    )
    day_of_week = models.PositiveSmallIntegerField(
        choices=DAY_CHOICES,
        verbose_name="День недели"
    )
    start_time = models.TimeField(verbose_name="Время начала")
    end_time = models.TimeField(verbose_name="Время окончания")

    class Meta:
        verbose_name = "Расписание занятия"
        verbose_name_plural = "Расписание занятий"
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        day_label = dict(self.DAY_CHOICES).get(self.day_of_week, f"День {self.day_of_week}")
        start = self.start_time.strftime('%H:%M') if self.start_time else ''
        end = self.end_time.strftime('%H:%M') if self.end_time else ''
        return f"{day_label} {start}-{end}: {self.subject} ({self.group}) - {self.teacher}"

    def clean(self):
        super().clean()

        # 1. Проверка порядка времени
        if self.start_time and self.end_time:
            if self.end_time <= self.start_time:
                raise ValidationError({
                    'end_time': "Время окончания должно быть позже времени начала."
                })

        # Если необходимые поля не заполнены, прерываем до проверки конфликтов
        if not (self.day_of_week and self.start_time and self.end_time):
            return

        # Базовый запрос на пересекающиеся по времени занятия в тот же день недели
        conflicts = Schedule.objects.filter(
            day_of_week=self.day_of_week,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time
        )

        if self.pk:
            conflicts = conflicts.exclude(pk=self.pk)

        # 2. Проверка занятости преподавателя
        if self.teacher_id:
            teacher_conflict = conflicts.filter(teacher_id=self.teacher_id).first()
            if teacher_conflict:
                t_start = teacher_conflict.start_time.strftime('%H:%M')
                t_end = teacher_conflict.end_time.strftime('%H:%M')
                raise ValidationError({
                    'teacher': f"Этот преподаватель уже занят с {t_start} до {t_end} (группа {teacher_conflict.group}, предмет {teacher_conflict.subject})."
                })

        # 3. Проверка занятости кабинета
        if self.room_id:
            room_conflict = conflicts.filter(room_id=self.room_id).first()
            if room_conflict:
                r_start = room_conflict.start_time.strftime('%H:%M')
                r_end = room_conflict.end_time.strftime('%H:%M')
                raise ValidationError({
                    'room': f"Кабинет уже используется другой группой в это время (с {r_start} до {r_end}, группа {room_conflict.group})."
                })

        # 4. Проверка занятости группы
        if self.group_id:
            group_conflict = conflicts.filter(group_id=self.group_id).first()
            if group_conflict:
                g_start = group_conflict.start_time.strftime('%H:%M')
                g_end = group_conflict.end_time.strftime('%H:%M')
                raise ValidationError({
                    'group': f"Группа {self.group} уже находится на другом занятии с {g_start} до {g_end} (предмет {group_conflict.subject})."
                })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
