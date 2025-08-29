"use client";
import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export let totalPages;

const PDFRenderer = ({ pdfId }) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [pageHeight, setPageHeight] = useState(0);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const res = await fetch(`/api/learning-tools/pdf/${pdfId}/retrieve`);

        const data = await res.json();

        const { source } = data.pdf;

        setPdfUrl(source);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPdfUrl();
  }, [pdfId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    totalPages = numPages;
  };

  const onPageRenderSuccess = (page) => {
    if (page.pageNumber === 1) {
      setPageHeight(page.height);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current && pageHeight) {
      const { scrollTop } = scrollContainerRef.current;
      const newPage = Math.floor(scrollTop / pageHeight) + 1;

      if (newPage !== currPage) {
        setCurrPage(newPage);
      }
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="overflow-y-auto h-[calc(100vh-5rem)] flex justify-center w-[75vw]"
    >
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from({ length: numPages }, (_, index) => (
          <Page
            key={index}
            pageNumber={index + 1}
            onRenderSuccess={onPageRenderSuccess}
            width={900}
          />
        ))}
      </Document>
      <div className="fixed left-2 top-22">
        pages: {currPage} of {numPages}
      </div>
    </div>
  );
};

export default PDFRenderer;
