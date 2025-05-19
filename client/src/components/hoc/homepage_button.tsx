import React from "react";

export default function homepage_button(WrappedComponent: React.ComponentType) {
    return (props: any) => {
        return (
            <button className="homepage_active_button">
                <WrappedComponent {...props} />
            </button>
        );
    };
};