import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "../../context/auth-context";
import { getProfile } from "@/lib/utils";

type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function SignUp({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  function validateForm() {
    let isValid = true;
    const newErrors = { username: "", email: "", password: "" };

    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
      isValid = false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  const signUpMutation = useMutation({
    mutationFn: async (userData: FormData) => {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw data;
      }
      return response.json();
    },
    onSuccess: async (data) => {
      document.cookie = `accessToken=${data.access_token}; path=/; Secure; SameSite=Strict`;

      const profile = await getProfile(data.access_token);

      console.log(profile);

      login(data.access_token, profile.username, profile.email);
      setIsOpen(false);
      toast.success("Account created successfully.");
    },
    onError: (error) => {
      console.error("Sign up failed", error);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (validateForm()) {
      signUpMutation.mutate(formData);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Jhondoe123"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          {errors.username && (
            <span className="text-red-500 text-xs">{errors.username}</span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email}</span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors.password && (
            <span className="text-red-500 text-xs">{errors.password}</span>
          )}
        </div>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={signUpMutation.isPending}
      >
        {signUpMutation.isPending ? "Signing Up..." : "Sign Up"}
      </Button>
      {signUpMutation.isError && (
        <p className="text-red-500 mt-2 text-xs">
          {signUpMutation.error.message || "Sign up failed."}
        </p>
      )}
    </form>
  );
}
