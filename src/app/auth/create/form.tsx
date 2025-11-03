"use client";

import SelectOptionUI from "@/components/other/selectOptionUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkValidUsername } from "@/utils/apis";
import debounce from "@/utils/debounce";
import setCookie from "@/utils/setCookie";
import axios, { AxiosError } from "axios";
import { CircleCheck, CircleX, Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

// ==========================================
const currentDate = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years: number[] = [];
const initialYear = 1970;
const currentYear = currentDate.getFullYear();
for (let index = initialYear; index <= currentYear; index++) {
  years[index] = index;
}
const dates: number[] = [];
const initialDate = 1;
const finalDate = 31;
for (let index = initialDate; index <= finalDate; index++) {
  dates[index] = index;
}
// ==========================================

export default function CreateAccountForm() {
  const [username, setUsername] = useState<null | string>(null);
  const [email, setEmail] = useState<null | string>(null);
  const [fullName, setFullName] = useState<null | string>(null);
  const [year, setYear] = useState<null | string>(null);
  const [month, setMonth] = useState<null | string>(null);
  const [date, setDate] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);
  const [isvalidUsername, setIsvalidUsername] = useState<boolean | null | "loading">(null);
  // Error for
  const [errorFullname, setErrorFullname] = useState<null | string | boolean>(null);
  const [errorUsername, setErrorUsername] = useState<null | string | boolean>(null);
  const [errorEmail, setErrorEmail] = useState<null | string | boolean>(null);
  const [errorBirth, setErrorBirth] = useState<null | string | boolean>(null);
  const [errorPassword, setErrorPassword] = useState<null | string | boolean>(null);
  // Other
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validatations
  const formValidation = useCallback(() => {
    let isValid = true;
    // Full Name
    if (!fullName) {
      setErrorFullname(false);
      isValid = false;
    } else {
      if (fullName.length < 4) {
        setErrorFullname("minimum 4 letter");
        isValid = false;
      }
    }
    // Username
    if (!username) {
      setErrorUsername(false);
      isValid = false;
    } else {
      if (username.length < 4) {
        setErrorUsername("minimum 4 letter");
        isValid = false;
      }
    }
    // Email
    if (!email) {
      setErrorEmail(false);
      isValid = false;
    } else {
      if (!email.includes("@") || !email.includes(".")) {
        setErrorEmail("email without (@) or (.) isn't valid");
        isValid = false;
      }
    }
    // Date of Birth
    if (!year || !month || !date) {
      setErrorBirth(false);
      isValid = false;
    }

    // Password
    if (!password) {
      setErrorPassword(false);
      isValid = false;
    } else {
      if (password.length < 7) {
        setErrorPassword("password minimum length must be 6");
        isValid = false;
      }
    }

    return isValid;
  }, [fullName, username, email, year, month, date, password]);

  // Search Valid Username
  // ================================================
  const searchUsernameIsValid = async (username: string) => {
    if (!username) return;
    const resp = await checkValidUsername(username);
    if (resp) return setIsvalidUsername(true);
    setIsvalidUsername(null);
  };

  const searchWithDebounce = useMemo(() => debounce(searchUsernameIsValid, 500), []);

  useEffect(() => {
    if (username) {
      searchWithDebounce(username);
      setIsvalidUsername("loading");
      const validateNames = new Set("qwertyuiopasdfghjklzxcvbnm1234567890_".split(""));
      const result = [...username.toLowerCase()].every((char) => validateNames.has(char));
      if (!result) return setErrorUsername("username without (special) characters and (space)");
    }
  }, [searchWithDebounce, username]);
  // ================================================

  // Reset On State Change
  useMemo(() => fullName && setErrorFullname(null), [fullName]);
  useMemo(() => username && setErrorUsername(null), [username]);
  useMemo(() => email && setErrorEmail(null), [email]);
  useMemo(() => year && month && date && setErrorBirth(null), [year, month, date]);
  useMemo(() => password && setErrorPassword(null), [password]);

  // Form Submission
  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = formValidation();
    if (!result) return;
    if (!isvalidUsername) return setErrorUsername("username already exist");
    setIsLoading(true);

    const birth = new Date(`${year}-${month}-${date}`);

    const data = {
      username: username?.toLowerCase(),
      name: fullName?.toLowerCase(),
      email: email?.toLowerCase(),
      birth,
      password,
    };

    axios
      .post(`/api/auth/create`, data, {withCredentials: true})
      .then((res) => {
        if (typeof res.data !== "object") return null;
        const { username } = res.data;
        setCookie("username", username)
          .then(() => window.location.reload())
          .catch((err) => {
            if (err instanceof Error) return toast.error(err.name);
            toast.error("Cookie error");
          });
      })
      .catch((err) => {
        if (err instanceof AxiosError) return toast.error(err.response?.data?.error || "Invalid Creation");
        toast.error("Unknown error");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className='max-w-md w-full p-5 bg-accent/40 rounded-sm'>
      <ToastContainer
        hideProgressBar={true}
        limit={1}
      />
      <h1 className='text-2xl font-semibold text-center mb-5'>Create Account</h1>
      <form
        autoComplete='off'
        onSubmit={formSubmitHandler}
        className='grid gap-2 text-sm'
      >
        <div>
          <Input
            type='text'
            id='full-name'
            name='name'
            placeholder='Full Name'
            onChange={(e) => setFullName(e.currentTarget.value)}
            className={`${errorFullname == false && "placeholder:text-red-400"}`}
          />
          {errorFullname && <p className='text-red-400'>{errorFullname}</p>}
        </div>
        <div className='relative'>
          <Input
            type='text'
            onChange={(e) => setUsername(e.currentTarget.value)}
            name='username'
            placeholder='Username'
            className={`${errorUsername == false && "placeholder:text-red-400"}`}
          />
          {username &&
            (isvalidUsername == "loading" ? (
              <LoaderCircle className='absolute right-2 top-2 size-5 animate-spin' />
            ) : isvalidUsername == null ? (
              <CircleX className='absolute right-2 top-2 size-5 text-red-500' />
            ) : (
              <CircleCheck className='absolute right-2 top-2 size-5  text-emerald-500' />
            ))}
          {errorUsername && <p className='text-red-400'>{errorUsername}</p>}
        </div>
        <div>
          <Input
            type='text'
            name='email'
            placeholder='Email'
            onChange={(e) => setEmail(e.currentTarget.value)}
            className={`${errorEmail == false && "placeholder:text-red-400"}`}
          />
          {errorEmail && <p className='text-red-400'>{errorEmail}</p>}
        </div>
        <div className='grid grid-cols-3 gap-x-2 items-center'>
          <SelectOptionUI
            name='year'
            placeholder='Year'
            options={years}
            setChangedValue={setYear}
            placeholderWaning={errorBirth}
          />
          <SelectOptionUI
            name='month'
            placeholder='Month'
            options={months}
            setChangedValue={setMonth}
            placeholderWaning={errorBirth}
          />
          <SelectOptionUI
            name='date'
            placeholder='Date'
            options={dates}
            setChangedValue={setDate}
            placeholderWaning={errorBirth}
          />
          {errorBirth && <p className='text-red-400'>{errorBirth}</p>}
        </div>
        <div className='relative'>
          <Input
            type={`${showPassword ? "text" : "password"}`}
            name='password'
            placeholder='Password'
            onChange={(e) => setPassword(e.currentTarget.value)}
            className={`${errorPassword == false && "placeholder:text-red-400"}`}
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
          {errorPassword && <p className='text-red-400'>{errorPassword}</p>}
        </div>
        <Button type='submit'>
          Sign up
          {isLoading && <LoaderCircle className='size-4 animate-spin text-black' />}
        </Button>
      </form>
      <p className='text-center mt-2.5'>
        Already Have an account?&nbsp;
        <Link
          href='/auth/login'
          className='text-blue-500 hover:underline'
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
