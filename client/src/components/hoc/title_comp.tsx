import React from "react";

export default function title_comp(WrappedComponent: React.ComponentType) {
    return (props: any) => {
        return (
            <div className="title_section">
                <WrappedComponent {...props} />
            </div>
        );
    };
};