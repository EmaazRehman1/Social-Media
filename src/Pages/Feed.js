import React, { useEffect, useState } from 'react';
import { NavBar } from '../Components/NavBar';
import { auth, db } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Sidebar from '../Components/SideBar';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@material-tailwind/react';
import { orderBy, query } from 'firebase/firestore';
import { CreateForm } from './Post';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Feed = () => {
    const [user] = useAuthState(auth);
    const [posts, setPosts] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [refreshPosts, setRefreshPosts] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); 

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsQuery = query(
                    collection(db, 'posts'),
                );
                const querySnapshot = await getDocs(postsQuery);
                const fetchedPosts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                fetchedPosts.sort((a, b) => b.timestamp - a.timestamp);

                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false); 
            }
        };
        fetchPosts();
    }, [refreshPosts]);

    const handlePostCreated = () => {
        setRefreshPosts(prev => !prev); 
    };

    return (
        <>
            {user ? (
                <div className="flex min-h-screen">
                    <div
                        className={`fixed z-20 top-16 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                            } bg-gray-800 text-white h-full w-64`}
                    >
                        <Sidebar />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="sticky top-0 z-30 bg-white">
                            <Button
                                className="ml-4 mt-2"
                                color="blue"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                         
                                {sidebarOpen ? (
                                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{'>'}</span> 
                                    // <FontAwesomeIcon icon={'fa-solid fa-right-long'}/>
                                ) : (
                                    <FontAwesomeIcon icon={faBars} /> // Menu icon
                                )}

                            </Button>
                        </div>
                        <CreateForm onPostCreated={handlePostCreated} />
                        <div className="p-6 bg-gray-100 flex-1">
                            <h1 className="text-2xl font-semibold text-gray-800">
                                Welcome to your feed, See what's new
                            </h1>

                            <div className="mt-6 space-y-4">
                                {loading ? (
                                    <div className="flex justify-center items-center">
                                        <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
                                    </div>
                                ) : posts.length > 0 ? (
                                    posts.map(post => (
                                        <div
                                            key={post.id}
                                            className="bg-white shadow-md rounded-md p-4"
                                        >
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-lg font-bold text-gray-800">
                                                    {post.title}
                                                </h2>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Post by {post.username}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        {new Date(
                                                            post.timestamp?.seconds * 1000
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 mt-2">
                                                {post.description}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 text-center">
                                        No posts to display.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <NavBar />
                    <h1 className="text-2xl font-semibold text-gray-800 flex justify-center items-center min-h-screen">
                        Login to see your feed
                    </h1>
                </div>
            )}
        </>
    );
};

