import homepage_button from "../../homepage_button";

type ClickableGameStateProp = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const ChangeGameState = (props: ClickableGameStateProp) => {
    return (
        <button onClick={props.onClick}>Change Game</button>
    );
};

export default homepage_button(ChangeGameState);
