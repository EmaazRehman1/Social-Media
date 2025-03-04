import { Button, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";// import NavBar from "../Components/NavBar";
import { Footer } from "../Components/Footer";
import { NavBar } from "../Components/NavBar";
// import Surveillance from '../Assets/Illustrations/Surveillance.jpeg'
import img from '../Assets/Illustrations/mainimg.jpg'
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
    const [user] = useAuthState(auth);
    const navigate=useNavigate()
    return (
        <div>
            <NavBar />
            <div>
                <div className="min-h-screen flex flex-col">
                    <div className="flex-grow flex flex-col lg:flex-row justify-center items-center">
                        <div className="flex-1 flex flex-col gap-8 lg:gap-10 px-8 lg:px-12 py-16 lg:py-36 text-justify lg:text-left transition-all duration-400">
                            <div className="flex flex-col gap-10 lg:gap-12">
                                <Typography
                                    variant="h1"
                                    className="text-center lg:text-left text-3xl lg:text-4xl 2xl:text-6xl text-[#323229] transition-all duration-400"
                                >
                                    {/* Connect, <span className="text-lime-900">Share</span>, Inspire and {" "}
                                    <span className="text-[#8f5a0a]">Grow</span> */}
                                    Connect, <span className="text-blue-400">Share</span>, Inspire and {" "}
                                    <span className="text-blue-400">Grow</span>
                                </Typography>
                                <Typography>
                                    Connect, Share, Discover – The world is at your fingertips. Our platform brings you closer to your friends, family, and new experiences like never before. Explore, express, and engage with a community that’s always in tune with you. Ready to join the conversation?
                                </Typography>
                            </div>
                            <div className="flex items-center justify-center gap-12 lg:gap-20 lg:justify-start px-16 lg:px-0 transition-all duration-400">
                                <div className="flex gap-2 items-center">
                                    <FontAwesomeIcon icon={faCheckDouble} color="green" />
                                    <Typography>Reliable</Typography>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <FontAwesomeIcon icon={faCheckDouble} color="green" />
                                    <Typography>Accurate</Typography>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <FontAwesomeIcon icon={faCheckDouble} color="green" />
                                    <Typography>Secure</Typography>
                                </div>
                            </div>
                            {user ? (
                                <></>

                            ) : (
                                <div className="flex justify-center lg:justify-start">
                                    <Button variant="gradient" color="blue" onClick={()=>navigate("/sign-up")}>
                                        Start now <FontAwesomeIcon icon={faAngleDoubleRight} className="pl-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <img src={img} alt="" className="w-full max-w-3xl p-8 md:p-4 lg:p-0 transition-all duration-400" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default HomePage;
