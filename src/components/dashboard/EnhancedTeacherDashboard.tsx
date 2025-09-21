import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Camera, 
  Upload, 
  Users, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  UserPlus,
  FileText,
  GraduationCap,
  CalendarDays
} from "lucide-react";
import { toast } from "sonner";
import { FaceRecognition } from "@/components/common/FaceRecognition";
import { FileUpload } from "@/components/common/FileUpload";
import { useDataStore } from "@/hooks/useDataStore";

export const EnhancedTeacherDashboard = () => {
  const { data, markAttendance, addStudent, uploadAcademicMaterial, getStudentsByClass, getAttendanceStats } = useDataStore();
  
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  
  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    name: "",
    dob: "",
    address: "",
    parentName: "",
    mobile: "",
    aadhaar: "",
    class: "",
    facePhotos: [] as string[],
    previousMarksheet: null as File | null,
    transferCertificate: null as File | null
  });

  const classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"];
  const students = selectedClass ? getStudentsByClass(selectedClass) : [];
  const stats = getAttendanceStats();

  const handleStartAttendance = () => {
    if (!selectedClass) {
      toast.error("Please select a class first");
      return;
    }
    setIsMarkingAttendance(true);
    toast.success(`Started attendance for ${selectedClass}`);
  };

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
    setShowFaceRecognition(true);
  };

  const handleFaceCapture = (photoData: string) => {
    if (!selectedStudent) return;
    
    const attendanceData = {
      studentId: selectedStudent.id,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      status: 'present' as const,
      markedBy: 'TEA001', // Current teacher ID
      gpsLocation: "30.7333, 76.7794", // Mock GPS
      capturedPhoto: photoData,
      verificationScore: 0.95 + Math.random() * 0.05 // Mock score
    };

    markAttendance(attendanceData);
    toast.success(`Attendance marked for ${selectedStudent.name}`);
  };

  const handleRegistrationSubmit = () => {
    if (!registrationData.name || !registrationData.dob || !registrationData.mobile || registrationData.facePhotos.length < 3) {
      toast.error("Please fill all required fields and capture at least 3 face photos");
      return;
    }

    // Simulate OTP verification
    const otpVerified = window.confirm(`Send OTP to ${registrationData.mobile} for parent verification?`);
    if (!otpVerified) return;

    const newStudent = {
      uniqueId: `UP001STU${String(data.students.length + 1).padStart(3, '0')}`,
      name: registrationData.name,
      dob: registrationData.dob,
      address: registrationData.address,
      parentName: registrationData.parentName,
      mobile: registrationData.mobile,
      aadhaar: registrationData.aadhaar,
      class: registrationData.class,
      schoolId: "SCH001",
      photo: registrationData.facePhotos[0],
      facePhotos: registrationData.facePhotos,
      isApproved: false,
      registeredBy: "TEA001",
      registrationDate: new Date().toISOString().split('T')[0],
      parentOtpVerified: true
    };

    addStudent(newStudent);
    toast.success("Student registered successfully! Pending principal approval.");
    setShowRegistration(false);
    setRegistrationData({
      name: "", dob: "", address: "", parentName: "", mobile: "", aadhaar: "", class: "",
      facePhotos: [], previousMarksheet: null, transferCertificate: null
    });
  };

  const handleMaterialUpload = (type: string, files: FileList) => {
    // Simulate file upload
    Array.from(files).forEach(file => {
      const material = {
        studentId: "all", // For class-wide materials
        type: type as any,
        title: file.name,
        subject: selectedClass,
        uploadedBy: "TEA001",
        uploadDate: new Date().toISOString().split('T')[0]
      };
      uploadAcademicMaterial(material);
    });
    toast.success(`${files.length} file(s) uploaded successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.presentToday}</div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.absentToday}</div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <GraduationCap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.attendanceRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Face Recognition Attendance
              </CardTitle>
              <CardDescription>
                Select a class and mark attendance using facial recognition
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="class-select">Select Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleStartAttendance}
                  disabled={!selectedClass}
                  className="bg-success text-success-foreground"
                >
                  Start Attendance
                </Button>
              </div>

              {isMarkingAttendance && students.length > 0 && (
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Students in {selectedClass}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {students.map((student) => (
                      <Card 
                        key={student.id}
                        className="cursor-pointer hover:shadow-md transition-shadow attendance-card"
                        onClick={() => handleStudentClick(student)}
                      >
                        <CardContent className="p-4 text-center">
                          <Avatar className="w-16 h-16 mx-auto mb-2">
                            <AvatarImage src={student.photo} alt={student.name} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium text-sm">{student.name}</p>
                          <Badge variant="outline" className="mt-1">
                            {student.uniqueId}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload Results & Marksheets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple={true}
                  onUpload={(files) => handleMaterialUpload('marksheet', files)}
                  title="Upload Marksheets"
                  description="PDF, DOC, or image files"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Upload Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept=".pdf,.doc,.docx"
                  multiple={true}
                  onUpload={(files) => handleMaterialUpload('assignment', files)}
                  title="Upload Assignments"
                  description="PDF or DOC files"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Register New Student
              </CardTitle>
              <CardDescription>
                Fill student details and capture facial photos for registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Student Name *</Label>
                  <Input
                    id="name"
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={registrationData.dob}
                    onChange={(e) => setRegistrationData({...registrationData, dob: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent">Parent's Name *</Label>
                  <Input
                    id="parent"
                    value={registrationData.parentName}
                    onChange={(e) => setRegistrationData({...registrationData, parentName: e.target.value})}
                    placeholder="Enter parent's name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    value={registrationData.mobile}
                    onChange={(e) => setRegistrationData({...registrationData, mobile: e.target.value})}
                    placeholder="Enter mobile number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    value={registrationData.aadhaar}
                    onChange={(e) => setRegistrationData({...registrationData, aadhaar: e.target.value})}
                    placeholder="Enter Aadhaar number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select 
                    value={registrationData.class} 
                    onValueChange={(value) => setRegistrationData({...registrationData, class: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={registrationData.address}
                  onChange={(e) => setRegistrationData({...registrationData, address: e.target.value})}
                  placeholder="Enter complete address"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Face Photos ({registrationData.facePhotos.length}/3) *</Label>
                <p className="text-sm text-muted-foreground">
                  Capture at least 3 photos from different angles for better recognition
                </p>
                
                {registrationData.facePhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {registrationData.facePhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img src={photo} alt={`Face ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <Badge className="absolute top-2 right-2">Photo {index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button
                  onClick={() => setShowFaceRecognition(true)}
                  disabled={registrationData.facePhotos.length >= 3}
                  variant="outline"
                  className="w-full"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture Face Photo {registrationData.facePhotos.length > 0 && `(${registrationData.facePhotos.length + 1}/3)`}
                </Button>
              </div>

              <Button 
                onClick={handleRegistrationSubmit}
                className="w-full bg-success text-success-foreground"
                disabled={!registrationData.name || registrationData.facePhotos.length < 3}
              >
                Register Student & Send for Approval
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Attendance Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Attendance reports and analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Face Recognition Modal */}
      {showFaceRecognition && (
        <FaceRecognition
          onCapture={(photoData) => {
            if (selectedStudent) {
              handleFaceCapture(photoData);
            } else {
              // For registration
              setRegistrationData({
                ...registrationData,
                facePhotos: [...registrationData.facePhotos, photoData]
              });
              toast.success(`Face photo ${registrationData.facePhotos.length + 1} captured`);
            }
            setShowFaceRecognition(false);
          }}
          onClose={() => setShowFaceRecognition(false)}
          studentName={selectedStudent?.name || "New Student"}
        />
      )}
    </div>
  );
};