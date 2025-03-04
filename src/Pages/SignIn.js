import { useState } from "react";

import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import SignUpPage from "./SignUp";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from '../config/firebase'

import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Feed } from "./Feed";
import { NavBar } from "../Components/NavBar";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

export function SignInPage() {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const validateUserData = (data) => {
    if (!data.email || !data.username) {
      throw new Error("Invalid user data: Missing required fields.");
    }
    return data;
  };

  const signinwithgoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = validateUserData({
        email: user.email,
        username: user.displayName || user.email.split('@')[0],
      });

      // Save user details to Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, userData);
      }

      navigate('/Feed');
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error(`Login Failed: ${error.message}`, {
        position: "bottom-center",
      });
    }
  };


  const handlelogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Loged in successfully!!", {
        position: "top-center"
      })
      navigate('/Feed');

    } catch (error) {
      toast.error(`Login Failed ${error.message}!!`, {
        position: "bottom-center"
      })
    }
  }

  return (
    <section className="grid text-center h-screen items-center">
      <NavBar />
      <ToastContainer />
      <div >
        <Typography variant="h3" color="blue-gray" className="mb-2">
          <div className="text-black">
            Sign In
          </div>
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Enter your email and password to sign in
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="email">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Your Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              type="email"
              name="email"
              placeholder="name@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Password
              </Typography>
            </label>
            <Input
              size="lg"
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}

              labelProps={{
                className: "hidden",
              }}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              type={passwordShown ? "text" : "password"}
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
          </div>
          <Button color="gray" size="lg" className="mt-6" fullWidth onClick={handlelogin}>
            sign in
          </Button>
          <div className="!mt-4 flex justify-end">
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              variant="small"
              className="font-medium"
            >
              Forgot password
            </Typography>
          </div>
          <Button
            variant="outlined"
            size="lg"
            className="mt-6 flex h-12 items-center justify-center gap-2"
            fullWidth
            onClick={signinwithgoogle}
          >
            <img
              src={`https://www.material-tailwind.com/logos/logo-google.png`}
              alt="google"
              className="h-6 w-6"
            />{" "}
            sign in with google
          </Button>
          <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal"
            onClick={()=>navigate('/sign-up')}
          >
            Not registered?{" "}
            <a href="#" className="font-medium text-gray-900">
              Create account
            </a>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignInPage;


