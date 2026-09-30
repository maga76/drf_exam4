export const initialSchools = [
  {
    id: "sch-1",
    name: "СОШ №12 им. А. Рудаки",
    address: "г. Душанбе, ул. Рудаки, 142",
    phone: "+992 (37) 224-55-12",
    email: "info@school12.tj",
    status: "active",
    type: "Средняя общеобразовательная школа",
    studentsCount: 1240,
    teachersCount: 78,
    buildingsCount: 2,
    createdAt: "2018-09-01"
  },
  {
    id: "sch-2",
    name: "Гимназия №1 «Эрудит»",
    address: "г. Душанбе, пр. И. Сомони, 58",
    phone: "+992 (37) 231-10-80",
    email: "admin@erudit-gym.tj",
    status: "active",
    type: "Гимназия с углублённым изучением языков",
    studentsCount: 860,
    teachersCount: 62,
    buildingsCount: 1,
    createdAt: "2020-01-15"
  },
  {
    id: "sch-3",
    name: "Лицей для одарённых детей №4",
    address: "г. Худжанд, ул. Ленина, 89",
    phone: "+992 (34) 226-78-90",
    email: "contact@licey4.tj",
    status: "trial",
    type: "Физико-математический лицей",
    studentsCount: 540,
    teachersCount: 45,
    buildingsCount: 1,
    createdAt: "2024-08-20"
  }
];

export const initialAcademicYears = [
  {
    id: "ay-2025-2026",
    name: "2025–2026",
    startDate: "2025-09-01",
    endDate: "2026-05-25",
    isActive: true,
    terms: ["1 четверть (01.09 - 02.11)", "2 четверть (10.11 - 30.12)", "3 четверть (11.01 - 20.03)", "4 четверть (01.04 - 25.05)"]
  },
  {
    id: "ay-2024-2025",
    name: "2024–2025",
    startDate: "2024-09-01",
    endDate: "2025-05-25",
    isActive: false,
    terms: ["1 четверть", "2 четверть", "3 четверть", "4 четверть"]
  }
];

export const initialShiftsConfig = [
  {
    shiftId: 1,
    name: "1-я смена (Утренняя)",
    timeRange: "08:00 – 13:05",
    slots: [
      { number: 1, start: "08:00", end: "08:45" },
      { number: 2, start: "08:50", end: "09:35" },
      { number: 3, start: "09:45", end: "10:30" }, // Большая перемена 15 мин
      { number: 4, start: "10:45", end: "11:30" },
      { number: 5, start: "11:35", end: "12:20" },
      { number: 6, start: "12:25", end: "13:05" },
    ]
  },
  {
    shiftId: 2,
    name: "2-я смена (Дневная)",
    timeRange: "13:30 – 18:35",
    slots: [
      { number: 1, start: "13:30", end: "14:15" },
      { number: 2, start: "14:20", end: "15:05" },
      { number: 3, start: "15:15", end: "16:00" },
      { number: 4, start: "16:15", end: "17:00" },
      { number: 5, start: "17:05", end: "17:50" },
      { number: 6, start: "17:55", end: "18:35" },
    ]
  }
];

export const initialSubjects = [
  { id: "sub-1", name: "Математика / Алгебра", shortName: "Алгебра", code: "МАТ", roomType: "regular", color: "indigo", weeklyHours: 5 },
  { id: "sub-2", name: "Геометрия", shortName: "Геометрия", code: "ГЕО", roomType: "regular", color: "blue", weeklyHours: 2 },
  { id: "sub-3", name: "Русский язык", shortName: "Рус. яз", code: "РУС", roomType: "regular", color: "emerald", weeklyHours: 4 },
  { id: "sub-4", name: "Литература", shortName: "Литер.", code: "ЛИТ", roomType: "regular", color: "teal", weeklyHours: 3 },
  { id: "sub-5", name: "Физика", shortName: "Физика", code: "ФИЗ", roomType: "physics", color: "amber", weeklyHours: 3 },
  { id: "sub-6", name: "Химия", shortName: "Химия", code: "ХИМ", roomType: "chemistry", color: "rose", weeklyHours: 2 },
  { id: "sub-7", name: "Биология", shortName: "Биолог.", code: "БИО", roomType: "regular", color: "green", weeklyHours: 2 },
  { id: "sub-8", name: "История", shortName: "История", code: "ИСТ", roomType: "regular", color: "orange", weeklyHours: 2 },
  { id: "sub-9", name: "Информатика", shortName: "Информ.", code: "ИНФ", roomType: "computer", color: "cyan", weeklyHours: 2 },
  { id: "sub-10", name: "Английский язык", shortName: "Англ. яз", code: "АНГ", roomType: "regular", color: "violet", weeklyHours: 3 },
  { id: "sub-11", name: "Таджикский язык", shortName: "Тадж. яз", code: "ТАД", roomType: "regular", color: "purple", weeklyHours: 3 },
  { id: "sub-12", name: "Физическая культура", shortName: "Физ-ра", code: "ФК", roomType: "gym", color: "lime", weeklyHours: 2 },
];

export const initialClassrooms = [
  { id: "room-101", number: "101", building: "Главный корпус", floor: 1, type: "regular", capacity: 32, status: "in_use", currentClass: "7А", currentSubject: "Русский язык" },
  { id: "room-102", number: "102", building: "Главный корпус", floor: 1, type: "regular", capacity: 30, status: "free", currentClass: null, currentSubject: null },
  { id: "room-201", number: "201", building: "Главный корпус", floor: 2, type: "computer", capacity: 26, status: "in_use", currentClass: "9Б", currentSubject: "Информатика" },
  { id: "room-204", number: "204", building: "Главный корпус", floor: 2, type: "physics", capacity: 30, status: "in_use", currentClass: "10А", currentSubject: "Физика" },
  { id: "room-208", number: "208", building: "Главный корпус", floor: 2, type: "chemistry", capacity: 28, status: "free", currentClass: null, currentSubject: null },
  { id: "room-302", number: "302", building: "Главный корпус", floor: 3, type: "regular", capacity: 34, status: "in_use", currentClass: "11А", currentSubject: "Алгебра" },
  { id: "room-305", number: "305", building: "Главный корпус", floor: 3, type: "regular", capacity: 30, status: "free", currentClass: null, currentSubject: null },
  { id: "gym-1", number: "Спортзал №1", building: "Спортивный корпус", floor: 1, type: "gym", capacity: 60, status: "in_use", currentClass: "8В", currentSubject: "Физкультура" },
  { id: "act-1", number: "Актовый зал", building: "Главный корпус", floor: 1, type: "art", capacity: 250, status: "free", currentClass: null, currentSubject: null },
];

export const initialTeachers = [
  {
    id: "tch-1",
    fullName: "Каримова Мадина Рустамовна",
    subjectId: "sub-1",
    subjectName: "Математика / Алгебра",
    email: "karimova.m@school12.tj",
    phone: "+992 (93) 512-34-56",
    roomNumber: "302",
    classes: ["7А", "9Б", "11А"],
    workloadHours: 24,
    maxHours: 28,
    status: "in_lesson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120",
    experienceYears: 14,
    qualification: "Высшая категория, отличник образования",
    substitutionsCount: 5
  },
  {
    id: "tch-2",
    fullName: "Иванов Алексей Сергеевич",
    subjectId: "sub-5",
    subjectName: "Физика",
    email: "ivanov.a@school12.tj",
    phone: "+992 (90) 777-88-99",
    roomNumber: "204",
    classes: ["8А", "9Б", "10А", "11А"],
    workloadHours: 22,
    maxHours: 26,
    status: "in_lesson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    experienceYears: 9,
    qualification: "Первая категория",
    substitutionsCount: 3
  },
  {
    id: "tch-3",
    fullName: "Саидова Нигора Акмаловна",
    subjectId: "sub-3",
    subjectName: "Русский язык и литература",
    email: "saidova.n@school12.tj",
    phone: "+992 (91) 888-44-33",
    roomNumber: "101",
    classes: ["7А", "7Б", "8Б"],
    workloadHours: 26,
    maxHours: 28,
    status: "in_lesson",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
    experienceYears: 18,
    qualification: "Высшая категория",
    substitutionsCount: 7
  },
  {
    id: "tch-4",
    fullName: "Рахимов Фарход Зарифович",
    subjectId: "sub-9",
    subjectName: "Информатика",
    email: "rakhimov.f@school12.tj",
    phone: "+992 (98) 555-12-34",
    roomNumber: "201",
    classes: ["7А", "8А", "9Б", "10А", "11А"],
    workloadHours: 20,
    maxHours: 24,
    status: "in_lesson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    experienceYears: 6,
    qualification: "Вторая категория",
    substitutionsCount: 2
  },
  {
    id: "tch-5",
    fullName: "Холматов Бахром Салимович",
    subjectId: "sub-6",
    subjectName: "Химия",
    email: "kholmatov.b@school12.tj",
    phone: "+992 (92) 711-22-33",
    roomNumber: "208",
    classes: ["8А", "8Б", "9А", "10А"],
    workloadHours: 18,
    maxHours: 24,
    status: "free",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
    experienceYears: 12,
    qualification: "Первая категория",
    substitutionsCount: 4
  },
  {
    id: "tch-6",
    fullName: "Юсупова Зебо Давлатовна",
    subjectId: "sub-10",
    subjectName: "Английский язык",
    email: "yusupova.z@school12.tj",
    phone: "+992 (93) 444-66-77",
    roomNumber: "102",
    classes: ["7А", "7Б", "9Б"],
    workloadHours: 22,
    maxHours: 26,
    status: "absent",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120",
    experienceYears: 7,
    qualification: "Первая категория",
    substitutionsCount: 1
  },
  {
    id: "tch-7",
    fullName: "Назаров Джамшед Шухратович",
    subjectId: "sub-12",
    subjectName: "Физическая культура",
    email: "nazarov.d@school12.tj",
    phone: "+992 (90) 321-65-43",
    roomNumber: "Спортзал №1",
    classes: ["7А", "8В", "9Б", "11А"],
    workloadHours: 25,
    maxHours: 30,
    status: "in_lesson",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
    experienceYears: 11,
    qualification: "Первая категория",
    substitutionsCount: 8
  }
];

export const initialClasses = [
  {
    id: "cls-7a",
    grade: 7,
    letter: "А",
    name: "7А",
    shift: 1,
    homeroomTeacher: "Саидова Нигора Акмаловна",
    homeroomTeacherId: "tch-3",
    roomNumber: "101",
    studentsCount: 28,
    gpa: 4.42,
    attendanceRate: 96.2
  },
  {
    id: "cls-7b",
    grade: 7,
    letter: "Б",
    name: "7Б",
    shift: 1,
    homeroomTeacher: "Юсупова Зебо Давлатовна",
    homeroomTeacherId: "tch-6",
    roomNumber: "102",
    studentsCount: 26,
    gpa: 4.18,
    attendanceRate: 93.8
  },
  {
    id: "cls-9b",
    grade: 9,
    letter: "Б",
    name: "9Б",
    shift: 1,
    homeroomTeacher: "Каримова Мадина Рустамовна",
    homeroomTeacherId: "tch-1",
    roomNumber: "302",
    studentsCount: 25,
    gpa: 4.51,
    attendanceRate: 97.4
  },
  {
    id: "cls-10a",
    grade: 10,
    letter: "А",
    name: "10А",
    shift: 1,
    homeroomTeacher: "Иванов Алексей Сергеевич",
    homeroomTeacherId: "tch-2",
    roomNumber: "204",
    studentsCount: 24,
    gpa: 4.65,
    attendanceRate: 98.1
  },
  {
    id: "cls-11a",
    grade: 11,
    letter: "А",
    name: "11А",
    shift: 2,
    homeroomTeacher: "Холматов Бахром Салимович",
    homeroomTeacherId: "tch-5",
    roomNumber: "208",
    studentsCount: 22,
    gpa: 4.70,
    attendanceRate: 98.8
  }
];

export const initialStudents = [
  {
    id: "std-101",
    studentCode: "СТ-2025-0142",
    fullName: "Шарипов Алишер Фарходович",
    classId: "cls-7a",
    className: "7А",
    birthDate: "2012-04-15",
    gender: "male",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120",
    parents: [
      { name: "Шарипов Фарход Назирович", relation: "Отец", phone: "+992 (93) 111-22-33" },
      { name: "Шарипова Лола Бахромовна", relation: "Мать", phone: "+992 (93) 111-22-44" }
    ],
    gpa: 4.6,
    attendanceRate: 97.5,
    address: "г. Душанбе, ул. Айни, д. 45, кв. 12"
  },
  {
    id: "std-102",
    studentCode: "СТ-2025-0143",
    fullName: "Бобоева Амина Джамшедовна",
    classId: "cls-7a",
    className: "7А",
    birthDate: "2012-07-22",
    gender: "female",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120",
    parents: [
      { name: "Бобоев Джамшед Сафарович", relation: "Отец", phone: "+992 (90) 222-33-44" }
    ],
    gpa: 4.8,
    attendanceRate: 99.0,
    address: "г. Душанбе, ул. Борбад, д. 18"
  },
  {
    id: "std-103",
    studentCode: "СТ-2025-0144",
    fullName: "Мирзоев Далер Собирович",
    classId: "cls-7a",
    className: "7А",
    birthDate: "2012-02-10",
    gender: "male",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120",
    parents: [
      { name: "Мирзоева Малика Акбаровна", relation: "Мать", phone: "+992 (91) 333-44-55" }
    ],
    gpa: 3.9,
    attendanceRate: 91.2,
    address: "г. Душанбе, ул. Шероз, д. 7"
  },
  {
    id: "std-104",
    studentCode: "СТ-2025-0145",
    fullName: "Каримова Зарина Алишеровна",
    classId: "cls-7a",
    className: "7А",
    birthDate: "2012-09-05",
    gender: "female",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    parents: [
      { name: "Каримов Алишер", relation: "Отец", phone: "+992 (98) 444-55-66" }
    ],
    gpa: 4.5,
    attendanceRate: 96.0,
    address: "г. Душанбе, ул. Негмата Карабаева, 30"
  },
  {
    id: "std-105",
    studentCode: "СТ-2025-0146",
    fullName: "Раджабов Рустам Исмоилович",
    classId: "cls-7a",
    className: "7А",
    birthDate: "2012-11-18",
    gender: "male",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120",
    parents: [
      { name: "Раджабов Исмоил", relation: "Отец", phone: "+992 (93) 777-11-22" }
    ],
    gpa: 4.2,
    attendanceRate: 94.5,
    address: "г. Душанбе, пр. Сино, 8"
  },
  {
    id: "std-201",
    studentCode: "СТ-2023-0089",
    fullName: "Хакимов Азиз Носирович",
    classId: "cls-9b",
    className: "9Б",
    birthDate: "2010-03-12",
    gender: "male",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    parents: [
      { name: "Хакимова Нилуфар", relation: "Мать", phone: "+992 (90) 888-99-00" }
    ],
    gpa: 4.75,
    attendanceRate: 98.2,
    address: "г. Душанбе, ул. Пушкина, 14"
  }
];

export const initialParents = [
  {
    id: "par-1",
    fullName: "Шарипов Фарход Назирович",
    phone: "+992 (93) 111-22-33",
    email: "farhod.sharipov@gmail.com",
    children: [
      { studentId: "std-101", name: "Шарипов Алишер", className: "7А" },
      { studentId: "std-106", name: "Шарипова Мадина", className: "4Б" }
    ],
    occupation: "Инженер-строитель",
    address: "г. Душанбе, ул. Айни, д. 45, кв. 12"
  },
  {
    id: "par-2",
    fullName: "Бобоев Джамшед Сафарович",
    phone: "+992 (90) 222-33-44",
    email: "djamshed.boboev@inbox.ru",
    children: [
      { studentId: "std-102", name: "Бобоева Амина", className: "7А" }
    ],
    occupation: "Финансист",
    address: "г. Душанбе, ул. Борбад, д. 18"
  },
  {
    id: "par-3",
    fullName: "Мирзоева Малика Акбаровна",
    phone: "+992 (91) 333-44-55",
    email: "malika.m@bk.ru",
    children: [
      { studentId: "std-103", name: "Мирзоев Далер", className: "7А" }
    ],
    occupation: "Врач-педиатр",
    address: "г. Душанбе, ул. Шероз, д. 7"
  }
];

export const initialSchedule = [
  // Monday (Day 1)
  { id: "sch-101", day: 1, dayName: "Понедельник", slotNumber: 1, time: "08:00 - 08:45", classId: "cls-7a", className: "7А", subjectName: "Алгебра", teacherName: "Каримова М. Р.", teacherId: "tch-1", roomNumber: "302", color: "indigo" },
  { id: "sch-102", day: 1, dayName: "Понедельник", slotNumber: 2, time: "08:50 - 09:35", classId: "cls-7a", className: "7А", subjectName: "Русский язык", teacherName: "Саидова Н. А.", teacherId: "tch-3", roomNumber: "101", color: "emerald" },
  { id: "sch-103", day: 1, dayName: "Понедельник", slotNumber: 3, time: "09:45 - 10:30", classId: "cls-7a", className: "7А", subjectName: "Английский язык", teacherName: "Юсупова З. Д.", teacherId: "tch-6", roomNumber: "102", color: "violet" },
  { id: "sch-104", day: 1, dayName: "Понедельник", slotNumber: 4, time: "10:45 - 11:30", classId: "cls-7a", className: "7А", subjectName: "Физика", teacherName: "Иванов А. С.", teacherId: "tch-2", roomNumber: "204", color: "amber" },
  { id: "sch-105", day: 1, dayName: "Понедельник", slotNumber: 5, time: "11:35 - 12:20", classId: "cls-7a", className: "7А", subjectName: "Информатика", teacherName: "Рахимов Ф. З.", teacherId: "tch-4", roomNumber: "201", color: "cyan" },
  { id: "sch-106", day: 1, dayName: "Понедельник", slotNumber: 6, time: "12:25 - 13:05", classId: "cls-7a", className: "7А", subjectName: "Физкультура", teacherName: "Назаров Д. Ш.", teacherId: "tch-7", roomNumber: "Спортзал №1", color: "lime" },

  // Tuesday (Day 2)
  { id: "sch-201", day: 2, dayName: "Вторник", slotNumber: 1, time: "08:00 - 08:45", classId: "cls-7a", className: "7А", subjectName: "Геометрия", teacherName: "Каримова М. Р.", teacherId: "tch-1", roomNumber: "302", color: "blue" },
  { id: "sch-202", day: 2, dayName: "Вторник", slotNumber: 2, time: "08:50 - 09:35", classId: "cls-7a", className: "7А", subjectName: "Литература", teacherName: "Саидова Н. А.", teacherId: "tch-3", roomNumber: "101", color: "teal" },
  { id: "sch-203", day: 2, dayName: "Вторник", slotNumber: 3, time: "09:45 - 10:30", classId: "cls-7a", className: "7А", subjectName: "Таджикский язык", teacherName: "Саидова Н. А.", teacherId: "tch-3", roomNumber: "101", color: "purple" },
  { id: "sch-204", day: 2, dayName: "Вторник", slotNumber: 4, time: "10:45 - 11:30", classId: "cls-7a", className: "7А", subjectName: "История", teacherName: "Шарипов С. Т.", teacherId: "tch-8", roomNumber: "105", color: "orange" },
  { id: "sch-205", day: 2, dayName: "Вторник", slotNumber: 5, time: "11:35 - 12:20", classId: "cls-7a", className: "7А", subjectName: "Биология", teacherName: "Холматов Б. С.", teacherId: "tch-5", roomNumber: "208", color: "green" },

  // Wednesday (Day 3)
  { id: "sch-301", day: 3, dayName: "Среда", slotNumber: 1, time: "08:00 - 08:45", classId: "cls-7a", className: "7А", subjectName: "Алгебра", teacherName: "Каримова М. Р.", teacherId: "tch-1", roomNumber: "302", color: "indigo" },
  { id: "sch-302", day: 3, dayName: "Среда", slotNumber: 2, time: "08:50 - 09:35", classId: "cls-7a", className: "7А", subjectName: "Физика", teacherName: "Иванов А. С.", teacherId: "tch-2", roomNumber: "204", color: "amber" },
  { id: "sch-303", day: 3, dayName: "Среда", slotNumber: 3, time: "09:45 - 10:30", classId: "cls-7a", className: "7А", subjectName: "Русский язык", teacherName: "Саидова Н. А.", teacherId: "tch-3", roomNumber: "101", color: "emerald" },
  { id: "sch-304", day: 3, dayName: "Среда", slotNumber: 4, time: "10:45 - 11:30", classId: "cls-7a", className: "7А", subjectName: "Английский язык", teacherName: "Юсупова З. Д.", teacherId: "tch-6", roomNumber: "102", color: "violet" },
  { id: "sch-305", day: 3, dayName: "Среда", slotNumber: 5, time: "11:35 - 12:20", classId: "cls-7a", className: "7А", subjectName: "Физкультура", teacherName: "Назаров Д. Ш.", teacherId: "tch-7", roomNumber: "Спортзал №1", color: "lime" },

  // Thursday (Day 4)
  { id: "sch-401", day: 4, dayName: "Четверг", slotNumber: 1, time: "08:00 - 08:45", classId: "cls-7a", className: "7А", subjectName: "Информатика", teacherName: "Рахимов Ф. З.", teacherId: "tch-4", roomNumber: "201", color: "cyan" },
  { id: "sch-402", day: 4, dayName: "Четверг", slotNumber: 2, time: "08:50 - 09:35", classId: "cls-7a", className: "7А", subjectName: "Алгебра", teacherName: "Каримова М. Р.", teacherId: "tch-1", roomNumber: "302", color: "indigo" },
  { id: "sch-403", day: 4, dayName: "Четверг", slotNumber: 3, time: "09:45 - 10:30", classId: "cls-7a", className: "7А", subjectName: "История", teacherName: "Шарипов С. Т.", teacherId: "tch-8", roomNumber: "105", color: "orange" },
  { id: "sch-404", day: 4, dayName: "Четверг", slotNumber: 4, time: "10:45 - 11:30", classId: "cls-7a", className: "7А", subjectName: "Литература", teacherName: "Саидова Н. А.", teacherId: "tch-3", roomNumber: "101", color: "teal" },

  // Friday (Day 5)
  { id: "sch-501", day: 5, dayName: "Пятница", slotNumber: 1, time: "08:00 - 08:45", classId: "cls-7a", className: "7А", subjectName: "Русский язык", teacherName: "Саидова Н. А.", teacherId: "tch-3", roomNumber: "101", color: "emerald" },
  { id: "sch-502", day: 5, dayName: "Пятница", slotNumber: 2, time: "08:50 - 09:35", classId: "cls-7a", className: "7А", subjectName: "Геометрия", teacherName: "Каримова М. Р.", teacherId: "tch-1", roomNumber: "302", color: "blue" },
  { id: "sch-503", day: 5, dayName: "Пятница", slotNumber: 3, time: "09:45 - 10:30", classId: "cls-7a", className: "7А", subjectName: "Биология", teacherName: "Холматов Б. С.", teacherId: "tch-5", roomNumber: "208", color: "green" },
  { id: "sch-504", day: 5, dayName: "Пятница", slotNumber: 4, time: "10:45 - 11:30", classId: "cls-7a", className: "7А", subjectName: "Таджикский язык", teacherName: "Саидова Н. А.", teacherId: "tch-3", roomNumber: "101", color: "purple" },

  // Saturday (Day 6)
  { id: "sch-601", day: 6, dayName: "Суббота", slotNumber: 1, time: "08:00 - 08:45", classId: "cls-7a", className: "7А", subjectName: "Классный час", teacherName: "Саидова Н. А.", teacherId: "tch-3", roomNumber: "101", color: "purple" },
  { id: "sch-602", day: 6, dayName: "Суббота", slotNumber: 2, time: "08:50 - 09:35", classId: "cls-7a", className: "7А", subjectName: "Английский язык", teacherName: "Юсупова З. Д.", teacherId: "tch-6", roomNumber: "102", color: "violet" },
  { id: "sch-603", day: 6, dayName: "Суббота", slotNumber: 3, time: "09:45 - 10:30", classId: "cls-7a", className: "7А", subjectName: "Основы права", teacherName: "Шарипов С. Т.", teacherId: "tch-8", roomNumber: "105", color: "orange" },
];

export const initialLiveLessons = [
  {
    id: "live-1",
    lessonNumber: 2,
    time: "08:50 – 09:35",
    timeRemaining: "18 мин",
    className: "7А",
    subject: "Русский язык",
    teacher: "Саидова Нигора Акмаловна",
    room: "101 (Главный, 1 этаж)",
    status: "ongoing", // ongoing | endingSoon | replacement | cancelled
    attendanceChecked: true,
    totalStudents: 28,
    presentCount: 27
  },
  {
    id: "live-2",
    lessonNumber: 2,
    time: "08:50 – 09:35",
    timeRemaining: "18 мин",
    className: "9Б",
    subject: "Информатика",
    teacher: "Рахимов Фарход Зарифович",
    room: "201 (Компьютерный, 2 этаж)",
    status: "ongoing",
    attendanceChecked: true,
    totalStudents: 25,
    presentCount: 25
  },
  {
    id: "live-3",
    lessonNumber: 2,
    time: "08:50 – 09:35",
    timeRemaining: "8 мин",
    className: "10А",
    subject: "Физика (Лабораторная)",
    teacher: "Иванов Алексей Сергеевич",
    room: "204 (Физика, 2 этаж)",
    status: "endingSoon",
    attendanceChecked: true,
    totalStudents: 24,
    presentCount: 23
  },
  {
    id: "live-4",
    lessonNumber: 2,
    time: "08:50 – 09:35",
    timeRemaining: "18 мин",
    className: "7Б",
    subject: "Английский язык",
    teacher: "Замена: Каримова М. Р. (вместо Юсуповой З. Д.)",
    room: "102 (Главный, 1 этаж)",
    status: "replacement",
    attendanceChecked: false,
    totalStudents: 26,
    presentCount: 24
  },
  {
    id: "live-5",
    lessonNumber: 2,
    time: "08:50 – 09:35",
    timeRemaining: "—",
    className: "8В",
    subject: "Биология",
    teacher: "Урок отменён (Учитель на конференции)",
    room: "208",
    status: "cancelled",
    attendanceChecked: false,
    totalStudents: 27,
    presentCount: 0
  }
];

export const initialSubstitutions = [
  {
    id: "subst-1",
    date: "2026-10-01",
    lessonNumber: 2,
    className: "7Б",
    subject: "Английский язык",
    originalTeacher: "Юсупова Зебо Давлатовна",
    replacementTeacher: "Каримова Мадина Рустамовна",
    room: "102",
    reason: "Больничный лист (ОРВИ)",
    status: "confirmed", // pending | confirmed | cancelled
    createdBy: "Завуч Ахмедова Ф. Т.",
    createdAt: "2026-09-30 14:20"
  },
  {
    id: "subst-2",
    date: "2026-10-01",
    lessonNumber: 4,
    className: "9Б",
    subject: "Английский язык",
    originalTeacher: "Юсупова Зебо Давлатовна",
    replacementTeacher: "Холматов Бахром Салимович",
    room: "102",
    reason: "Больничный лист (ОРВИ)",
    status: "pending",
    createdBy: "Завуч Ахмедова Ф. Т.",
    createdAt: "2026-09-30 16:10"
  },
  {
    id: "subst-3",
    date: "2026-09-29",
    lessonNumber: 5,
    className: "8А",
    subject: "Химия",
    originalTeacher: "Холматов Бахром Салимович",
    replacementTeacher: "Иванов Алексей Сергеевич",
    room: "208",
    reason: "Курсы повышения квалификации",
    status: "confirmed",
    createdBy: "Директор школы",
    createdAt: "2026-09-28 11:00"
  },
  {
    id: "subst-4",
    date: "2026-09-28",
    lessonNumber: 3,
    className: "11А",
    subject: "Физкультура",
    originalTeacher: "Назаров Джамшед Шухратович",
    replacementTeacher: "Рахимов Ф. З.",
    room: "Спортзал №1",
    reason: "Участие в городском судействе",
    status: "cancelled",
    createdBy: "Завуч Ахмедова Ф. Т.",
    createdAt: "2026-09-27 15:30"
  }
];

export const initialAttendanceRecords = {
  "cls-7a_2026-09-30_2": [
    { studentId: "std-101", status: "present", comment: "" },
    { studentId: "std-102", status: "present", comment: "" },
    { studentId: "std-103", status: "late", comment: "Опоздал на 10 минут (транспорт)" },
    { studentId: "std-104", status: "present", comment: "" },
    { studentId: "std-105", status: "excused", comment: "Справка от врача" },
  ]
};

export const initialGradesMatrix = {
  classId: "cls-7a",
  subjectId: "sub-1",
  subjectName: "Алгебра",
  columns: [
    { id: "c1", date: "15.09", topic: "Линейные уравнения", type: "regular", max: 5 },
    { id: "c2", date: "18.09", topic: "Самостоятельная работа", type: "quiz", max: 5 },
    { id: "c3", date: "22.09", topic: "Свойства степеней", type: "regular", max: 5 },
    { id: "c4", date: "25.09", topic: "Контрольная работа №1", type: "control", max: 5 },
    { id: "c5", date: "29.09", topic: "Многочлены", type: "homework", max: 5 },
  ],
  grades: {
    "std-101": { c1: 5, c2: 5, c3: 4, c4: 5, c5: 5 },
    "std-102": { c1: 5, c2: 5, c3: 5, c4: 5, c5: 5 },
    "std-103": { c1: 3, c2: 4, c3: 3, c4: 4, c5: 4 },
    "std-104": { c1: 4, c2: 4, c3: 5, c4: 4, c5: 5 },
    "std-105": { c1: 4, c2: 3, c3: 4, c4: 4, c5: 4 },
  }
};

export const initialHomework = [
  {
    id: "hw-1",
    classId: "cls-7a",
    className: "7А",
    subjectId: "sub-1",
    subjectName: "Алгебра",
    teacherName: "Каримова М. Р.",
    title: "Параграф 14, № 245 (а, б, в), № 248",
    description: "Повторить формулы сокращённого умножения. Решить уравнения в тетради с подробной записью промежуточных шагов.",
    dueDate: "2026-10-02",
    dueTime: "08:00",
    status: "dueSoon", // new | dueSoon | overdue
    hasAttachment: true,
    fileName: "metodichka_algebra_chast2.pdf",
    fileSize: "1.4 MB",
    submissionsCount: 19,
    totalCount: 28
  },
  {
    id: "hw-2",
    classId: "cls-7a",
    className: "7А",
    subjectId: "sub-3",
    subjectName: "Русский язык",
    teacherName: "Саидова Н. А.",
    title: "Упражнение 112, словарный диктант",
    description: "Вставить пропущенные буквы, графически выделить причастные обороты, расставить знаки препинания.",
    dueDate: "2026-10-01",
    dueTime: "08:00",
    status: "dueSoon",
    hasAttachment: false,
    submissionsCount: 24,
    totalCount: 28
  },
  {
    id: "hw-3",
    classId: "cls-7a",
    className: "7А",
    subjectId: "sub-5",
    subjectName: "Физика",
    teacherName: "Иванов А. С.",
    title: "Лабораторная работа №3: Определение плотности тела",
    description: "Оформить выводы в тетради для лабораторных работ. Ответить на контрольные вопросы 1–4 на стр. 68.",
    dueDate: "2026-10-05",
    dueTime: "10:00",
    status: "new",
    hasAttachment: true,
    fileName: "laboratornaya_rabota_3_shema.pdf",
    fileSize: "850 KB",
    submissionsCount: 5,
    totalCount: 28
  },
  {
    id: "hw-4",
    classId: "cls-9b",
    className: "9Б",
    subjectId: "sub-9",
    subjectName: "Информатика",
    teacherName: "Рахимов Ф. З.",
    title: "Реализация алгоритма поиска в массиве на Python",
    description: "Написать программу бинарного поиска. Код прикрепить файлом .py или ссылкой на GitHub.",
    dueDate: "2026-09-28",
    dueTime: "18:00",
    status: "overdue",
    hasAttachment: false,
    submissionsCount: 22,
    totalCount: 25
  }
];

export const initialAnnouncements = [
  {
    id: "ann-1",
    title: "Регламент проведения 1-й четвертной аттестации и график контрольных срезов",
    author: "Администрация школы (Учебная часть)",
    authorRole: "Завуч Ахмедова Ф. Т.",
    date: "2026-09-29",
    targetAudience: "all", // all | teachers | students | parents | class
    pinned: true,
    content: "Уважаемые коллеги, учащиеся и родители! С 15 октября 2026 г. начинается период проведения итоговых контрольных работ за первую четверть. Просьба учителям-предметникам сверить календарно-тематическое планирование и выставить текущие оценки в электронный журнал до 20 октября."
  },
  {
    id: "ann-2",
    title: "Общешкольное родительское собрание 7-х и 9-х классов",
    author: "Дирекция СОШ №12",
    authorRole: "Директор Содиков Б. М.",
    date: "2026-09-28",
    targetAudience: "parents",
    pinned: true,
    content: "В пятницу, 3 октября в 17:30 в актовом зале состоится встреча с родителями учащихся 7-х и 9-х классов. Повестка дня: результаты адаптационного периода, подготовка к олимпиадам и введение новых кружков робототехники."
  },
  {
    id: "ann-3",
    title: "Инструктаж по технике безопасности в кабинетах физики и химии",
    author: "Методическое объединение естественных наук",
    authorRole: "Руководитель МО Холматов Б. С.",
    date: "2026-09-25",
    targetAudience: "teachers",
    pinned: false,
    content: "Напоминаем всем преподавателям о необходимости проведения вводного и повторного инструктажа с обязательной росписью учащихся в журнале ТБ перед выполнением практических лабораторных работ."
  },
  {
    id: "ann-4",
    title: "Победа нашей школьной команды в городской олимпиаде по математике!",
    author: "Пресс-центр «Smart School»",
    authorRole: "Педагог-организатор",
    date: "2026-09-24",
    targetAudience: "all",
    pinned: false,
    content: "Поздравляем учащихся 9Б и 11А классов с занятием 1-го командного места в городском туре Республиканской олимпиады по точным дисциплинам! Выражаем благодарность учителю математики Каримовой М. Р."
  }
];

export const initialNotifications = [
  {
    id: "notif-1",
    type: "substitution", // schedule | substitution | grade | homework | announcement | system
    title: "Назначена замена урока",
    message: "Урок Английского языка во 2-м уроке (7Б) проведёт Каримова М. Р. вместо Юсуповой З. Д.",
    timestamp: "10 минут назад",
    read: false,
    link: "substitutions"
  },
  {
    id: "notif-2",
    type: "grade",
    title: "Новая оценка по Алгебре",
    message: "Шарипов Алишер (7А) получил оценку «5» за контрольную работу №1",
    timestamp: "1 час назад",
    read: false,
    link: "grades"
  },
  {
    id: "notif-3",
    type: "homework",
    title: "Новое домашнее задание по Физике",
    message: "Учитель Иванов А. С. прикрепил материалы лабораторной работы №3",
    timestamp: "3 часа назад",
    read: false,
    link: "homework"
  },
  {
    id: "notif-4",
    type: "announcement",
    title: "Важное объявление учебной части",
    message: "Опубликован график контрольных срезов на 1-ю четверть",
    timestamp: "Вчера",
    read: true,
    link: "announcements"
  },
  {
    id: "notif-5",
    type: "schedule",
    title: "Изменение в расписании",
    message: "Кабинет для урока Информатики перенесён в корпус 1, каб. 201",
    timestamp: "2 дня назад",
    read: true,
    link: "schedule"
  }
];

export const initialUsers = [
  {
    id: "usr-1",
    fullName: "Содиков Бахтиёр Муродович",
    username: "superadmin@smartschool.tj",
    role: "super_admin",
    school: "Все школы (Сеть)",
    phone: "+992 (93) 999-00-11",
    status: "active",
    lastLogin: "Сегодня в 08:14"
  },
  {
    id: "usr-2",
    fullName: "Ахмедова Фарангис Тохировна",
    username: "admin.school12@smartschool.tj",
    role: "admin",
    school: "СОШ №12 им. А. Рудаки",
    phone: "+992 (93) 555-88-22",
    status: "active",
    lastLogin: "Сегодня в 08:30"
  },
  {
    id: "usr-3",
    fullName: "Махмудов Сухроб Валиевич",
    username: "zavuch.school12@smartschool.tj",
    role: "curriculum_director",
    school: "СОШ №12 им. А. Рудаки",
    phone: "+992 (91) 444-11-99",
    status: "active",
    lastLogin: "Сегодня в 08:45"
  },
  {
    id: "usr-4",
    fullName: "Каримова Мадина Рустамовна",
    username: "karimova.m@school12.tj",
    role: "teacher",
    school: "СОШ №12 им. А. Рудаки",
    phone: "+992 (93) 512-34-56",
    status: "active",
    lastLogin: "Сегодня в 07:55"
  },
  {
    id: "usr-5",
    fullName: "Саидова Нигора Акмаловна",
    username: "saidova.n@school12.tj",
    role: "homeroom_teacher",
    school: "СОШ №12 им. А. Рудаки",
    phone: "+992 (91) 888-44-33",
    status: "active",
    lastLogin: "Сегодня в 08:02"
  },
  {
    id: "usr-6",
    fullName: "Шарипов Алишер Фарходович",
    username: "sharipov.alisher",
    role: "student",
    school: "СОШ №12 им. А. Рудаки",
    phone: "+992 (93) 111-22-33",
    status: "active",
    lastLogin: "Вчера в 18:20"
  },
  {
    id: "usr-7",
    fullName: "Шарипов Фарход Назирович",
    username: "sharipov.parent",
    role: "parent",
    school: "СОШ №12 им. А. Рудаки",
    phone: "+992 (93) 111-22-33",
    status: "active",
    lastLogin: "Сегодня в 07:40"
  }
];

export const permissionsMatrix = [
  { module: "Управление расписанием", super_admin: true, admin: true, curriculum_director: true, teacher: false, homeroom_teacher: false, student: false, parent: false },
  { module: "Оформление замен", super_admin: true, admin: true, curriculum_director: true, teacher: false, homeroom_teacher: false, student: false, parent: false },
  { module: "Выставление оценок", super_admin: true, admin: true, curriculum_director: true, teacher: true, homeroom_teacher: true, student: false, parent: false },
  { module: "Отметка посещаемости", super_admin: true, admin: true, curriculum_director: true, teacher: true, homeroom_teacher: true, student: false, parent: false },
  { module: "Создание домашних заданий", super_admin: true, admin: true, curriculum_director: true, teacher: true, homeroom_teacher: true, student: false, parent: false },
  { module: "Управление учениками и учителями", super_admin: true, admin: true, curriculum_director: false, teacher: false, homeroom_teacher: false, student: false, parent: false },
  { module: "Управление школами (мульти-тенант)", super_admin: true, admin: false, curriculum_director: false, teacher: false, homeroom_teacher: false, student: false, parent: false },
  { module: "Просмотр аналитики и отчётов", super_admin: true, admin: true, curriculum_director: true, teacher: true, homeroom_teacher: true, student: false, parent: false },
  { module: "Публикация общешкольных объявлений", super_admin: true, admin: true, curriculum_director: true, teacher: false, homeroom_teacher: false, student: false, parent: false },
];
