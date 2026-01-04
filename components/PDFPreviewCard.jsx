import React from "react";
import Link from "next/link";

const PDFPreviewCard = ({ title, pdfId, onDelete }) => {
    return (
        <span className="flex justify-center items-center flex-col border-2 rounded-2xl h-70 w-50 p-5">
            <div className="text-2xl text-center">{title}</div>
            <Link
                className="border-2 rounded-xl p-2 mt-5 hover:bg-white hover:text-black"
                href={`/pdf/${pdfId}`}
            >
                Go to File
            </Link>
            <button
                className="rounded-xl py-2 px-5 mt-5 bg-red-700 hover:bg-red-500"
                onClick={onDelete}
            >
                Delete
            </button>
        </span>
    );
};

export default PDFPreviewCard;
