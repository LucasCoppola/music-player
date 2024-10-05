import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { validateEmail, validatePassword } from "@/lib/validation";

export type LoginFormData = {
  email: string;
  password: string;
};

export default function Login({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  function validateForm() {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  }

  const loginMutation = useMutation({
    mutationFn: async (loginFormData: LoginFormData) =>
      await login(loginFormData),
    onSuccess: async () => {
      setIsOpen(false);
      toast.success("Logged in successfully.");
    },
    onError: (error) => {
      console.error("Login failed", error);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (validateForm()) {
      loginMutation.mutate(formData);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
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
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging In..." : "Login"}
      </Button>
      {loginMutation.isError && (
        <p className="text-red-500 mt-2 text-xs">
          {loginMutation.error.message || "Login failed."}
        </p>
      )}
    </form>
  );
}
