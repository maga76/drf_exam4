from rest_framework.permissions import BasePermission
class IsSuperAdmin(BasePermission):
    """Только супер администратор"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'super_admin'


class IsSchoolAdmin(BasePermission):
    """Только директор школы"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            'super_admin',
            'school_admin',
        ]


class IsDeputy(BasePermission):
    """Директор или завуч"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            'super_admin',
            'school_admin',
            'deputy',
        ]


class IsTeacher(BasePermission):
    """Учитель, классный руководитель, завуч или директор"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            'super_admin',
            'school_admin',
            'deputy',
            'teacher',
            'class_teacher',
        ]


class IsStudent(BasePermission):
    """Только ученик"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'


class IsParent(BasePermission):
    """Только родитель"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'parent'


class IsOwnerOrAdmin(BasePermission):
    """Владелец объекта или администратор"""
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['super_admin', 'school_admin']:
            return True
        return obj == request.user or getattr(obj, 'user', None) == request.user
