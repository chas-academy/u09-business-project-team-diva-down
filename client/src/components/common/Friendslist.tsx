import { useState } from "react";
import { MockDataAllUsers } from "../../MockData/MockData";
import { MockDataUserOwnData } from "../../MockData/MockData";

const MockDataFriendsList = [
    {
        id: 0,
        username: 'Stevensson',
        elo: 251,
    },
    {
        id: 1,
        username: 'Karlsson',
        elo: 215,
    },
    {
        id: 2,
        username: 'Andersson',
        elo: 163,
    }
]

const MockDataAcceptList = [
    {
        id: 3,
        username: "Charleet",
        elo: 214,
    }
]

const Friendslist_card = () => {

    const [friendsList, setFriendList] = useState(MockDataFriendsList);
    const [acceptList, setAcceptList] = useState(MockDataAcceptList);
    const [allUsers, setAllUsers] = useState(MockDataAllUsers);
    const [requestValue, setRequestValue] = useState('');
    const [UserData, setUserData] = useState(MockDataUserOwnData); 
    // Simulates the users data after they have logged into the application and started too use the website

    const RemoveFriend = (id: number) => {
        console.log(id);
        console.log(friendsList);
        const updatedFriendsList = friendsList.filter(friend => friend.id !== id);
        setFriendList(updatedFriendsList);
        console.log(friendsList);
    }

    const DeclineRequest = (id: number) => {
        const updatedAcceptList = acceptList.filter(request => request.id !== id);
        setAcceptList(updatedAcceptList);
    }

    const AcceptRequest = (id: number) => {
        const AcceptedUser = acceptList.find(request => request.id === id);
        if (AcceptedUser) {
            setFriendList([...friendsList, AcceptedUser]);
            setAcceptList(acceptList.filter(request => request.id !== id));
        }
    }

    const handleSendingFriendRequest = (e: React.FormEvent) => {
        e.preventDefault();
        const SpecificUser = allUsers.find(data => data.username === requestValue);

        if (SpecificUser) {
            const AlreadyFriends = friendsList.find(data => data.id === UserData.id);
            const AlreadySentRequest = acceptList.some(data => data.id === UserData.id);

            if(AlreadyFriends) {
                console.log("You already have them as your friend!");
                setRequestValue('');
            } else if (AlreadySentRequest) {
                console.log("You have already sent them a friend Request!");
                setRequestValue('');
            } else {
                setAcceptList([...acceptList, UserData]);
                setRequestValue('');
            }
        } else {
            console.log("Cant Find the user");
            setRequestValue('');
        }
    }

    return (
        <>
            <div className="user_friendslist">
                <div className="under_title">Freindslist</div>
                <form className="search_container" onSubmit={handleSendingFriendRequest}>
                    <input 
                        className="input_field" 
                        type="text" 
                        id="input_data"
                        value={requestValue}
                        onChange={(e) => setRequestValue(e.target.value)}
                    />
                    <input className="submit_button" type="submit" value="Send Request"/>
                </form>
                <div className="friend_container">
                    {friendsList.map((data) => {
                        return (
                            <div className="friend_bar" key={data.id}>
                                <div className="username">{data.username}</div>
                                <button onClick={() => RemoveFriend(data.id)} value={data.id} className="remove_friend">Remove Friend</button>
                            </div>
                        );
                    })}
                </div>

                <div className="under_title">Accept Pending Requests</div>

                <div className="accept_container">
                    {acceptList.map((data) => {
                        return (
                            <div className="accept_bar" key={data.id}>
                                <div className="username">{data.username}</div>
                                <div className="container">
                                    <button onClick={() => AcceptRequest(data.id)} value={data.id} className="accept">Accept</button>
                                    <button onClick={() => DeclineRequest(data.id)} value={data.id} className="decline">Decline</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
};

export default Friendslist_card;