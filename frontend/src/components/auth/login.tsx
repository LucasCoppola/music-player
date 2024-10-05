import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export type LoginFormData = {
  email: string;
  password: string;
};

export default function Login({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}
