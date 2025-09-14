import React from "react";
import Link from "next/link";
import FlashCardsCardWrapper from "@/components/FlashCardsCardWrapper";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const page = async ({ params }) => {
  const { pdfId, flashcardId } = await params;

  const getQuestionsAndAnswers = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/api/learning-tools/pdf/${pdfId}/flashcards/${flashcardId}/retrieve`
      );

      if (!res.ok) throw new Error("unable to get the flash card's contents");

      const { flashCardList } = await res.json();

      return flashCardList;
    } catch (error) {
      console.error(error);
    }
  };

  const flashCardList = await getQuestionsAndAnswers();

  return (
    <>
      <div className="w-full text-center text-2xl">{flashCardList.title}</div>
      <button className="rounded-2xl px-3 py-1 bg-gray-900 absolute z-10 top-22 left-2 hover:bg-white hover:text-black">
        <Link href={`/pdf/${pdfId}`}>back</Link>
      </button>
      <div className="flex h-[calc(100vh-10rem)] justify-center items-center">
        <FlashCardsCardWrapper flashCardList={flashCardList} />
      </div>
    </>
  );
};

export default page;
