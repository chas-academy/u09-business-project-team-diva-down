import React from "react";

export default function hollow_button2(WrappedComponent: React.ComponentType) {
    return ({ onClick, ...props }: { onClick?: React.MouseEventHandler<HTMLButtonElement> } & any) => {
        return (
            <button 
                className="hollow_active_button_version2"
                onClick={onClick}>
                <WrappedComponent {...props} />
            </button>
        );
    };
};