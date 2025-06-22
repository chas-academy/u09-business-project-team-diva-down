// REMOVE `userId` from props
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import API from "../../services/api";
import axios from "axios";

interface User {
    _id: string;
    username: string;
    eloScore: number;
    email?: string;
}

interface Relationship {
    _id: string;
    user: User;
    friend: User;
    status: "pending" | "accepted";
}

const Friendslist_card: React.FC = () => {
    const userId = localStorage.getItem("userId") ?? "";

    const [friendsList, setFriendList] = useState<Relationship[]>([]);
    const [acceptList, setAcceptList] = useState<Relationship[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [requestValue, setRequestValue] = useState("");

    // useEffect(() => {
    //     fetchFriends();
    //     fetchPending();
    //     fetchAllUsers();
    // }, []);

    const fetchFriends = async () => {
        const res = await API.get<Relationship[]>(`/${userId}`);
        setFriendList(res.data);
    };

    const fetchPending = async () => {
        const res = await API.get<Relationship[]>(`/pending/${userId}`);
        setAcceptList(res.data);
    };

    const fetchAllUsers = async () => {
        try {
            axios.get('http://localhost:3000/user')
                .then(response => {
                    console.log(response.data)
                    const data = response.data;
                    setAllUsers(data);
                })
                .catch(error => {console.error(error)});
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    const handleRemoveFriend = (id: string) => {
        setFriendList(prev => prev.filter(rel => rel.friend._id !== id));
    };

    const handleDeclineRequest = async (relationshipId: string) => {
        await API.delete(`/${relationshipId}`);
        setAcceptList(prev => prev.filter(rel => rel._id !== relationshipId));
    };

    const handleAcceptRequest = async (relationshipId: string) => {
        await API.post("/accept", { relationshipId });
        await fetchFriends();
        await fetchPending();
    };

    const handleSendFriendRequest = async (e: FormEvent) => {
        e.preventDefault();

        const targetUser = allUsers.find(user => user.username === requestValue);
        if (!targetUser) {
            console.log("User not found");
            setRequestValue("");
            return;
        }

        try {
            await API.post("/request", {
                userId,
                friendId: targetUser._id
            });
            console.log("Friend request sent");
        } catch (err) {
            console.error("Error sending friend request:", err);
        } finally {
            setRequestValue("");
        }
    };

    const CheckStatus = () => {
        console.log(allUsers);
    }

    return (
        <div className="user_friendslist">
            <div className="under_title">Friendslist</div>

            <button style={{color: '#FFF'}} onClick={() => CheckStatus()}>Check Status</button>
            <button style={{color: '#FFF'}} onClick={() => fetchAllUsers()}>Check Fetching Users</button>

            <form className="search_container" onSubmit={handleSendFriendRequest}>
                <input
                    className="input_field"
                    type="text"
                    value={requestValue}
                    onChange={(e) => setRequestValue(e.target.value)}
                />
                <input className="submit_button" type="submit" value="Send Request" />
            </form>

            <div className="friend_container">
                {friendsList.map((data) => (
                    <div className="friend_bar" key={data._id}>
                        <div className="username">{data.friend.username}</div>
                        <button onClick={() => handleRemoveFriend(data.friend._id)} className="remove_friend">
                            Remove Friend
                        </button>
                    </div>
                ))}
            </div>

            <div className="under_title">Accept Pending Requests</div>

            <div className="accept_container">
                {acceptList.map((data) => (
                    <div className="accept_bar" key={data._id}>
                        <div className="username">{data.user.username}</div>
                        <div className="container">
                            <button onClick={() => handleAcceptRequest(data._id)} className="accept">
                                Accept
                            </button>
                            <button onClick={() => handleDeclineRequest(data._id)} className="decline">
                                Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Friendslist_card;
