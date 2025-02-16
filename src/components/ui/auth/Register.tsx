'use client'

import { useState } from "react";
import { useAuth } from "@/lib/authContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { FirebaseError } from 'firebase/app';

interface RegistrationData {
  email: string;
  password: string;
  schoolName: string;
  principalName: string;
  principalPhone: string;
}

interface UserData {
  email: string;
  schoolName: string;
  principalName: string;
  principalPhone: string;
  createdAt: string;
}

const Register = () => {
  const router = useRouter();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState<RegistrationData>({
    email: "",
    password: "",
    schoolName: "",
    principalName: "",
    principalPhone: ""
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Pass the entire registration data object to register function
      const userCredential = await register(formData);

      // Create the user data object for Firestore
      const userData: UserData = {
        email: formData.email,
        schoolName: formData.schoolName,
        principalName: formData.principalName,
        principalPhone: formData.principalPhone,
        createdAt: new Date().toISOString(),
      };

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: unknown) {
      let errorMessage = "Failed to register. Please try again.";
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "This email is already registered.";
            break;
          case 'auth/invalid-email':
            errorMessage = "Please enter a valid email address.";
            break;
          case 'auth/weak-password':
            errorMessage = "Password should be at least 6 characters long.";
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input 
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        required
        disabled={isSubmitting}
        className="w-full"
      />
      <Input 
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Password"
        required
        disabled={isSubmitting}
        className="w-full"
      />
      <Input 
        type="text"
        name="schoolName"
        value={formData.schoolName}
        onChange={handleInputChange}
        placeholder="School Name"
        required
        disabled={isSubmitting}
        className="w-full"
      />
      <Input 
        type="text"
        name="principalName"
        value={formData.principalName}
        onChange={handleInputChange}
        placeholder="Principal Name"
        required
        disabled={isSubmitting}
        className="w-full"
      />
      <Input 
        type="tel"
        name="principalPhone"
        value={formData.principalPhone}
        onChange={handleInputChange}
        placeholder="Principal Phone Number"
        required
        disabled={isSubmitting}
        className="w-full"
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </Button>
    </form>
  );
};

export default Register;