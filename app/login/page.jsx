import React from "react";
import LogInForm from "@/components/LogInForm";

const page = () => {
    return (
        <div>
            <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
                <LogInForm />
            </div>
        </div>
    );
};

export default page;
