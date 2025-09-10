import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, School } from "lucide-react";

interface LoginFormProps {
  onLogin: (role: string, userId: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [role, setRole] = useState<string>("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - in real app, this would call Supabase
    if (userId && otp && role) {
      setTimeout(() => {
        onLogin(role, userId);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${role}!`,
        });
        setIsLoading(false);
      }, 1000);
    } else {
      toast({
        title: "Login Failed",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <School className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold">Smart Attendance</CardTitle>
        <CardDescription>Login to access your dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="principal">Principal</SelectItem>
                <SelectItem value="government">Government Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">User ID / Mobile Number</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="userId"
                type="text"
                placeholder="Enter your ID or mobile number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp">OTP / Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="otp"
                type="password"
                placeholder="Enter OTP or password"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="p-0 h-auto font-semibold">
              Register here
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};