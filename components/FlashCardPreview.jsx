import React from "react";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const FlashCardPreview = ({ pdfId, title, flashCardId }) => {
  const delBtn = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/learning-tools/pdf/${pdfId}/flashcards/${flashCardId}/delete`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("unable to delete flash card");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between items-center bg-gray-600 w-full rounded-2xl py-2 px-2">
      <Link href={`/pdf/${pdfId}/flashcard/${flashCardId}`}>
        <div>{title}</div>
      </Link>
      <div className="text-gray-900 cursor-pointer" onClick={delBtn}>
        x
      </div>
    </div>
  );
};

export default FlashCardPreview;
