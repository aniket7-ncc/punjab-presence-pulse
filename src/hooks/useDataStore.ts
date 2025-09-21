import { useState, useEffect } from 'react';
import dummyData from '@/data/dummyData.json';

export interface Student {
  id: string;
  uniqueId: string;
  name: string;
  dob: string;
  address: string;
  parentName: string;
  mobile: string;
  aadhaar: string;
  class: string;
  schoolId: string;
  photo: string;
  facePhotos: string[];
  previousMarksheet?: string;
  transferCertificate?: string;
  isApproved: boolean;
  approvedBy?: string;
  registeredBy: string;
  registrationDate: string;
  parentOtpVerified: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  schoolId: string;
  email: string;
  mobile: string;
  username: string;
  password: string;
  isApproved: boolean;
  subjects: string[];
}

export interface Principal {
  id: string;
  name: string;
  employeeId: string;
  schoolId: string;
  email: string;
  mobile: string;
  username: string;
  password: string;
  isApproved: boolean;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  time: string;
  status: 'present' | 'absent';
  markedBy: string;
  gpsLocation: string;
  capturedPhoto: string;
  verificationScore: number;
}

export interface AcademicMaterial {
  id: string;
  studentId: string;
  type: 'marksheet' | 'homework' | 'assignment' | 'result';
  subject?: string;
  title: string;
  file?: string;
  description?: string;
  dueDate?: string;
  uploadedBy: string;
  uploadDate: string;
  marks?: number;
  totalMarks?: number;
}

export interface Entitlement {
  studentId: string;
  type: 'midday_meal' | 'books' | 'uniform' | 'scholarship';
  status: 'active' | 'received' | 'pending' | 'approved';
  startDate?: string;
  quantity?: number;
  receivedDate?: string;
  expectedDate?: string;
  amount?: number;
  disbursedDate?: string;
}

export interface CameraLog {
  id: string;
  studentId: string;
  timestamp: string;
  capturedFace: string;
  registeredFace: string;
  matchScore: number;
  location: string;
  markedBy: string;
}

interface DataStore {
  students: Student[];
  teachers: Teacher[];
  principals: Principal[];
  attendance: Attendance[];
  academicMaterials: AcademicMaterial[];
  entitlements: Entitlement[];
  cameraLogs: CameraLog[];
  approvals: {
    students: any[];
    teachers: any[];
  };
}

export const useDataStore = () => {
  const [data, setData] = useState<DataStore>({
    students: dummyData.students as Student[],
    teachers: dummyData.users.teachers as Teacher[],
    principals: dummyData.users.principals as Principal[],
    attendance: dummyData.attendance as Attendance[],
    academicMaterials: dummyData.academicMaterials as AcademicMaterial[],
    entitlements: dummyData.entitlements as Entitlement[],
    cameraLogs: dummyData.cameraLogs as CameraLog[],
    approvals: dummyData.approvals as { students: any[]; teachers: any[]; }
  });

  // Simulate JSON file updates by updating local state
  const updateData = (updates: Partial<DataStore>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: `STU${String(data.students.length + 1).padStart(3, '0')}`
    };
    updateData({
      students: [...data.students, newStudent]
    });
    return newStudent;
  };

  const approveStudent = (studentId: string, approvedBy: string) => {
    updateData({
      students: data.students.map(s => 
        s.id === studentId ? { ...s, isApproved: true, approvedBy } : s
      ),
      approvals: {
        ...data.approvals,
        students: data.approvals.students.filter(a => a.studentId !== studentId)
      }
    });
  };

  const markAttendance = (attendance: Omit<Attendance, 'id'>) => {
    const newAttendance: Attendance = {
      ...attendance,
      id: `ATT${String(data.attendance.length + 1).padStart(3, '0')}`
    };
    updateData({
      attendance: [...data.attendance, newAttendance]
    });
    
    // Add camera log
    const cameraLog: CameraLog = {
      id: `CAM${String(data.cameraLogs.length + 1).padStart(3, '0')}`,
      studentId: attendance.studentId,
      timestamp: `${attendance.date}T${attendance.time}`,
      capturedFace: attendance.capturedPhoto,
      registeredFace: data.students.find(s => s.id === attendance.studentId)?.photo || '',
      matchScore: attendance.verificationScore,
      location: attendance.gpsLocation,
      markedBy: attendance.markedBy
    };
    updateData({
      cameraLogs: [...data.cameraLogs, cameraLog]
    });
    
    return newAttendance;
  };

  const uploadAcademicMaterial = (material: Omit<AcademicMaterial, 'id'>) => {
    const newMaterial: AcademicMaterial = {
      ...material,
      id: `MAT${String(data.academicMaterials.length + 1).padStart(3, '0')}`
    };
    updateData({
      academicMaterials: [...data.academicMaterials, newMaterial]
    });
    return newMaterial;
  };

  const getStudentsByClass = (className: string) => {
    return data.students.filter(s => s.class === className && s.isApproved);
  };

  const getAttendanceForStudent = (studentId: string, dateRange?: { start: string; end: string }) => {
    let attendance = data.attendance.filter(a => a.studentId === studentId);
    if (dateRange) {
      attendance = attendance.filter(a => 
        a.date >= dateRange.start && a.date <= dateRange.end
      );
    }
    return attendance;
  };

  const getAttendanceStats = () => {
    const totalStudents = data.students.filter(s => s.isApproved).length;
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = data.attendance.filter(a => a.date === today && a.status === 'present');
    const presentToday = todayAttendance.length;
    const attendanceRate = totalStudents > 0 ? (presentToday / totalStudents) * 100 : 0;
    
    return {
      totalStudents,
      presentToday,
      absentToday: totalStudents - presentToday,
      attendanceRate: Math.round(attendanceRate)
    };
  };

  return {
    data,
    updateData,
    addStudent,
    approveStudent,
    markAttendance,
    uploadAcademicMaterial,
    getStudentsByClass,
    getAttendanceForStudent,
    getAttendanceStats
  };
};