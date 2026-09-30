from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Announcement, Homework, Lesson, LessonReplacement, Mark, Notification, User


def send_to_group(group_name, data):
    try:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'send_notification',
                'data': data,
            }
        )
    except Exception:
        pass


def create_notification(user, notification_type, title, message):
    Notification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message
    )


@receiver(post_save, sender=Notification)
def notification_created(sender, instance, created, **kwargs):
    if created:
        send_to_group(
            'user_' + str(instance.user_id),
            {
                'id': instance.id,
                'type': instance.notification_type,
                'title': instance.title,
                'message': instance.message,
            }
        )


@receiver(post_save, sender=Lesson)
def lesson_changed(sender, instance, created, **kwargs):
    send_to_group(
        'school_updates',
        {
            'type': 'lesson_changed',
            'lesson_id': instance.id,
            'created': created,
        }
    )


@receiver(post_save, sender=LessonReplacement)
def replacement_created(sender, instance, created, **kwargs):
    if not created or not instance.replacement_teacher:
        return

    create_notification(
        instance.replacement_teacher.user,
        'teacher_replaced',
        'New replacement',
        'You have a replacement lesson on ' + str(instance.date)
    )


@receiver(post_save, sender=Mark)
def mark_created(sender, instance, created, **kwargs):
    if not created:
        return

    message = str(instance.subject) + ': ' + str(instance.value)

    create_notification(
        instance.student.user,
        'new_mark',
        'New mark',
        message
    )

    for parent in instance.student.parents.all():
        create_notification(
            parent.user,
            'new_mark',
            'New mark',
            message
        )


@receiver(post_save, sender=Homework)
def homework_created(sender, instance, created, **kwargs):
    if not created:
        return

    for student in instance.grade.students.all():
        create_notification(
            student.user,
            'new_homework',
            'New homework',
            instance.title
        )

        for parent in student.parents.all():
            create_notification(
                parent.user,
                'new_homework',
                'New homework',
                instance.title
            )


@receiver(post_save, sender=Announcement)
def announcement_created(sender, instance, created, **kwargs):
    if not created:
        return

    users = User.objects.filter(school=instance.school)

    if instance.target == 'teachers':
        users = users.filter(role__in=['teacher', 'class_teacher'])
    elif instance.target == 'students':
        users = users.filter(role='student')
    elif instance.target == 'parents':
        users = users.filter(role='parent')
    elif instance.target == 'grade' and instance.target_grade:
        users = users.filter(
            Q(student_profile__grade=instance.target_grade) |
            Q(parent_profile__children__grade=instance.target_grade)
        ).distinct()

    for user in users:
        create_notification(
            user,
            'announcement',
            instance.title,
            instance.text
        )
