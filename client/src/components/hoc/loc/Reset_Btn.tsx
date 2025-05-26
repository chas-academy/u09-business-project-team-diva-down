import hollow_button1 from "../hollow_button1";

type ResetTimerProp = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const ResetTimerState = (props: ResetTimerProp) => {
    return (
        <>Reset Timer</>
    );
};

export default hollow_button1(ResetTimerState);