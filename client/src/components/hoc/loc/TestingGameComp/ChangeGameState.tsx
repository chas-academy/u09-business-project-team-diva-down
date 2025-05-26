import homepage_button from "../../homepage_button";

type ClickableGameStateProp = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const ChangeGameState = (props: ClickableGameStateProp) => {
    return (
        <>Change Game</>
    );
};

export default homepage_button(ChangeGameState);
