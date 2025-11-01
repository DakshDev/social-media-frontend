"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import _env from "@/config/env";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useCallback, useMemo, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import setCookie from "@/utils/setCookie";

export default function LoginAccountForm() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  // Error State
  const [emailError, setEmailError] = useState<string | null | true>(null);
  const [passwordError, setPasswordError] = useState<string | null | true>(null);
  // Other
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validataion
  const validation = useCallback(() => {
    let result = true;
    // Email
    if (!email) {
      setEmailError(true);
      result = false;
    } else if (!email.includes("@") || !email.includes(".")) {
      setEmailError("email without (@) or (.) isn't valid");
      result = false;
    }
    // Password
    if (!password) {
      setPasswordError(true);
      result = false;
    }
    return result;
  }, [email, password]);

  // Reset on Change
  useMemo(() => email && setEmailError(null), [email]);
  useMemo(() => password && setPasswordError(null), [password]);

  // Form Submission
  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validation();
    console.log(result)
    if (!result) return;
    setIsLoading(true);

    const data = {
      email,
      password,
    };
    
    axios
      .post(`${_env.backend_api_origin}/api/auth/login`, data, {
        withCredentials: true,
      })
      .then((res) => {
        if (typeof res.data !== "object") return null;
        const { username } = res.data;
        setCookie("username", username)
          .then(() => window.location.reload())
          .catch((err) => {
            if (err instanceof Error) {
              return toast.error(err.name);
            }
            toast.error("Cookie error");
          });
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          return toast.error(err.response?.data.error || err.name);
        }
        toast.error("Unknown Error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className='max-w-md w-full p-5 bg-accent/40 rounded-sm'>
      <ToastContainer
        limit={1}
        hideProgressBar={true}
      />
      <h1 className='text-2xl font-semibold text-center mb-5'>Login Account</h1>
      <form
        autoComplete='off'
        onSubmit={formSubmitHandler}
        className='grid gap-2 text-sm'
      >
        <div>
          <Input
            onChange={(e) => setEmail(e.currentTarget.value)}
            type='text'
            name='email'
            placeholder='Email'
            className={`${emailError == true && "placeholder:text-red-400"}`}
          />
          {typeof emailError == "string" && <p className='text-red-400 lowercase'>{emailError}</p>}
        </div>
        <div className='relative'>
          <Input
            type={`${showPassword ? "text" : "password"}`}
            name='password'
            placeholder='Password'
            onChange={(e) => setPassword(e.currentTarget.value)}
            className={`${passwordError == true && "placeholder:text-red-400"}`}
          />
          {showPassword ? (
            <Eye
              onClick={() => setShowPassword(false)}
              className='absolute right-2 top-1.75 size-5 cursor-pointer'
            />
          ) : (
            <EyeOff
              onClick={() => setShowPassword(true)}
              className='absolute right-2 top-1.75 size-5 cursor-pointer'
            />
          )}
          {typeof passwordError == "string" && <p className='text-red-400 lowercase'>{passwordError}</p>}
        </div>

        <Button type='submit'>Sign in {isLoading && <LoaderCircle className='size-4 animate-spin text-black' />}</Button>
      </form>
      <p className='text-center mt-2.5'>
        Don&apos;t Have an account?&nbsp;
        <Link
          href='/auth/create'
          className='text-blue-500 hover:underline'
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
