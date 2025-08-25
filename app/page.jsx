import React from "react";
import SubmitPDF from "@/components/SubmitPDF";
import PDFPreviewCard from "@/components/PDFPreviewCard";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getPdfs = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/learning-tools/pdf/retrieve`);

    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status}, ${res.statusText}`);
    }

    const { PDFs } = await res.json();

    return PDFs;
  } catch (error) {
    console.error(error);
  }
};

const Home = async () => {
  try {
    const pdfs = await getPdfs();

    return (
      <div className="mx-10">
        <SubmitPDF />
        <div className="grid m-20 grid-cols-5">
          {pdfs.map((pdf) => (
            <PDFPreviewCard key={pdf._id} title={pdf.title} pdfId={pdf._id} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
  }
};

export default Home;
