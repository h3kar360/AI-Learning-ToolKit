"use client";
import React from "react";
import { useRouter } from "next/navigation";

const SubmitPDF = () => {
  const router = useRouter();

  const upload = async (e) => {
    e.preventDefault();

    const formdata = new FormData(e.target);

    try {
      const res = await fetch("/api/learning-tools/pdf/store", {
        method: "POST",
        body: formdata,
      });

      const data = await res.json();

      router.push(`/pdf/${data.pdfId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center pt-10">
      <form
        className="flex flex-col border-2 gap-5 p-5 rounded-2xl"
        onSubmit={upload}
      >
        <h1 className="text-5xl">Upload PDF</h1>
        <input
          type="text"
          name="title"
          className="h-10 text-xl px-1 border-2 rounded-xl"
          placeholder="title"
        />
        <input
          type="file"
          name="pdf"
          className="border-2 px-3 py-5 rounded-2xl"
          accept="application/pdf"
          required
        />
        <button
          type="submit"
          className="rounded-2xl border-2 py-3 hover:bg-white hover:text-black"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitPDF;
