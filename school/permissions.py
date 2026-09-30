from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or request.user.role == 'super_admin'
        )


class IsSchoolAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or request.user.role in [
                'super_admin',
                'school_admin',
            ]
        )


class IsDeputy(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or request.user.role in [
                'super_admin',
                'school_admin',
                'deputy',
            ]
        )


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_superuser or request.user.role in [
                'super_admin',
                'school_admin',
                'deputy',
                'teacher',
                'class_teacher',
            ]
        )


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'


class IsParent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'parent'


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or request.user.role in ['super_admin', 'school_admin']:
            return True
        return obj == request.user or getattr(obj, 'user', None) == request.user
