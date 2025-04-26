import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type FormData = {
  name?: string;
  email: string;
  password: string;
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const onSubmit = async (data: FormData) => {
    if (isLogin) {
      // Login
      try {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          toast({
            title: "Authentication failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
        } else {
          router.push("/");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } else {
      // Register
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        });

        if (response.ok) {
          toast({
            title: "Registration successful",
            description: "Please sign in with your new account",
          });
          setIsLogin(true);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        }
      } catch (error: any) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  // If user is already authenticated, we're redirecting
  if (status === "authenticated") {
    return null;
  }

  return (
    <>
      <Head>
        <title>{isLogin ? "Login" : "Register"} - FreshHarvest</title>
      </Head>

      <div className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-12rem)] gap-8">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>{isLogin ? "Welcome Back" : "Create an Account"}</CardTitle>
              <CardDescription>
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Fill in the information to create a new account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} id="auth-form">
                <div className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        {...register("name", {
                          required: "Name is required",
                        })}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" form="auth-form" className="w-full">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
              <p className="text-center text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="w-full max-w-md bg-gradient-to-r from-green-400 to-green-600 p-8 rounded-lg shadow-xl text-white hidden md:block">
          <h2 className="text-2xl font-bold mb-4">FreshHarvest Bulk Orders</h2>
          <p className="mb-4">Order fresh fruits and vegetables directly from farms in bulk quantities.</p>
          <ul className="space-y-2 list-disc list-inside mb-6">
            <li>Premium quality farm-fresh produce</li>
            <li>Convenient bulk ordering system</li>
            <li>Track your delivery status</li>
            <li>Support local farmers and agriculture</li>
          </ul>
          <p className="text-sm opacity-80">
            FreshHarvest connects customers directly with farms to ensure the freshest produce at the best prices.
          </p>
        </div>
      </div>
    </>
  );
}
