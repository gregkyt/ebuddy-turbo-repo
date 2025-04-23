"use client";

import Container from "@/components/Container";
import {
  setSignInPayload,
  setStatus,
  signInAsync,
  signInPayload,
  signInStatus,
  signInUser,
} from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface FormErrors {
  email: string;
  password: string;
}

export default function Login() {
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const loginPayload = useAppSelector(signInPayload);
  const loginStatus = useAppSelector(signInStatus);
  const loginUser = useAppSelector(signInUser);

  useEffect(() => {
    if (loginUser && loginStatus === "idle") {
      router.push(`/home?uid=${loginUser.uid}`);
    }
  }, [loginUser, loginStatus]);

  function onChangeText(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    dispatch(
      setSignInPayload({ ...loginPayload, [e.target.name]: e.target.value })
    );

    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    });
  }

  function validate() {
    const tempErrors: FormErrors = { email: "", password: "" };
    let isValid = true;

    if (!loginPayload.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    }

    if (!isValidEmail(loginPayload.email)) {
      tempErrors.email = "Email invalid";
      isValid = false;
    }

    if (!loginPayload.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    }

    setFormErrors(tempErrors);
    return isValid;
  }

  function isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return regex.test(email);
  }

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    if (validate()) {
      dispatch(signInAsync(loginPayload));
    }
  }

  return (
    <Container>
      <form
        className="flex p-4 w-full h-screen justify-center items-center flex-col"
        onSubmit={(e) => onLogin(e)}
      >
        <Typography sx={{ fontWeight: "600" }} variant="h4" gutterBottom>
          Login
        </Typography>
        <FormControl>
          <TextField
            name="email"
            label="Email"
            placeholder="Enter your email ..."
            error={Boolean(formErrors.email)}
            onChange={(e) => onChangeText(e)}
          />
          <FormHelperText error>{formErrors.email}</FormHelperText>
        </FormControl>
        <FormControl>
          <TextField
            name="password"
            sx={{ marginTop: "16px" }}
            type="password"
            label="Password"
            placeholder="Enter your password ..."
            error={Boolean(formErrors.password)}
            onChange={(e) => onChangeText(e)}
          />
          <FormHelperText error>{formErrors.password}</FormHelperText>
        </FormControl>
        <Button
          sx={{ marginTop: "16px" }}
          loading={loginStatus === "loading"}
          variant="contained"
          color="primary"
          type="submit"
        >
          Submit
        </Button>
      </form>
      <Snackbar
        open={loginStatus === "failed"}
        autoHideDuration={3000}
        onClose={() => dispatch(setStatus("idle"))}
      >
        <Alert severity="error" variant="filled">
          Invalid Credentials
        </Alert>
      </Snackbar>
    </Container>
  );
}
