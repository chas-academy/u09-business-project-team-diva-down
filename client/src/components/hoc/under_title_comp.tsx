import React from "react";

export default function under_title_comp(WrappedComponent: React.ComponentType) {
    return (props: any) => {
        return (
            <div className="under_title_section">
                <WrappedComponent {...props} />
            </div>
        );
    };
};