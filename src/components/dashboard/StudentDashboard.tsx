import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, XCircle, BookOpen, Bell, User } from "lucide-react";

export const StudentDashboard = () => {
  // Mock data - would come from Supabase
  const studentData = {
    id: "STU001",
    name: "Rajveer Singh",
    class: "Class 5A",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    guardianMobile: "+91 98765 43210",
  };

  const attendanceData = [
    { date: "2024-01-15", status: "present" },
    { date: "2024-01-14", status: "present" },
    { date: "2024-01-13", status: "absent" },
    { date: "2024-01-12", status: "present" },
    { date: "2024-01-11", status: "present" },
    { date: "2024-01-10", status: "present" },
    { date: "2024-01-09", status: "present" },
  ];

  const homework = [
    { subject: "Mathematics", task: "Complete Chapter 5 exercises", dueDate: "2024-01-16" },
    { subject: "English", task: "Write essay on 'My School'", dueDate: "2024-01-17" },
    { subject: "Science", task: "Prepare for test on Plants", dueDate: "2024-01-18" },
  ];

  const notifications = [
    { type: "info", message: "Parent-Teacher meeting on 20th January", date: "2024-01-15" },
    { type: "success", message: "Great performance in Mathematics test!", date: "2024-01-14" },
    { type: "warning", message: "Submit Science project by Friday", date: "2024-01-13" },
  ];

  const presentDays = attendanceData.filter(d => d.status === "present").length;
  const attendancePercentage = (presentDays / attendanceData.length) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={studentData.photo} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{studentData.name}</h1>
            <p className="text-muted-foreground">{studentData.class} • {studentData.id}</p>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          Guardian: {studentData.guardianMobile}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendancePercentage.toFixed(1)}%</div>
            <Progress value={attendancePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{presentDays}</div>
            <p className="text-xs text-muted-foreground">out of {attendanceData.length} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <BookOpen className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{homework.length}</div>
            <p className="text-xs text-muted-foreground">homework assignments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Attendance
            </CardTitle>
            <CardDescription>Your attendance for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceData.map((record, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{new Date(record.date).toLocaleDateString('en-IN')}</span>
                  <div className="flex items-center space-x-2">
                    {record.status === "present" ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-success" />
                        <Badge variant="default" className="bg-success">Present</Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-destructive" />
                        <Badge variant="destructive">Absent</Badge>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Homework */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Homework
            </CardTitle>
            <CardDescription>Pending assignments and tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {homework.map((task, index) => (
                <div key={index} className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold text-sm">{task.subject}</h4>
                  <p className="text-sm text-muted-foreground">{task.task}</p>
                  <p className="text-xs text-warning font-medium mt-1">
                    Due: {new Date(task.dueDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Important updates and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === 'success' ? 'bg-success' : 
                  notification.type === 'warning' ? 'bg-warning' : 'bg-info'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};