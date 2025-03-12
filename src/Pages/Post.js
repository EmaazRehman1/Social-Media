import React, { useState } from 'react'
import { Button, Card, Input } from '@material-tailwind/react'
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavBar } from '../Components/NavBar';
import Sidebar from '../Components/SideBar';
import { toast, ToastContainer } from "react-toastify";
import Textarea from '@material-tailwind/react';
import { serverTimestamp } from 'firebase/firestore';

export const CreateForm = ({ onPostCreated }) => {
  const [post, setPost] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [user] = useAuthState(auth);

  const postsRef = collection(db, "posts");


  const handlesubmit = async () => {
    if (!title || !desc) {
      alert("Please fill in both the title and description.");
      return;
    }
    try {
      await addDoc(postsRef, {
        title: title,
        description: desc,
        username: user?.username|| user?.email, 
        id: user?.uid,
        timestamp: serverTimestamp(), 
      });
      toast.success("Post Sucessfull!!", {
        position: "top-center"
      })
      if (onPostCreated) {
        onPostCreated(); 
    }
      setTitle(""); 
      setDesc("");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Post Failed!!", {
        position: "top-center"
      })
    }
  }



  return (
    <div className="flex-1 bg-gray-100 m-0">
      <ToastContainer />
      <div className="flex justify-center items-center mt-10 flex-col px-4">
        <div className="p-6 flex flex-col gap-4 max-w-md w-full">
          <div>

          <h2 className="text-2xl font-semibold text-gray-800">
            What's on your mind?
          </h2>
          <h3 className='text-sm text-gray-600'>Post for people to see</h3>
          </div>
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
          />
          <Button
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300"
            onClick={handlesubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
  
}
