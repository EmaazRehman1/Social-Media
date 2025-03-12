import React, { useEffect, useState } from 'react';
import { db, auth } from '../config/firebase';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import Sidebar from '../Components/SideBar';
import { NavBar } from '../Components/NavBar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Timestamp } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@material-tailwind/react';
export const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user] = useAuthState(auth);

    const fetchFriends = async () => {
        try {
            setLoading(true);

            if (!user) {
                console.error('No user is logged in.');
                return;
            }

            const friendsCollection = collection(db, 'friends');
            const q1 = query(friendsCollection, where('person1Id', '==', user.uid));
            const q2 = query(friendsCollection, where('person2Id', '==', user.uid));

            const [q1Snapshot, q2Snapshot] = await Promise.all([
                getDocs(q1),
                getDocs(q2),
            ]);

            const friendIds = [];

            q1Snapshot.docs.forEach((docSnap) => {
                const data = docSnap.data();
                friendIds.push(data.person2Id);
            });

            q2Snapshot.docs.forEach((docSnap) => {
                const data = docSnap.data();
                friendIds.push(data.person1Id);
            });

            const friendsWithDetails = await Promise.all(
                friendIds.map(async (friendId) => {
                    const friendDoc = await getDoc(doc(db, 'users', friendId));
                    return friendDoc.exists() ? { id: friendId, ...friendDoc.data() } : null;
                })
            );

            setFriends(friendsWithDetails.filter(Boolean));
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleRemoveFriends = async (friendId) => {
        try {
            const currentUserId = user.uid;

            const friendCollectionRef = collection(db, 'friends');
            const q1 = query(friendCollectionRef, where('person1Id', '==', currentUserId), where('person2Id', '==', friendId));
            const q2 = query(friendCollectionRef, where('person1Id', '==', friendId), where('person2Id', '==', currentUserId));

            const [q1Snapshot, q2Snapshot] = await Promise.all([getDocs(q1), getDocs(q2)]);

            if (!q1Snapshot.empty) {
                const docRef = q1Snapshot.docs[0].ref;
                await deleteDoc(docRef);
            }
            if (!q2Snapshot.empty) {
                const docRef = q2Snapshot.docs[0].ref;
                await deleteDoc(docRef);
            }

            setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));

            toast.success("Friend removed successfully!", {
                position: "top-center",
            });
        } catch (error) {
            console.error("Error removing friend:", error);
            toast.error("Failed to remove friend.", {
                position: "top-center",
            });
        }
    };


    useEffect(() => {
        if (user) {
            fetchFriends();
        }
    }, [user]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <div className="sticky top-0 z-10">
                    <NavBar />
                </div>
                <div className="p-6 bg-gray-100 flex-1">
                    <h1 className="text-2xl font-bold mb-4">Your Friends</h1>
                    <ToastContainer />
                    {loading ? (
                        <div className="flex justify-center items-center flex-col">
                            <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
                            <div>Loading...</div>
                        </div>
                    ) : friends.length > 0 ? (
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <ul className="space-y-4">
                                {/* {friends.map((friend) => (
                                    
                                    <li
                                        key={friend.id}
                                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow"
                                    >
                                        <div>
                                            <p className="font-bold">{friend.username}</p>
                                            <p>{friend.email}</p>
                                        </div>
                                        <div>
                                            <p className=""> friends since {friend.createdAt}</p>
                                        </div>
                                    </li>
                                ))} */}
                                {friends.map((friend) => {
                                    const createdAtDate = friend.createdAt ? friend.createdAt.toDate() : new Date(); // Convert Timestamp to Date
                                    const formattedDate = createdAtDate.toLocaleDateString(); // Format as needed
                                    return (
                                        <div className='flex justify-between'>
                                            <li key={friend.id} className="flex items-center bg-gray-50 p-3 gap-4 rounded-md shadow">
                                                <div>
                                                    <p className="font-bold">{friend.username}</p>
                                                    <p>{friend.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 mt-2">Friends since {formattedDate}</p>
                                                </div>
                                            </li>
                                            <div className='flex items-center gap-3'>
                                                <Button variant='gradient'
                                                    color='blue'
                                                >Message</Button>
                                                <Button variant='gradient'
                                                    color='red'
                                                    onClick={() => handleRemoveFriends(friend.id)}
                                                >Remove</Button>

                                            </div>
                                        </div>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <p>No friends found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
