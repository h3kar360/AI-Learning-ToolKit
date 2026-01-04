"use client";

import React, { useState, useEffect } from "react";
import SubmitPDF from "@/components/SubmitPDF";
import PDFPreviewCard from "@/components/PDFPreviewCard";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Home = () => {
    const [pdfs, setPdfs] = useState([]);

    useEffect(() => {
        const getPdfs = async () => {
            try {
                const res = await fetch(
                    `${baseUrl}/api/learning-tools/pdf/retrieve`
                );

                if (!res.ok) {
                    throw new Error(
                        `Fetch failed: ${res.status}, ${res.statusText}`
                    );
                }

                const { PDFs } = await res.json();

                setPdfs(PDFs);
            } catch (error) {
                console.error(error);
            }
        };

        getPdfs();
    }, []);

    const onDelete = async (id) => {
        try {
            await fetch(`${baseUrl}/api/learning-tools/pdf/${id}/delete`, {
                method: "DELETE",
            });

            setPdfs((prev) => prev.filter((pdf) => pdf._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="mx-10">
            <SubmitPDF />
            <div className="grid m-20 grid-cols-5">
                {pdfs.map((pdf) => (
                    <PDFPreviewCard
                        key={pdf._id}
                        title={pdf.title}
                        pdfId={pdf._id}
                        onDelete={() => onDelete(pdf._id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
