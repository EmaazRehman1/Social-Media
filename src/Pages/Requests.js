import React, { useEffect, useState } from 'react';
import { db, auth } from '../config/firebase';
import { collection, getDocs, doc, updateDoc, where, query, getDoc } from 'firebase/firestore';
import { NavBar } from '../Components/NavBar';
import Sidebar from '../Components/SideBar';
import { Button } from '@material-tailwind/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { deleteDoc } from 'firebase/firestore';
import { addDoc } from 'firebase/firestore';
import { ToastContainer,toast } from 'react-toastify';
export const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user] = useAuthState(auth);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.error('No user is logged in.');
                return;
            }

            const friendRequestsCollection = collection(db, 'friendrequests');
            const q = query(friendRequestsCollection, where('recieverId', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);

            const requestsWithSenderData = await Promise.all(
                querySnapshot.docs.map(async (docSnap) => {
                    const requestData = docSnap.data();
                    const senderDoc = await getDoc(doc(db, 'users', requestData.senderId));
                    return {
                        id: docSnap.id,
                        ...requestData,
                        senderName: senderDoc.exists() ? senderDoc.data().username : 'Unknown User',
                        senderEmail: senderDoc.exists() ? senderDoc.data().email : 'Unknown Email',
                    };
                })
            );

            setRequests(requestsWithSenderData);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

const handleAcceptRequest = async (requestId) => {
    try {
        const requestDoc = doc(db, 'friendrequests', requestId);
        const requestData = (await getDoc(requestDoc)).data();

        if (requestData) {
            await addDoc(collection(db, 'friends'), {
                person1Id: requestData.senderId,
                person2Id: requestData.recieverId,
                createdAt: new Date(), 
            });

            await updateDoc(requestDoc, { status: 'accepted' });

            toast.success("Friend request Accepted!", {
                position: "top-center"
           })
            fetchRequests(); 
        } else {
            console.error('Request data not found.');
        }
    } catch (error) {
        console.error('Error accepting request:', error);
    }
};


    const handleDeclineRequest = async (requestId) => {
        try {
            const requestDoc = doc(db, 'friendrequests', requestId);
            await updateDoc(requestDoc, { status: 'declined' });
            toast.success("Request denied!", {
                position: "top-center"
           })
            fetchRequests();
        } catch (error) {
            console.error('Error declining request:', error);
        }
    };

    const handleClearRequests = async () => {
        try {
            const acceptedOrDeclinedRequests = requests.filter(
                (request) => request.status === 'accepted' || request.status === 'declined'
            );

            await Promise.all(
                acceptedOrDeclinedRequests.map(async (request) => {
                    const requestDoc = doc(db, 'friendrequests', request.id);
                    await deleteDoc(requestDoc);
                })
            );

            toast.success("Cleared requests!", {
                 position: "top-center"
            })
            fetchRequests();
        } catch (error) {
            console.error('Error clearing requests:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user]);

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <div className="sticky top-0 z-10">
                        <NavBar />
                    </div>
                    <div className="p-6 bg-gray-100 flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold">Friend Requests</h1>
                            <ToastContainer/>
                            <Button
                                variant="filled"
                                color="blue"
                                onClick={handleClearRequests}
                                disabled={requests.every((request) => request.status === 'pending')}
                            >
                                Clear
                            </Button>
                        </div>
                        {loading ? (
                            <div className="flex justify-center items-center flex-col">
                                <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
                                <div>Loading...</div>
                            </div>
                        ) : (
                            <div className="bg-white shadow-md rounded-lg p-4">
                                {requests.length > 0 ? (
                                    <ul className="space-y-4">
                                        {requests.map((request, index) => (
                                            <li
                                                key={request.id}
                                                className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow"
                                            >
                                                <div>
                                                    <p className="font-bold">
                                                        Request from: {request.senderName} ({request.senderEmail})
                                                    </p>
                                                    <p>Status: {request.status}</p>
                                                </div>
                                                <div className="space-x-2">
                                                    {request.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="filled"
                                                                color="green"
                                                                onClick={() => handleAcceptRequest(request.id)}
                                                            >
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                variant="filled"
                                                                color="red"
                                                                onClick={() => handleDeclineRequest(request.id)}
                                                            >
                                                                Decline
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No friend requests found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
