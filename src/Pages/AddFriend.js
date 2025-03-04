
// import React, { useEffect, useState } from 'react';
// import { db, auth } from '../config/firebase';
// import { getDocs, collection, addDoc, query, where } from 'firebase/firestore';
// import { NavBar } from '../Components/NavBar';
// import Sidebar from '../Components/SideBar';
// import { Button } from '@material-tailwind/react';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { ToastContainer, toast } from 'react-toastify';

// export const AddFriend = () => {
//     const [users, setUsers] = useState([]);
//     const [user] = useAuthState(auth);
//     const [loading, setLoading] = useState(false);
//     const [sentRequests, setSentRequests] = useState({}); // Object to track requests by userId
//     const [friends, setFriends] = useState([]); // Store friends

//     // Fetch all users
//     const fetchUsers = async () => {
//         try {
//             setLoading(true);

//             const usersCollection = collection(db, 'users');
//             const querySnapshot = await getDocs(usersCollection);
//             const usersData = querySnapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             })).filter((u) => u.id !== auth.currentUser?.uid); // Exclude current user

//             setUsers(usersData);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fetch sent friend requests
//     const fetchSentRequests = async () => {
//         try {
//             const currentUser = auth.currentUser;
//             if (!currentUser) return;

//             const friendRequestsCollection = collection(db, 'friendrequests');
//             const q = query(friendRequestsCollection, where('senderId', '==', currentUser.uid));
//             const querySnapshot = await getDocs(q);

//             const requests = {};
//             querySnapshot.forEach((doc) => {
//                 const data = doc.data();
//                 requests[data.recieverId] = data.status; // Track status by recipient ID
//             });

//             setSentRequests(requests);
//         } catch (error) {
//             console.error('Error fetching sent friend requests:', error);
//         }
//     };

//     // Fetch friends of the current user
//     const fetchFriends = async () => {
//         try {
//             const currentUser = auth.currentUser;
//             if (!currentUser) return;

//             const friendsCollection = collection(db, 'friends');
//             const q1 = query(friendsCollection, where('person1Id', '==', currentUser.uid));
//             const q2 = query(friendsCollection, where('person2Id', '==', currentUser.uid));

//             const [q1Snapshot, q2Snapshot] = await Promise.all([getDocs(q1), getDocs(q2)]);

//             const friendIds = [];

//             q1Snapshot.docs.forEach((docSnap) => {
//                 const data = docSnap.data();
//                 friendIds.push(data.person2Id);
//             });

//             q2Snapshot.docs.forEach((docSnap) => {
//                 const data = docSnap.data();
//                 friendIds.push(data.person1Id);
//             });

//             setFriends(friendIds);
//         } catch (error) {
//             console.error('Error fetching friends:', error);
//         }
//     };

//     // Handle adding a friend
//     const handleAddFriend = async (userId) => {
//         try {
//             const currentUser = auth.currentUser;
//             if (!currentUser) {
//                 console.error('No user is logged in.');
//                 return;
//             }

//             const friendRequestsCollection = collection(db, 'friendrequests');
//             await addDoc(friendRequestsCollection, {
//                 senderId: currentUser.uid,
//                 recieverId: userId,
//                 status: 'pending',
//                 timestamp: new Date(),
//             });

//             setSentRequests((prev) => ({ ...prev, [userId]: 'pending' })); // Update status locally
//             toast.success("Friend request sent!!", {
//                 position: "top-center"
//             })
//         } catch (error) {
//             console.error('Error sending friend request:', error);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//         fetchSentRequests();
//         fetchFriends();
//     }, [user]);

//     return (
//         <div className="flex min-h-screen">
//             <Sidebar />
//             <div className="flex-1 flex flex-col">
//                 <div className="sticky top-0 z-10">
//                     <NavBar />
//                 </div>
//                 <div className="p-6 bg-gray-100 flex-1">
//                     <h1 className="text-2xl font-bold mb-4">Users List</h1>
//                     {loading ? (
//                         <div className="flex justify-center items-center flex-col">
//                             <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
//                             <div>Loading...</div>
//                         </div>
//                     ) : (
//                         <div className="bg-white shadow-md rounded-lg p-4">
//                             <ToastContainer />
//                             {users.length > 0 ? (
//                                 <ul className="space-y-2 flex flex-col">
//                                     {users
//                                         .filter((u) => !friends.includes(u.id)) // Filter out friends
//                                         .map((user, index) => (
//                                             <li key={user.id} className="flex items-center justify-between">
//                                                 <div>
//                                                     <span className="font-bold">{index + 1}.</span>
//                                                     <span className="ml-2">{user.username}</span>
//                                                     <span className="ml-4 text-gray-600">({user.email})</span>
//                                                 </div>
//                                                 <div>
//                                                     <Button
//                                                         variant="filled"
//                                                         color="blue"
//                                                         onClick={() => handleAddFriend(user.id)}
//                                                         disabled={sentRequests[user.id] === 'pending'}
//                                                     >
//                                                         {sentRequests[user.id] === 'pending'
//                                                             ? 'Request Sent'
//                                                             : 'Add Friend'}
//                                                     </Button>
//                                                 </div>
//                                             </li>
//                                         ))}
//                                 </ul>
//                             ) : (
//                                 <p>No users found.</p>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };
import React, { useEffect, useState } from 'react';
import { db, auth } from '../config/firebase';
import { getDocs, collection, addDoc, query, where } from 'firebase/firestore';
import { NavBar } from '../Components/NavBar';
import Sidebar from '../Components/SideBar';
import { Button } from '@material-tailwind/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ToastContainer, toast } from 'react-toastify';

export const AddFriend = () => {
    const [users, setUsers] = useState([]);
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    const [sentRequests, setSentRequests] = useState({}); // Object to track requests by userId
    const [friends, setFriends] = useState([]); // Store friends
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    // Fetch all users
    const fetchUsers = async () => {
        try {
            setLoading(true);

            const usersCollection = collection(db, 'users');
            const querySnapshot = await getDocs(usersCollection);
            const usersData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })).filter((u) => u.id !== auth.currentUser?.uid); // Exclude current user

            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch sent friend requests
    const fetchSentRequests = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const friendRequestsCollection = collection(db, 'friendrequests');
            const q = query(friendRequestsCollection, where('senderId', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);

            const requests = {};
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                requests[data.recieverId] = data.status; // Track status by recipient ID
            });

            setSentRequests(requests);
        } catch (error) {
            console.error('Error fetching sent friend requests:', error);
        }
    };

    // Fetch friends of the current user
    const fetchFriends = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const friendsCollection = collection(db, 'friends');
            const q1 = query(friendsCollection, where('person1Id', '==', currentUser.uid));
            const q2 = query(friendsCollection, where('person2Id', '==', currentUser.uid));

            const [q1Snapshot, q2Snapshot] = await Promise.all([getDocs(q1), getDocs(q2)]);

            const friendIds = [];

            q1Snapshot.docs.forEach((docSnap) => {
                const data = docSnap.data();
                friendIds.push(data.person2Id);
            });

            q2Snapshot.docs.forEach((docSnap) => {
                const data = docSnap.data();
                friendIds.push(data.person1Id);
            });

            setFriends(friendIds);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    // Handle adding a friend
    const handleAddFriend = async (userId) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.error('No user is logged in.');
                return;
            }

            const friendRequestsCollection = collection(db, 'friendrequests');
            await addDoc(friendRequestsCollection, {
                senderId: currentUser.uid,
                recieverId: userId,
                status: 'pending',
                timestamp: new Date(),
            });

            setSentRequests((prev) => ({ ...prev, [userId]: 'pending' })); // Update status locally
            toast.success("Friend request sent!!", {
                position: "top-center"
            });
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    // Handle search input change
    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase()); // Update search query
    };

    useEffect(() => {
        fetchUsers();
        fetchSentRequests();
        fetchFriends();
    }, [user]);

    // Filter users based on the search query
    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <div className="sticky top-0 z-10">
                    <NavBar />
                </div>
                <div className="p-6 bg-gray-100 flex-1">
                    <h1 className="text-2xl font-bold mb-4">Users List</h1>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center flex-col">
                            <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
                            <div>Loading...</div>
                        </div>
                    ) : (
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <ToastContainer />
                            {filteredUsers.length > 0 ? (
                                <ul className="space-y-2 flex flex-col">
                                    {filteredUsers
                                        .filter((u) => !friends.includes(u.id)) // Filter out friends
                                        .map((user, index) => (
                                            <li key={user.id} className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold">{index + 1}.</span>
                                                    <span className="ml-2">{user.username}</span>
                                                    <span className="ml-4 text-gray-600">({user.email})</span>
                                                </div>
                                                <div>
                                                    <Button
                                                        variant="filled"
                                                        color="blue"
                                                        onClick={() => handleAddFriend(user.id)}
                                                        disabled={sentRequests[user.id] === 'pending'}
                                                    >
                                                        {sentRequests[user.id] === 'pending'
                                                            ? 'Request Sent'
                                                            : 'Add Friend'}
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p>No users found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
