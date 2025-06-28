import axios from "axios";
import { useState } from "react";

const MockDataFriends = [
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
        elo: 563,
    }
]




const Leaderboard_Card = () => {

    const sortedElo = [...MockDataFriends].sort((a, b) => b.elo - a.elo);
    const [LeaderBoardData, SetLeaderBoardData] = useState();

    const FetchUsers = () => {
        const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    
        const apiUrl = isLocalhost 
            ? 'http://localhost:3000/user' 
            : 'https://u09-business-project-team-diva-down.onrender.com/user';

        axios.get(apiUrl)
            .then(response => {
                const AllUserData = response.data;
                SetLeaderBoardData(AllUserData);
                console.log("Fetch Complete");
        }).catch(error => console.error("Failed to fetch Users", error));
    }

    const CheckStatus = () => {
        FetchUsers();
        console.log(LeaderBoardData);
    }

    return (
        <>
            <div className="leaderboard_container">
                <button style={{color: '#FFF'}} onClick={() => CheckStatus()}>Check Status</button>
                {sortedElo.map((data, index) => {
                    return (
                        <div className="leaderboard_bar" key={data.id}>
                            <div className="username">{data.username}</div>
                            <div className="rank">{index + 1}</div>
                            <div className="eloRating">{data.elo}</div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Leaderboard_Card;