"use client";
import React from "react";
import PDFRenderer from "./PDFRenderer";

const ClientPDFWrapper = ({ pdfId }) => {
    return <PDFRenderer pdfId={pdfId} />;
};

export default ClientPDFWrapper;
