import React, { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import Sidebar from "../../Components/SideBar";
import { NavBar } from "../../Components/NavBar";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDoc,doc } from "firebase/firestore";
import { Button, Input } from "@material-tailwind/react";
export const Chat = () => {
  const { friendId } = useParams(); // Friend ID from URL
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const [userId, setUserId] = useState(null);
  const [friendName, setFriendName] = useState("");  // Fetch user ID once Firebase auth is ready
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userId) return; // Wait until userId is available

    console.log("Fetching all messages...");

    const messagesRef = collection(db, "messages");

    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("All Messages:", allMessages);
        setMessages(allMessages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Filter messages based on senderId and receiverId
  useEffect(() => {
    if (!userId || !friendId) return;

    const conversationMessages = messages.filter(
      (msg) =>
        (msg.senderId === userId && msg.receiverId === friendId) ||
        (msg.senderId === friendId && msg.receiverId === userId)
    );

    console.log("Filtered Messages:", conversationMessages);
    setFilteredMessages(conversationMessages);
  }, [messages, userId, friendId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId) return;

    try {
      await addDoc(collection(db, "messages"), {
        senderId: userId,
        receiverId: friendId,
        message: newMessage,
        timestamp: serverTimestamp(),
        status: "sent",
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  useEffect(() => {
    if (!friendId) return;

    const friendRef = doc(db, "users", friendId);

    const getFriendName = async () => {
      try {
        const friendDoc = await getDoc(friendRef);
        if (friendDoc.exists()) {
          setFriendName(friendDoc.data().username); // Assuming the field is "username"
        }
      } catch (error) {
        console.error("Error fetching friend's name:", error);
      }
    };

    getFriendName();
  }, [friendId]);

  const handleDelete = async () => {
    if (!userId || !friendId) return;

    // Find all messages between the user and the friend
    const messagesToDelete = messages.filter(
      (msg) =>
        (msg.senderId === userId && msg.receiverId === friendId) ||
        (msg.senderId === friendId && msg.receiverId === userId)
    );

    try {
      // Delete each message
      for (const msg of messagesToDelete) {
        await deleteDoc(doc(db, "messages", msg.id));
      }

      // Update the state to remove the deleted messages
      setMessages(messages.filter((msg) => !messagesToDelete.includes(msg)));
      setFilteredMessages([]);
      console.log("Chat cleared successfully!");
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <NavBar />
        <div className="p-4">
          <div className="flex justify-between">

          <h2 className="text-lg font-bold">{friendName}</h2>
          {/* <Button variant="filled" color="red" onClick={handleDelete}>Clear chat</Button> */}
          </div>
          <div className="chat-box bg-white shadow p-4 rounded h-96 overflow-y-auto">
            {loading ? (
              <div className="text-gray-500 text-center">Loading messages...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-gray-500 text-center">No messages yet.</div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                key={msg.id}
                className={`mb-2 ${msg.senderId === userId ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block p-3 rounded-lg max-w-xs break-words ${
                    msg.senderId === userId
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 text-black mr-auto"
                  }`}
                >
                  {msg.message}
                  <div
                    className={`text-xs ${
                      msg.senderId === userId ? "text-right text-blue-300" : "text-left text-gray-400"
                    }`}
                  >
                    {msg.timestamp?.toDate().toLocaleTimeString()}
                  </div>
                </span>
              </div>
              
              ))
            )}
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 border rounded "
              placeholder="Type your message..."
            />

            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-500 text-white p-2 rounded"
            >
              Send
            </button>
          </div>
          <Button variant="filled" color="red" onClick={handleDelete} className="mt-3">Clear chat</Button>

        </div>
      </div>
    </div>
  );
};

