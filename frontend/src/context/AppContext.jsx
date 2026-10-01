import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { api } from '../services/api';
import {
  initialSchools,
  initialAcademicYears,
  initialShiftsConfig,
  initialSubjects,
  initialClassrooms,
  initialTeachers,
  initialClasses,
  initialStudents,
  initialParents,
  initialSchedule,
  initialLiveLessons,
  initialSubstitutions,
  initialAttendanceRecords,
  initialGradesMatrix,
  initialHomework,
  initialAnnouncements,
  initialNotifications,
  initialUsers,
  permissionsMatrix
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Localization & Theme
  const [language, setLanguage] = useState('ru');
  const [theme, setTheme] = useState('light');

  // Role: super_admin | admin | curriculum_director | teacher | homeroom_teacher | student | parent
  const [role, setRole] = useState('admin');

  // Multi-school & Academic settings
  const [schools, setSchools] = useState(initialSchools);
  const [currentSchool, setCurrentSchool] = useState(initialSchools[0]);
  const [academicYears, setAcademicYears] = useState(initialAcademicYears);
  const [activeAcademicYear, setActiveAcademicYear] = useState('2025–2026');
  const [activeShift, setActiveShift] = useState(1);
  const [shiftsConfig, setShiftsConfig] = useState(initialShiftsConfig);

  // App Navigation & Modals
  const [activeView, setActiveView] = useState(api.hasToken() ? 'dashboard' : 'auth');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Notifications & Toasts
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Data Collections
  const [teachers, setTeachers] = useState(initialTeachers);
  const [students, setStudents] = useState(initialStudents);
  const [parents, setParents] = useState(initialParents);
  const [classes, setClasses] = useState(initialClasses);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [classrooms, setClassrooms] = useState(initialClassrooms);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [liveLessons, setLiveLessons] = useState(initialLiveLessons);
  const [substitutions, setSubstitutions] = useState(initialSubstitutions);
  const [homeworkList, setHomeworkList] = useState(initialHomework);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [attendanceRecords, setAttendanceRecords] = useState(initialAttendanceRecords);
  const [gradesMatrix, setGradesMatrix] = useState(initialGradesMatrix);
  const [users, setUsers] = useState(initialUsers);

  // User Profile
  const [currentUser, setCurrentUser] = useState({
    name: "Ахмедова Фарангис Т.",
    roleTitle: "Администратор школы",
    email: "admin.school12@smartschool.tj",
    phone: "+992 (93) 555-88-22",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
  });

  // Keep dark mode class synced with html tag
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const backendRoleToFrontendRole = (backendRole) => {
    const roles = {
      school_admin: 'admin',
      deputy: 'curriculum_director',
      class_teacher: 'homeroom_teacher'
    };

    return roles[backendRole] || backendRole;
  };

  const mapSchoolFromApi = (school) => ({
    id: school.id,
    name: school.name,
    address: school.address,
    phone: school.phone,
    email: school.email,
    status: school.status,
    type: 'Общеобразовательная школа',
    studentsCount: school.students_count || 0,
    teachersCount: school.teachers_count || 0,
    buildingsCount: school.buildings_count || 0,
    createdAt: school.created_at?.slice(0, 10) || '—'
  });

  const mapUserFromApi = (user) => ({
    id: user.id,
    fullName: [user.last_name, user.first_name, user.middle_name].filter(Boolean).join(' ') || user.username,
    username: user.username,
    email: user.email,
    role: backendRoleToFrontendRole(user.role),
    schoolId: user.school,
    school: user.school_name || 'Все школы',
    phone: user.phone,
    status: user.is_active ? 'active' : 'blocked',
    lastLogin: '—'
  });

  const loadBackendData = async () => {
    setLoadingData(true);

    try {
      const [profile, dashboard, apiNotifications] = await Promise.all([
        api.get('/auth/me/'),
        api.get('/dashboard/'),
        api.get('/notifications/')
      ]);

      const userRole = backendRoleToFrontendRole(profile.role);
      setRole(userRole);
      setCurrentUser(prev => ({
        ...prev,
        name: `${profile.last_name} ${profile.first_name} ${profile.middle_name}`.trim() || profile.username,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.photo || prev.avatar,
        roleTitle: translations.ru.roles[userRole] || userRole
      }));

      if (userRole === 'super_admin') {
        const apiSchools = await api.get('/schools/');
        const mappedSchools = apiSchools.map(mapSchoolFromApi);
        setSchools(mappedSchools);
        if (mappedSchools.length) {
          setCurrentSchool(mappedSchools[0]);
        }
      } else if (profile.school) {
        setCurrentSchool(prev => ({
          ...prev,
          id: profile.school,
          name: profile.school_name || prev.name
        }));
      }

      if (['super_admin', 'admin'].includes(userRole)) {
        const apiUsers = await api.get('/users/');
        setUsers(apiUsers.map(mapUserFromApi));
      }
      setDashboardStats(dashboard);
      setNotifications(apiNotifications.map(item => ({
        id: item.id,
        type: item.notification_type,
        title: item.title,
        message: item.message,
        read: item.is_read,
        timestamp: new Date(item.created_at).toLocaleString('ru-RU')
      })));
      setBackendConnected(true);
    } catch (error) {
      setBackendConnected(false);
      throw error;
    } finally {
      setLoadingData(false);
    }
  };

  const loginUser = async (username, password) => {
    await api.login(username, password);
    await loadBackendData();
    setActiveView('dashboard');
  };

  const logoutUser = async () => {
    await api.logout();
    setBackendConnected(false);
    setDashboardStats(null);
    setActiveView('auth');
  };

  useEffect(() => {
    if (!api.hasToken()) {
      return;
    }

    loadBackendData().catch(() => {
      api.logout();
      setActiveView('auth');
    });
  }, []);

  useEffect(() => {
    if (!api.hasToken()) {
      return undefined;
    }

    const websocketUrl = import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000/ws/notifications/';
    const socket = new WebSocket(websocketUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications(prev => [{
        id: Date.now(),
        type: data.type,
        title: data.title || 'Schedule updated',
        message: data.message || 'School information was updated',
        read: false,
        timestamp: new Date().toLocaleString('ru-RU')
      }, ...prev]);
    };

    return () => socket.close();
  }, [backendConnected]);

  // Update profile name when role changes for demo clarity
  const switchRole = (newRole) => {
    setRole(newRole);
    const roleMapping = {
      super_admin: { name: "Содиков Бахтиёр М.", roleTitle: "Супер-администратор", email: "superadmin@smartschool.tj" },
      admin: { name: "Ахмедова Фарангис Т.", roleTitle: "Администратор школы", email: "admin.school12@smartschool.tj" },
      curriculum_director: { name: "Махмудов Сухроб В.", roleTitle: "Завуч", email: "zavuch.school12@smartschool.tj" },
      teacher: { name: "Каримова Мадина Р.", roleTitle: "Учитель математики", email: "karimova.m@school12.tj" },
      homeroom_teacher: { name: "Саидова Нигора А.", roleTitle: "Классный руководитель (7А)", email: "saidova.n@school12.tj" },
      student: { name: "Шарипов Алишер Ф.", roleTitle: "Ученик 7А класса", email: "sharipov.alisher@school12.tj" },
      parent: { name: "Шарипов Фарход Н.", roleTitle: "Родитель (Алишер 7А, Мадина 4Б)", email: "farhod.sharipov@gmail.com" },
    };
    if (roleMapping[newRole]) {
      setCurrentUser(prev => ({
        ...prev,
        ...roleMapping[newRole]
      }));
    }
    addToast({
      type: 'info',
      title: 'Роль переключена',
      message: `Интерфейс адаптирован под роль: ${translations[language]?.roles[newRole] || newRole}`
    });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = (path) => {
    const keys = path.split('.');
    let curr = translations[language] || translations.ru;
    for (let k of keys) {
      if (curr && curr[k] !== undefined) {
        curr = curr[k];
      } else {
        // Fallback to ru
        let fallback = translations.ru;
        for (let fk of keys) {
          if (fallback && fallback[fk] !== undefined) fallback = fallback[fk];
          else return path;
        }
        return fallback;
      }
    }
    return curr;
  };

  // Toast notifications
  const addToast = ({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, type, title, message };
    setToasts(prev => [...prev, newToast]);
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({ type: 'success', title: 'Успешно', message: 'Все уведомления отмечены прочитанными' });
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      theme,
      setTheme,
      toggleTheme,
      role,
      setRole,
      switchRole,
      currentUser,
      setCurrentUser,
      currentSchool,
      setCurrentSchool,
      schools,
      setSchools,
      academicYears,
      setAcademicYears,
      activeAcademicYear,
      setActiveAcademicYear,
      activeShift,
      setActiveShift,
      shiftsConfig,
      setShiftsConfig,
      activeView,
      setActiveView,
      sidebarCollapsed,
      setSidebarCollapsed,
      mobileMenuOpen,
      setMobileMenuOpen,
      searchModalOpen,
      setSearchModalOpen,
      notifications,
      setNotifications,
      dashboardStats,
      backendConnected,
      loadingData,
      loginUser,
      logoutUser,
      markAllNotificationsRead,
      unreadNotificationsCount,
      toasts,
      addToast,
      removeToast,
      // Data collections
      teachers,
      setTeachers,
      students,
      setStudents,
      parents,
      setParents,
      classes,
      setClasses,
      subjects,
      setSubjects,
      classrooms,
      setClassrooms,
      schedule,
      setSchedule,
      liveLessons,
      setLiveLessons,
      substitutions,
      setSubstitutions,
      homeworkList,
      setHomeworkList,
      announcements,
      setAnnouncements,
      attendanceRecords,
      setAttendanceRecords,
      gradesMatrix,
      setGradesMatrix,
      users,
      setUsers,
      permissionsMatrix,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
