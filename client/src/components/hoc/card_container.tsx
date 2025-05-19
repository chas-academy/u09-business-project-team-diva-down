import React from "react";

export default function card_container(WrappedComponent: React.ComponentType) {
    return (props: any) => {
        return (
            <button className="card_component_homepage">
                <WrappedComponent {...props} />
            </button>
        );
    };
};

