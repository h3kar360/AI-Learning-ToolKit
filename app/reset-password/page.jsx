import React from "react";
import ResetPasswordPage from "@/components/ResetPasswordPage";

const page = () => {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
            <Suspense
                fallback={
                    <div className="text-xl">Loading security token...</div>
                }
            >
                <ResetPasswordPage />
            </Suspense>
        </div>
    );
};

export default page;
