// components/auth/Register.tsx
'use client'
import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

const Register = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [principalPhone, setPrincipalPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await register(email, password, schoolName, principalName, principalPhone);
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        schoolName,
        principalName,
        principalPhone,
        createdAt: new Date().toISOString(),
      });

      router.push('/dashboard');
    } catch (err) {
      setError("Failed to register");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <Input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="School Name" required />
      <Input type="text" value={principalName} onChange={(e) => setPrincipalName(e.target.value)} placeholder="Principal Name" required />
      <Input type="text" value={principalPhone} onChange={(e) => setPrincipalPhone(e.target.value)} placeholder="Principal Phone Number" required />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">Register</Button>
    </form>
  );
};

export default Register;
