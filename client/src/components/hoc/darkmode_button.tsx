import React from "react";

export default function darkmode_button(WrappedComponent: React.ComponentType) {
    return (props: any) => {
        return (
            <button className="active_button">
                <WrappedComponent {...props} />
            </button>
        );
    };
};