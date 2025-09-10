import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { School, Users, TrendingUp, MapPin, Download, Search, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const GovernmentDashboard = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const { toast } = useToast();

  // Mock data - would come from Supabase
  const stateStats = {
    totalSchools: 1247,
    totalTeachers: 8934,
    totalStudents: 234567,
    todayAttendance: 89.3,
  };

  const districts = [
    "Amritsar", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Ferozepur",
    "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana",
    "Mansa", "Moga", "Mohali", "Muktsar", "Pathankot", "Patiala",
    "Rupnagar", "Sangrur", "Tarn Taran"
  ];

  const schools = selectedDistrict ? [
    `Govt. Senior Secondary School, ${selectedDistrict}`,
    `Govt. Primary School, ${selectedDistrict} Rural`,
    `Govt. Middle School, ${selectedDistrict} Urban`,
  ] : [];

  const schoolReport = selectedSchool ? {
    name: selectedSchool,
    totalStudents: 324,
    presentToday: 289,
    absentToday: 35,
    attendanceRate: 89.2,
    lastUpdated: "10:30 AM",
    gpsLocation: "31.6340, 74.8723",
    markedBy: "Principal Gurpreet Singh"
  } : null;

  const auditTrail = [
    {
      school: "Govt. School, Amritsar",
      markedBy: "Teacher Simran Kaur (TCH001)",
      time: "09:15 AM",
      location: "31.6340, 74.8723",
      students: "28/32 present",
      remarks: "Regular attendance marking"
    },
    {
      school: "Govt. School, Bathinda", 
      markedBy: "Principal Rajesh Kumar (PRN002)",
      time: "09:45 AM",
      location: "30.2118, 74.9455",
      students: "45/48 present",
      remarks: "Manual marking - power outage"
    },
    {
      school: "Govt. School, Ludhiana",
      markedBy: "Teacher Priya Sharma (TCH003)",
      time: "10:00 AM", 
      location: "30.9010, 75.8573",
      students: "38/42 present",
      remarks: "Face recognition system used"
    },
  ];

  const exportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report...`,
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Government Dashboard</h1>
          <p className="text-muted-foreground">Punjab State Education Department</p>
        </div>
        <Badge variant="outline" className="w-fit">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date().toLocaleDateString('en-IN')}
        </Badge>
      </div>

      {/* State Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stateStats.totalSchools.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stateStats.totalTeachers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stateStats.totalStudents.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stateStats.todayAttendance}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">School Reports</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {/* School Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                School-wise Reports
              </CardTitle>
              <CardDescription>Select district and school to view detailed reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">Select District</Label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">Select School</Label>
                  <Select 
                    value={selectedSchool} 
                    onValueChange={setSelectedSchool}
                    disabled={!selectedDistrict}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {schoolReport && (
                <div className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{schoolReport.name}</CardTitle>
                      <CardDescription>Today's Attendance Report</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-info">{schoolReport.totalStudents}</div>
                          <p className="text-sm text-muted-foreground">Total Students</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-success">{schoolReport.presentToday}</div>
                          <p className="text-sm text-muted-foreground">Present Today</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-destructive">{schoolReport.absentToday}</div>
                          <p className="text-sm text-muted-foreground">Absent Today</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span>Attendance Rate:</span>
                          <Badge className="bg-success">{schoolReport.attendanceRate}%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Updated:</span>
                          <span className="text-muted-foreground">{schoolReport.lastUpdated}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Marked By:</span>
                          <span className="text-muted-foreground">{schoolReport.markedBy}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>GPS Location:</span>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{schoolReport.gpsLocation}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => exportReport('csv')}>
                          <Download className="h-4 w-4 mr-2" />
                          Export CSV
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => exportReport('pdf')}>
                          <Download className="h-4 w-4 mr-2" />
                          Export PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Audit Trail
              </CardTitle>
              <CardDescription>Real-time attendance marking activities across the state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTrail.map((entry, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{entry.school}</h4>
                        <p className="text-sm text-muted-foreground">
                          Marked by: {entry.markedBy}
                        </p>
                      </div>
                      <Badge variant="outline">{entry.time}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{entry.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{entry.students}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Remarks: </span>
                        <span>{entry.remarks}</span>
                      </div>
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