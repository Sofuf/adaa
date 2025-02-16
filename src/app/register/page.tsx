// src/app/register/page.tsx
import Register from "@/components/ui/auth/Register";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Register</h1>
      <Register />
    </div>
  );
}