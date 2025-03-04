// import { useState } from "react";
// import { Card, Typography, Button, Input } from "@material-tailwind/react";

// import { NavBar } from "../Components/NavBar";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db, provider } from "../config/firebase";
// import { toast,ToastContainer } from "react-toastify";
// import { setDoc, doc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import { signInWithPopup } from "firebase/auth";
// const SignUpPage = () => {
//     const [email,setEmail]=useState("");
//     const [password,setPassword]=useState("");
//     const [username,setUsername]=useState("");
//     const navigate=useNavigate();

//      const signinwithgoogle= async()=>{
//         const result = await signInWithPopup(auth,provider);
//         console.log(result);
//         navigate('/Feed');
//       }

//     const handleRegister= async()=>{
//         try{
//            await createUserWithEmailAndPassword(auth,email,password);
//            const user=auth.currentUser;
//            console.log(user)
//            if(user){
//             await setDoc(doc(db,"users", user.uid), {
//                 email: user.email,
//                 username: username
//             });
//            }
//            toast.success("User registered!!", {
//             position: "top-center"
//            })
//            navigate('/feed')
//            console.log("success")
           

//         }catch(error){
//             console.log("Error");
//             toast.error(error.message,{
//                 position:"bottom-center"
//             })
//         }
//     }
//     return (
//         <div>
//             <NavBar />
//             <ToastContainer />
//             <div className="flex items-center justify-center min-h-screen bg-gray-100">
//                 <Card className="w-full sm:w-96 p-8 rounded-lg shadow-lg bg-white">
//                     <div className="text-center">
//                         <Typography variant="h4" className="mb-2 font-medium text-slate-800">
//                             Sign Up
//                         </Typography>
//                         <p className="text-sm text-slate-500 mb-6">
//                             Nice to meet you! Enter your details to register.
//                         </p>
//                     </div>
//                     <form className="space-y-4">
//                         <div className="space-y-2">
//                             <label className="text-sm text-slate-600">Your Name</label>
//                             <Input type="text" className="w-full bg-transparent" onChange={(e)=>setUsername(e.target.value)} placeholder="Your Name" />
//                         </div>
//                         <div className="space-y-2">
//                             <label className="text-sm text-slate-600">Email</label>
//                             <Input type="email" className="w-full bg-transparent" onChange={(e)=>setEmail(e.target.value)} placeholder="Your Email" />
//                         </div>
//                         <div className="space-y-2">
//                             <label className="text-sm text-slate-600">Password</label>
//                             <Input type="password" className="w-full bg-transparent" onChange={(e)=>setPassword(e.target.value)} placeholder="Your Password" />
//                         </div>
//                         {/* <div className="flex items-center mt-2">
//                             <input
//                                 type="checkbox"
//                                 id="check-2"
//                                 className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
//                             />
//                             <label className="ml-2 text-sm text-slate-600" htmlFor="check-2">
//                                 Remember Me
//                             </label>
//                         </div> */}
//                         <Button
//                             variant="filled"
//                             className="mt-4 w-full bg-black hover:bg-slate-700 focus:bg-slate-700"
//                             type="button"
//                             color="black"
//                             onClick={handleRegister}
//                         >
//                             Sign Up
//                         </Button>
//                         <Button
//                             variant="outlined"
//                             size="lg"
//                             className="mt-6 flex h-12 items-center justify-center gap-2"
//                             fullWidth
//                             onClick={signinwithgoogle}
//                         >
//                             <img
//                                 src={`https://www.material-tailwind.com/logos/logo-google.png`}
//                                 alt="google"
//                                 className="h-6 w-6"
//                             />{" "}
//                             sign in with google
//                         </Button>
//                         <p className="mt-4 text-sm text-slate-600 text-center">
//                             Already have an account?{" "}
//                             <a href="#login" className="text-slate-700 font-semibold underline">
//                                 Log In
//                             </a>
//                         </p>
//                     </form>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default SignUpPage;

import { useState } from "react";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { NavBar } from "../Components/NavBar";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../config/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const signinWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: user.username

      });

      toast.success("Signed in successfully with Google!", {
        position: "top-center",
      });
      navigate("/feed");
    } catch (error) {
      toast.error(`Google Sign-In Failed: ${error.message}`, {
        position: "bottom-center",
      });
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: username,
      });

      toast.success("User registered successfully!", {
        position: "top-center",
      });
      navigate("/feed");
    } catch (error) {
      toast.error(`Registration Failed: ${error.message}`, {
        position: "top-center",
      });
    }
  };

  return (
    <section className="grid text-center h-screen items-center">
      <NavBar />
      <ToastContainer />
      <div >
        <Typography variant="h3" color="blue-gray" className="">
          <div className="text-black">Sign Up</div>
        </Typography>
        <Typography className="mb-10 text-gray-600 font-normal text-[18px]">
          Enter your details to create an account.
        </Typography>
        <form action="#" className="mx-auto max-w-[24rem] text-left">
          <div className="mb-6">
            <label htmlFor="username">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Your Name
              </Typography>
            </label>
            <Input
              id="username"
              color="gray"
              size="lg"
              type="text"
              name="username"
              placeholder="Your Name"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Email
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
                <i onClick={togglePasswordVisibility}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
          </div>
          <Button color="gray" size="lg" className="mt-6" fullWidth onClick={handleRegister}>
            Sign Up
          </Button>
          <Button
            variant="outlined"
            size="lg"
            className="mt-6 flex h-12 items-center justify-center gap-2"
            fullWidth
            onClick={signinWithGoogle}
          >
            <img
              src={`https://www.material-tailwind.com/logos/logo-google.png`}
              alt="google"
              className="h-6 w-6"
            />{" "}
            Sign up with Google
          </Button>
          <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal"
            onClick={()=>navigate("/sign-in")}
          >
            Already registered?{" "}
            <a href="#login" className="font-medium text-gray-900">
              Log In
            </a>
          </Typography>
        </form>
      </div>
    </section>
  );
};

export default SignUpPage;

