from .models import Lesson, Room, SubjectHours, Teacher, TimeSlot


def generate_schedule(schedule):
    Lesson.objects.filter(schedule=schedule).delete()

    conflicts = 0

    subject_hours = SubjectHours.objects.filter(
        grade__school=schedule.school,
        grade__academic_year=schedule.academic_year
    ).select_related('grade', 'subject')

    for item in subject_hours:
        teachers = Teacher.objects.filter(
            subjects=item.subject,
            grades=item.grade
        )

        if not teachers.exists():
            teachers = Teacher.objects.filter(subjects=item.subject)

        time_slots = TimeSlot.objects.filter(
            school=schedule.school,
            shift=item.grade.shift
        )

        rooms = Room.objects.filter(school=schedule.school)

        if item.subject.requires_special_room:
            rooms = rooms.filter(suitable_for=item.subject)

        lessons_created = 0

        for day in range(1, 7):
            for time_slot in time_slots:
                if lessons_created >= item.hours:
                    break

                teacher = None
                for current_teacher in teachers:
                    teacher_busy = Lesson.objects.filter(
                        schedule=schedule,
                        teacher=current_teacher,
                        day_of_week=day,
                        time_slot=time_slot
                    ).exists()

                    teacher_lessons_today = Lesson.objects.filter(
                        schedule=schedule,
                        teacher=current_teacher,
                        day_of_week=day
                    ).count()

                    if not teacher_busy and teacher_lessons_today < current_teacher.max_hours_per_day:
                        teacher = current_teacher
                        break

                room = None
                for current_room in rooms:
                    room_busy = Lesson.objects.filter(
                        schedule=schedule,
                        room=current_room,
                        day_of_week=day,
                        time_slot=time_slot
                    ).exists()

                    if not room_busy:
                        room = current_room
                        break

                grade_busy = Lesson.objects.filter(
                    schedule=schedule,
                    grade=item.grade,
                    day_of_week=day,
                    time_slot=time_slot
                ).exists()

                if teacher and room and not grade_busy:
                    Lesson.objects.create(
                        schedule=schedule,
                        grade=item.grade,
                        subject=item.subject,
                        teacher=teacher,
                        room=room,
                        time_slot=time_slot,
                        day_of_week=day
                    )
                    lessons_created += 1

            if lessons_created >= item.hours:
                break

        if lessons_created < item.hours:
            conflicts += item.hours - lessons_created

    return {
        'status': 'success',
        'conflicts': conflicts,
        'teacher_gaps': 0,
        'overloaded_days': 0,
        'schedule_id': schedule.id,
    }
