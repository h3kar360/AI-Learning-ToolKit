import React from "react";
import Link from "next/link";
import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";
import FlashCardsCardWrapper from "@/components/FlashCardsCardWrapper";

const page = async ({ params }) => {
    const { pdfId, flashcardId } = await params;

    await connectToDB();
    const pdf = await PDF.findById(pdfId).lean();

    if (!pdf) {
        return (
            <div className="text-center mt-10 text-red-500">PDF not found</div>
        );
    }

    const flashCardList = pdf.flashCards?.find(
        (flashCard) => flashCard._id.toString() === flashcardId,
    );

    if (!flashCardList) {
        return (
            <div className="text-center mt-10 text-red-500">
                Flashcard set not found
            </div>
        );
    }

    return (
        <>
            <div className="w-full text-center text-2xl">
                {flashCardList.title}
            </div>
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
