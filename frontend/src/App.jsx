import React from 'react';
import { useApp } from './context/AppContext';
import { Layout } from './components/layout/Layout';

// Views
import { AuthView } from './views/AuthView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { ParentDashboardView } from './views/ParentDashboardView';
import { ScheduleView } from './views/ScheduleView';
import { ScheduleWizardView } from './views/ScheduleWizardView';
import { LiveLessonsView } from './views/LiveLessonsView';
import { SubstitutionsView } from './views/SubstitutionsView';
import { TeachersView } from './views/TeachersView';
import { StudentsView } from './views/StudentsView';
import { ParentsView } from './views/ParentsView';
import { ClassesView } from './views/ClassesView';
import { AttendanceView } from './views/AttendanceView';
import { GradesView } from './views/GradesView';
import { HomeworkView } from './views/HomeworkView';
import { ClassroomsView } from './views/ClassroomsView';
import { SubjectsView } from './views/SubjectsView';
import { AcademicYearsView } from './views/AcademicYearsView';
import { AnnouncementsView } from './views/AnnouncementsView';
import { NotificationsView } from './views/NotificationsView';
import { UsersView } from './views/UsersView';
import { SchoolsManagementView } from './views/SchoolsManagementView';
import { SchoolSettingsView } from './views/SchoolSettingsView';
import { UserProfileView } from './views/UserProfileView';
import { ReportsView } from './views/ReportsView';
import { ErrorStatesView } from './views/ErrorStatesView';

export const App = () => {
  const { activeView, role } = useApp();

  const renderDashboardByRole = () => {
    switch (role) {
      case 'teacher':
      case 'homeroom_teacher':
        return <TeacherDashboardView />;
      case 'student':
        return <StudentDashboardView />;
      case 'parent':
        return <ParentDashboardView />;
      case 'super_admin':
      case 'admin':
      case 'curriculum_director':
      default:
        return <AdminDashboardView />;
    }
  };

  const renderCurrentView = () => {
    switch (activeView) {
      case 'auth':
        return <AuthView />;
      case 'dashboard':
        return renderDashboardByRole();
      case 'schedule':
        return <ScheduleView />;
      case 'scheduleWizard':
        return <ScheduleWizardView />;
      case 'liveLessons':
        return <LiveLessonsView />;
      case 'substitutions':
        return <SubstitutionsView />;
      case 'teachers':
        return <TeachersView />;
      case 'students':
        return <StudentsView />;
      case 'parents':
        return <ParentsView />;
      case 'classes':
        return <ClassesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'grades':
        return <GradesView />;
      case 'homework':
        return <HomeworkView />;
      case 'classrooms':
        return <ClassroomsView />;
      case 'subjects':
        return <SubjectsView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'reports':
        return <ReportsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'users':
        return <UsersView />;
      case 'yearsAndShifts':
        return <AcademicYearsView />;
      case 'schoolManagement':
        return <SchoolsManagementView />;
      case 'settings':
        return <SchoolSettingsView />;
      case 'profile':
        return <UserProfileView />;
      case 'errorStates':
        return <ErrorStatesView />;
      default:
        return renderDashboardByRole();
    }
  };

  return (
    <Layout>
      {renderCurrentView()}
    </Layout>
  );
};

export default App;
