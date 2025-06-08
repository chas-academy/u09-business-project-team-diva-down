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

    return (
        <>
            <div className="leaderboard_container">
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