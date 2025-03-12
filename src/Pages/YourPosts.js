import React, { useEffect, useState } from 'react';
import { NavBar } from '../Components/NavBar';
import Sidebar from '../Components/SideBar';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Textarea } from '@material-tailwind/react';
import { ToastContainer, toast } from 'react-toastify';
import { orderBy } from 'firebase/firestore';
export const YourPosts = () => {
    const [posts, setPosts] = useState([]);
    const [user] = useAuthState(auth);
    const [modal, setModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [loading, setLoading] = useState(false); 

    const handleUpdate = async (id) => {
        try {
            if (!newTitle.trim() || !newDesc.trim()) {
                toast.error("Both fields are requiered!!", {
                    position: "top-center"
                })
                return;
            }

            setLoading(true); 
            await updateDoc(doc(db, 'posts', id), {
                title: newTitle,
                description: newDesc,
            });

            toast.success("Post updated Sucessfully!!", {
                position: "top-center"
            })
            setModal(false);
            fetchUserPosts();
        } catch (error) {
            toast.error("Error updating post!!", {
                position: "top-center"
            })
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true); 
            await deleteDoc(doc(db, 'posts', id));
            fetchUserPosts();
            toast.success("Post deleted Sucessfully!!", {
                position: "top-center"
            })
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error("Error deleting post!!", {
                position: "top-center"
            })
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPosts = async () => {
        try {
            setLoading(true); 
            if (!user) return;
            const postsRef = collection(db, 'posts');
            const q = query(postsRef, where('username', '==', user.email));
            const querySnapshot = await getDocs(q);

            const userPosts = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            userPosts.sort((a, b) => b.timestamp - a.timestamp);

            setPosts(userPosts);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setLoading(false); 
        }
    };

    
    
    useEffect(() => {
        fetchUserPosts();
    }, [user]);

    const openModal = (post) => {
        setCurrentPost(post);
        setNewTitle(post.title);
        setNewDesc(post.description);
        setModal(true);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex-1 bg-gray-100">
                <NavBar />
                <div className="mt-6 space-y-4">
            <ToastContainer/>

                    {loading ? (
                        <div className="flex justify-center items-center flex-col">
                            <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
                            <div>Loading...</div>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="bg-white shadow-md rounded-md p-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-gray-800">{post.title}</h2>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm text-gray-600">Post by {post.username}</p>
                                        <Button
                                            variant="gradient"
                                            color="red"
                                            onClick={() => handleDelete(post.id)}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="gradient"
                                            color="blue"
                                            onClick={() => openModal(post)}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-gray-700 mt-2">{post.description}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-center">No posts to display.</p>
                    )}

                    {/* Update Modal */}
                    <Dialog open={modal} handler={() => setModal(!modal)}>
                        <DialogHeader>Edit Post</DialogHeader>
                        <DialogBody className="flex flex-col gap-4">
                            <Input
                                label="Title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="mb-4"
                            />
                            <Textarea
                                label="Description"
                                value={newDesc}
                                onChange={(e) => setNewDesc(e.target.value)}
                                rows={4}
                            />
                        </DialogBody>
                        <DialogFooter>
                            <Button
                                variant="text"
                                color="red"
                                onClick={() => setModal(false)}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="gradient"
                                color="blue"
                                onClick={() => handleUpdate(currentPost.id)}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

