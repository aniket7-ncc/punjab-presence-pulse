import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, BookOpen, CheckCircle, Clock, Camera, MapPin } from "lucide-react";

interface Student {
  id: string;
  name: string;
  class: string;
  photo: string;
  present: boolean;
}

export const TeacherDashboard = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const { toast } = useToast();

  // Mock data - would come from Supabase
  const classes = ["Class 5A", "Class 5B", "Class 6A"];
  const [students, setStudents] = useState<Student[]>([
    {
      id: "STU001",
      name: "Rajveer Singh",
      class: "Class 5A",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      present: false,
    },
    {
      id: "STU002", 
      name: "Simran Kaur",
      class: "Class 5A",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b5b91e0c?w=150&h=150&fit=crop&crop=face",
      present: false,
    },
    {
      id: "STU003",
      name: "Arjun Sharma",
      class: "Class 5A", 
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      present: false,
    },
    {
      id: "STU004",
      name: "Priya Patel",
      class: "Class 5A",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", 
      present: false,
    },
  ]);

  const handleMarkAttendance = () => {
    if (!selectedClass) {
      toast({
        title: "Select Class",
        description: "Please select a class first",
        variant: "destructive",
      });
      return;
    }
    setIsMarkingAttendance(true);
  };

  const toggleStudentAttendance = (studentId: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  const submitAttendance = () => {
    const presentCount = students.filter(s => s.present).length;
    toast({
      title: "Attendance Marked",
      description: `${presentCount} out of ${students.length} students marked present`,
    });
    setIsMarkingAttendance(false);
  };

  const presentCount = students.filter(s => s.present).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage attendance and student records</p>
        </div>
        <Badge variant="outline" className="w-fit">
          <MapPin className="w-4 h-4 mr-2" />
          GPS: Active
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{presentCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Mark Attendance
          </CardTitle>
          <CardDescription>
            Select class and mark students present or absent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isMarkingAttendance ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleMarkAttendance} className="sm:w-auto">
                <Camera className="w-4 h-4 mr-2" />
                Start Attendance
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedClass} - Mark Attendance</h3>
                <Button onClick={submitAttendance} className="ml-auto">
                  Submit Attendance
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {students.map((student) => (
                  <Card
                    key={student.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      student.present ? 'ring-2 ring-success bg-success/5' : ''
                    }`}
                    onClick={() => toggleStudentAttendance(student.id)}
                  >
                    <CardContent className="flex items-center space-x-4 p-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.photo} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{student.name}</h4>
                        <p className="text-sm text-muted-foreground">{student.id}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {student.present ? (
                          <Badge variant="default" className="bg-success">Present</Badge>
                        ) : (
                          <Badge variant="outline">Absent</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};