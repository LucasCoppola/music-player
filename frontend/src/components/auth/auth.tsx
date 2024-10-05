import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Login from "./login";
import SignUp from "./sign-up";

export default function Auth() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dark">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-[#1A1A1A] border-[#333]"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login / Sign Up
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[400px] dark text-foreground">
          <DialogDescription className="sr-only">
            Sign up or login to your account.
          </DialogDescription>
          <Tabs defaultValue="login" className="w-full pt-3">
            <DialogTitle>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </DialogTitle>
            <TabsContent value="login">
              <Login setIsOpen={setIsOpen} />
            </TabsContent>
            <TabsContent value="signup">
              <SignUp setIsOpen={setIsOpen} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
