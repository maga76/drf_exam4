from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.http import HttpResponse

FRONTEND_DIST = settings.BASE_DIR / 'frontend' / 'dist'


def serve_react(request, path=""):
    index_file = FRONTEND_DIST / 'index.html'
    if index_file.exists():
        with open(index_file, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
    return HttpResponse("Frontend not built. Please run npm run build.", status=404)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('timetable.urls')),
    path('api/', include('school.urls')),
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': FRONTEND_DIST / 'assets'}),
    re_path(r'^(?!api|admin|timetable|assets|media).*$', serve_react, name='react_app'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
