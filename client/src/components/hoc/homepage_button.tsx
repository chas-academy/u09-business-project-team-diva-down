import React from "react";

export default function homepage_button(WrappedComponent: React.ComponentType) {
    return ({ onClick, ...props }: { onClick?: React.MouseEventHandler<HTMLButtonElement> } & any) => {
        return (
            <button 
                className="homepage_active_button"
                onClick={onClick}>
                <WrappedComponent {...props} />
            </button>
        );
    };
};