from celery import shared_task
from .models import Schedule
from .scheduler import generate_schedule


@shared_task
def generate_schedule_task(schedule_id):
    schedule = Schedule.objects.get(id=schedule_id)
    return generate_schedule(schedule)
