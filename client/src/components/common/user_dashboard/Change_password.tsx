// import { useState } from "react";

interface selectValue {
    value: number;
}

interface ChangePasswordProps {
    selectedValue: selectValue;
    onOptionChange: (option: selectValue) => void;
    ToggleWindowFunction: () => void;
}


const ChangePassword: React.FC<ChangePasswordProps> = ({ selectedValue, onOptionChange, ToggleWindowFunction }) => {
    
    // const [value, setValue] = useState<selectValue>();

    const handleValueClick = () => {
        const NewValue = Math.random();
        const updatedValue = {
            value: NewValue,
        };
        onOptionChange(updatedValue);
    };

    return (
        <>
            <div className="password-background">
                <div className="change-password-container">
                    <button onClick={() => handleValueClick()}>Press Me</button>
                    <div className="output">
                        {selectedValue.value}
                    </div>
                    <button onClick={ToggleWindowFunction}>
                        Exit
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;