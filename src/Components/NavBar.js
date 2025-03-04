import React, { useState, useEffect } from "react";
import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import postus from '../Assets/Logo/postus.png';
import { auth, db } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';

export const NavBar = () => {
    const [openNav, setOpenNav] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    const fetchUserDetails = async (user) => {
        if (!user) return;
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserDetails(docSnap.data());
            } else {
                console.error("No user data found in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await fetchUserDetails(user);
            } else {
                setUserDetails(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUserDetails(null);
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navList = (
        <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-6 text-lg">
            <Typography as="li" className="p-1 font-normal text-black">
                <a href="#" onClick={() => navigate('/')}>Home</a>
            </Typography>
            <Typography as="li" className="p-1 font-normal text-black">
                <a href="#" onClick={() => navigate('/Feed')}>Feed</a>
            </Typography>
        </ul>
    );

    return (
        <div className="sticky top-0 z-10 bg-white">
            <Navbar className="h-max max-w-full px-3 py-1 rounded-none">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            className="h-16 w-16 object-contain"
                            src={postus}
                            alt="Logo"
                        />
                        <Typography as="a" href="#" className="ml-2 font-medium text-black text-xl">
                            Post Us
                        </Typography>
                    </div>
                    <div className="hidden lg:flex lg:items-center">{navList}</div>
                    <div className="flex items-center gap-4">
                        {userDetails ? (
                            <div className="flex items-center flex-col">
                                <span className="text-black ">{userDetails.username}</span>
                                <Button size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="text" onClick={() => navigate('/sign-in')}>
                                    Log In
                                </Button>
                                <Button size="sm" variant="gradient" onClick={() => navigate('/sign-up')}>
                                    Sign Up
                                </Button>
                            </div>
                        )}
                        <IconButton
                            variant="text"
                            className="lg:hidden"
                            onClick={() => setOpenNav(!openNav)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d={openNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                />
                            </svg>
                        </IconButton>
                    </div>
                </div>
                <MobileNav open={openNav}>
                    <div className="flex flex-col items-center gap-4">{navList}</div>
                </MobileNav>
            </Navbar>
        </div>
    );
};
