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
        elo: 163,
    }
]


const Leaderboard_Card = () => {
    return (
        <>
            <div className="leaderboard_container">
                {MockDataFriends.map((data, index) => {
                    return (
                        <div className="leaderboard_bar">
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