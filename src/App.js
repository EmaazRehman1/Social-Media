import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/Home";
import SignInPage from "./Pages/SignIn";
import SignUpPage from "./Pages/SignUp";
import Error404Page from "./Pages/Errors/404";
import { Feed } from "./Pages/Feed";
import { CreateForm } from "./Pages/Post";
import { YourPosts } from "./Pages/YourPosts";
import { AddFriend } from "./Pages/AddFriend";
import { Requests } from "./Pages/Requests";
import { Friends } from "./Pages/Friends";
import { RecentChats } from "./Pages/Messages/RecentChats";
import { Chat } from "./Pages/Messages/Chat";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/feed" element={<Feed/>}/>
                <Route path="/post" element={<CreateForm/>}/>
                <Route path="/yourposts" element={<YourPosts/>}/>
                <Route path="/addfriend" element={<AddFriend/>}/>
                <Route path="/requests" element={<Requests/>}/>
                <Route path="/friends" element={<Friends/>}/>
                <Route path="/recentchats" element={<RecentChats/>}/>
                <Route path="/chat/:friendId" element={<Chat />} />
                <Route path="*" element={<Error404Page />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
