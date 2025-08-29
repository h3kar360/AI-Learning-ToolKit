"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AddFlashCard from "./AddFlashCard";
import { totalPages } from "./PDFRenderer";
import ShowUserFlashCards from "./ShowUserFlashCards";

const FlashCardWrapper = ({ pdfId }) => {
  const [startCreating, setStartCreating] = useState(false);
  const [title, setTitle] = useState("Untitled");
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const router = useRouter();

  const createFlashCard = async (e) => {
    e.preventDefault();

    //validation
    const formatPages = pages.replace(/\s/g, "");
    const splitPages = formatPages.split(",");

    const splitDashes = splitPages.flatMap((pages) => pages.split("-"));

    if (Math.max(...splitDashes) > totalPages) {
      alert("page out of range!");
      e.preventDefault;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${baseUrl}/api/learning-tools/pdf/${pdfId}/flashcards/create`,
        {
          method: "POST",
          body: JSON.stringify({ title, pages: splitPages }),
        }
      );

      if (!res.ok) throw new Error("unable to create flashcard");

      const { flashCardId } = await res.json();

      router.push(`/pdf/${pdfId}/flashcard/${flashCardId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setStartCreating(false);
    }
  };

  return (
    <section className="p-2">
      <AddFlashCard
        startCreating={startCreating}
        setStartCreating={setStartCreating}
      />
      {startCreating ? (
        <section className="mt-6">
          <form onSubmit={createFlashCard} className="flex flex-col gap-4">
            <div className="flex">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                className="flex-1 border-2 rounded-[0.5rem] ml-2 pl-1"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Untitled"
              />
            </div>
            <div className="flex">
              <label htmlFor="pages">Pages</label>
              <input
                type="text"
                name="pages"
                className="flex-1 border-2 rounded-[0.5rem] ml-2 pl-1"
                onChange={(e) => setPages(e.target.value)}
                placeholder="e.g. 1-5, 7, 8..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl py-1 border-2 hover:bg-white hover:text-black"
            >
              create
            </button>
          </form>
        </section>
      ) : (
        ""
      )}
      <ShowUserFlashCards pdfId={pdfId} />
    </section>
  );
};

export default FlashCardWrapper;
