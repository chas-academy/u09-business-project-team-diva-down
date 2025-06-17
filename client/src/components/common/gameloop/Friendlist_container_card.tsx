
interface IFriend {
    id: string;
    name: string;
    email: string;
};

type SpecificFriendArray = IFriend[];

interface Friendlist_containerProps {
    EachFriend: SpecificFriendArray;
}


const Friendslist_Container: React.FC<Friendlist_containerProps> = ({
    // EachFriend,
}) => {
    return (
        <>
            <div className="friendlist_container">
                <table className="friends_table">
                    <tbody>
                        {/* {EachFriend.map((friend) => {
                            return (
                                <tr key={friend.id}>
                                    <td> {friend.name} </td>
                                    <td> Elo Rating </td>
                                    <td> <button className="invite">Invite</button> </td>
                                </tr>
                            );
                        })} */}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Friendslist_Container;