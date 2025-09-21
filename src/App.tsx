import { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from "./pages/NotFound";

// Lazy load dashboard components to reduce initial bundle size
const TeacherDashboard = lazy(() => import("@/components/dashboard/EnhancedTeacherDashboard").then(m => ({ default: m.EnhancedTeacherDashboard })));
const StudentDashboard = lazy(() => import("@/components/dashboard/StudentDashboard").then(m => ({ default: m.StudentDashboard })));
const PrincipalDashboard = lazy(() => import("@/components/dashboard/PrincipalDashboard").then(m => ({ default: m.PrincipalDashboard })));
const GovernmentDashboard = lazy(() => import("@/components/dashboard/GovernmentDashboard").then(m => ({ default: m.GovernmentDashboard })));

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const handleLogin = (role: string, id: string) => {
    setUserRole(role);
    setUserId(id);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("");
    setUserId("");
  };

  const renderDashboard = () => {
    switch (userRole) {
      case "teacher":
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
            <TeacherDashboard />
          </Suspense>
        );
      case "student":
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
            <StudentDashboard />
          </Suspense>
        );
      case "principal":
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
            <PrincipalDashboard />
          </Suspense>
        );
      case "government":
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
            <GovernmentDashboard />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
            <TeacherDashboard />
          </Suspense>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                !isAuthenticated ? (
                  <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
                    <LoginForm onLogin={handleLogin} />
                  </div>
                ) : (
                  <AppLayout 
                    userRole={userRole} 
                    userId={userId} 
                    onLogout={handleLogout}
                  >
                    {renderDashboard()}
                  </AppLayout>
                )
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
