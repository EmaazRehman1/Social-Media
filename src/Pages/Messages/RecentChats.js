import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import Sidebar from '../../Components/SideBar';
import { NavBar } from '../../Components/NavBar';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDoc, doc, getDocs } from 'firebase/firestore';
export const RecentChats = () => {
  const [recentChats, setRecentChats] = useState([]);
  const [friends, setFriends] = useState([]);
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const navigate = useNavigate();
  const [friendData, setFriendData] = useState([]);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);






  const handleChatClick = (friendId) => {
    navigate(`/chat/${friendId}`);
  };


  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <NavBar />
        <div className="p-4">

          <h2 className="text-lg font-bold mt-4">Friends</h2>
          {loading ? (
            <div className="text-gray-500 text-center">Loading friends...</div>
          ) : (

            <ul>
              {friends.length >0? (
                <ul>
                {friends.map((friend, index) => (
                  <li
                    key={friend.id}
                    className="p-2 bg-white shadow mb-2 rounded cursor-pointer hover:font-bold"
                    onClick={() => handleChatClick(friend.id)}
                  >
                    {index + 1}: {friend.username || 'Loading...'}
                  </li>
                ))}
              </ul>
              ):(
                <p className='text-center'>No friends</p>
              )}
              


            </ul>
          )}


        </div>
      </div>
    </div>
  );
};
