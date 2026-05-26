"use client";
import React, { useState, useEffect } from "react";

const PDFRenderer = ({ pdfId }) => {
    const [pdfUrl, setPdfUrl] = useState("");

    useEffect(() => {
        const fetchPdfUrl = async () => {
            try {
                const res = await fetch(
                    `/api/learning-tools/pdf/${pdfId}/retrieve`,
                );
                const data = await res.json();
                setPdfUrl(data.pdf.source);
            } catch (error) {
                console.error("Failed to fetch PDF URL:", error);
            }
        };
        fetchPdfUrl();
    }, [pdfId]);

    if (!pdfUrl) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-5rem)] w-[75vw]">
                <div className="text-gray-500 animate-pulse">
                    Loading PDF Document...
                </div>
            </div>
        );
    }

    return (
        <div className="w-[75vw] h-[calc(100vh-5rem)] overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="PDF Preview"
            />
        </div>
    );
};

export default PDFRenderer;
