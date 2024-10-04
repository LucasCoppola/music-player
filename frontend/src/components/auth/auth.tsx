import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Login from "./login";
import SignUp from "./sing-up";

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
          <Tabs defaultValue="login" className="w-full pt-3">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Login />
            </TabsContent>
            <TabsContent value="signup">
              <SignUp />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
