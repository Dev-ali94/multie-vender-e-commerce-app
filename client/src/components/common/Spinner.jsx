import React from "react";
import { Loader2 } from "lucide-react";



export const Spinner = ({ fullScreen, padded }) => {
    const icon = <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />;

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                {icon}
            </div>
        );
    }

    if (padded) {
        return (
            <div className="p-12 flex items-center justify-center">
                {icon}
            </div>
        );
    }

    return icon;
};
