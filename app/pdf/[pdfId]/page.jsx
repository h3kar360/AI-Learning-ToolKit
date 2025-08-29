import React from "react";
import ClientPDFWrapper from "@/components/ClientPDFWrapper";
import ChatPanel from "@/components/ChatPanel";
import FlashCardWrapper from "@/components/FlashCardWrapper";

const PDFViewPage = async ({ params }) => {
  const { pdfId } = await params;

  return (
    <section className="flex justify-between overflow-hidden">
      <ClientPDFWrapper pdfId={pdfId} />
      <section className="relative flex flex-col w-[25vw]">
        <div className="flex-1 overflow-auto">
          <FlashCardWrapper pdfId={pdfId} />
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatPanel pdfId={pdfId} />
        </div>
      </section>
    </section>
  );
};

export default PDFViewPage;
