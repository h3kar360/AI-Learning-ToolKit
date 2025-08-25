"use client";
import dynamic from "next/dynamic";
import React from "react";

const PDFRenderer = dynamic(() => import("@/components/PDFRenderer"), {
  ssr: false,
});

const ClientPDFWrapper = ({ pdfId }) => {
  return <PDFRenderer pdfId={pdfId} />;
};

export default ClientPDFWrapper;
