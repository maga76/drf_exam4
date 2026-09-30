# Smart School Backend

Simple school management backend made with Django REST Framework.

## Main features

- JWT login and logout
- Schools, teachers, students, grades, subjects and rooms
- School schedule and lesson replacements
- Attendance, marks and homework
- Announcements and notifications
- Simple automatic schedule generator
- WebSocket notifications
- Celery background tasks

## Run

```bash
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

PostgreSQL must have a database named `smart_school`.

Redis is needed for Celery and WebSocket:

```bash
redis-server
celery -A core worker --loglevel=info
```

## Tests

```bash
python manage.py test --settings=core.test_settings
```

## Main API

- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`
- `GET /api/teachers/search/?q=Ali`
- `GET /api/teachers/free/`
- `GET /api/rooms/free/`
- `POST /api/schedules/generate/`
- `GET /api/schedules/live/`
- `GET /api/dashboard/`
- `WS /ws/notifications/`
