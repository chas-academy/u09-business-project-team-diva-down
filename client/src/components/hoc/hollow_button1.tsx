import React from "react";

export default function hollow_button1(WrappedComponent: React.ComponentType) {
    return (props: any) => {
        return (
            <button className="hollow_active_button">
                <WrappedComponent {...props} />
            </button>
        );
    };
};