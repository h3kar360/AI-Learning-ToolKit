"use client";
import React, { useEffect, useState } from "react";
import FlashCardPreview from "./FlashCardPreview";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const ShowUserFlashCards = ({ pdfId }) => {
  const [flashCards, setFlashCards] = useState([]);

  useEffect(() => {
    const getFlashCardsList = async (pdfId) => {
      try {
        const res = await fetch(
          `${baseUrl}/api/learning-tools/pdf/${pdfId}/flashcards/retrieve`
        );

        if (!res.ok) {
          throw new Error("flashcards unable to retrieve");
        }

        const { flashCards } = await res.json();

        setFlashCards(flashCards);
      } catch (error) {
        console.error(error);
      }
    };

    getFlashCardsList(pdfId);
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-4">
      {flashCards.map((flashcard, i) => (
        <FlashCardPreview
          key={i}
          pdfId={pdfId}
          title={flashcard.title}
          flashCardId={flashcard._id}
        />
      ))}
    </div>
  );
};

export default ShowUserFlashCards;
