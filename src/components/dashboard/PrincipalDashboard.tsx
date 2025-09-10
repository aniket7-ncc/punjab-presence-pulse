import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, BookOpen, CheckCircle, UserCheck, School, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const PrincipalDashboard = () => {
  const { toast } = useToast();

  // Mock data - would come from Supabase
  const [pendingTeachers] = useState([
    {
      id: "TCH001",
      name: "Preet Kaur",
      mobile: "+91 98765 43210",
      status: "pending",
    },
    {
      id: "TCH002", 
      name: "Manpreet Singh",
      mobile: "+91 98765 43211",
      status: "pending",
    },
  ]);

  const [pendingStudents] = useState([
    {
      id: "STU005",
      name: "Harleen Kaur",
      class: "Class 6A",
      guardianMobile: "+91 98765 43212",
      status: "pending",
    },
    {
      id: "STU006",
      name: "Gurpreet Singh", 
      class: "Class 5B",
      guardianMobile: "+91 98765 43213",
      status: "pending",
    },
  ]);

  const schoolStats = {
    totalTeachers: 12,
    totalStudents: 324,
    presentToday: 289,
    attendanceRate: 89.2,
  };

  const classReports = [
    { class: "Class 5A", total: 32, present: 28, teacher: "Simran Kaur" },
    { class: "Class 5B", total: 30, present: 26, teacher: "Rajesh Kumar" },
    { class: "Class 6A", total: 35, present: 32, teacher: "Priyanka Sharma" },
    { class: "Class 6B", total: 33, present: 29, teacher: "Amit Singh" },
  ];

  const approveTeacher = (teacherId: string) => {
    toast({
      title: "Teacher Approved",
      description: `Teacher ${teacherId} has been approved successfully`,
    });
  };

  const approveStudent = (studentId: string) => {
    toast({
      title: "Student Approved", 
      description: `Student ${studentId} has been approved successfully`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Principal Dashboard</h1>
          <p className="text-muted-foreground">Manage school operations and approvals</p>
        </div>
        <Badge variant="outline" className="w-fit">
          <School className="w-4 h-4 mr-2" />
          Punjab Govt. School
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolStats.totalTeachers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolStats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{schoolStats.presentToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <ClipboardList className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{schoolStats.attendanceRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="approvals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="reports">Class Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Teacher Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Teacher Approvals
                </CardTitle>
                <CardDescription>
                  {pendingTeachers.length} teachers waiting for approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{teacher.name}</h4>
                          <p className="text-sm text-muted-foreground">{teacher.id}</p>
                          <p className="text-sm text-muted-foreground">{teacher.mobile}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => approveTeacher(teacher.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Student Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Approvals
                </CardTitle>
                <CardDescription>
                  {pendingStudents.length} students waiting for approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.id} • {student.class}</p>
                          <p className="text-sm text-muted-foreground">Guardian: {student.guardianMobile}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => approveStudent(student.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Class-wise Attendance Report
              </CardTitle>
              <CardDescription>Today's attendance summary by class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{report.class}</h4>
                        <p className="text-sm text-muted-foreground">Teacher: {report.teacher}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{report.present}/{report.total}</p>
                        <p className="text-xs text-muted-foreground">
                          {((report.present / report.total) * 100).toFixed(1)}% present
                        </p>
                      </div>
                      <Badge 
                        variant={report.present / report.total > 0.8 ? "default" : "destructive"}
                        className={report.present / report.total > 0.8 ? "bg-success" : ""}
                      >
                        {report.present / report.total > 0.8 ? "Good" : "Low"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};