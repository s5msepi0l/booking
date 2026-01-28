"use client";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [wrongPassword, setWrongPassword] = useState(false);
  const [errText, setErrText] = useState("");

  const router = useRouter();

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const password = form.get("password") as string;
    const confirmPassword = form.get("confirm-password") as string;

    if (password !== confirmPassword) {
      setWrongPassword(true);
      setErrText("Passwords dont match");
      return
    }
    
    const email = form.get("email") as string;
    const name = form.get("name") as string;
      
    const data = await authClient.signUp.email({
      name: name,
      email: email,
      password: password
    });
    console.log("login: ", data);

    if (data.error) {
      setWrongPassword(true);
      setErrText(data.error.message!);
    } else {
      router.push("/dashboard");
    }

  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={signUp}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Username</FieldLabel>
              <Input id="name" name="name" type="text" placeholder="CharlieKirk67" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />

            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input  id="password" name="password" type="password" required />

            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" name="confirm-password" type="password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                {wrongPassword && <FieldDescription className="text-red-600 font-bold text-md">{errText}</FieldDescription>}
                <Button className={wrongPassword ? "bg-red-400 ": ""} type="submit">Create Account</Button>
                <Button variant="outline" type="button">
                  Sign up with Github
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a onClick={() => router.push("/login")} href="#">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
