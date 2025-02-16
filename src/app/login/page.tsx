// src/app/login/page.tsx
import Login from "@/components/ui/auth/Login";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Login</h1>
      <Login />
    </div>
  );
}