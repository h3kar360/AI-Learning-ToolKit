import mongoose from "mongoose";

const FlashCardsSchema = new mongoose.Schema({
    title: { type: String, default: "Untitled" },
    flashCards: [
        {
            question: String,
            answer: String
        }
    ]
});

const PDFSchema = new mongoose.Schema({
    title: { type: String, default: "Untitled" },
    source: { type: String, required: true },
    chunks: [
        {
            content: String,
            pageNumber: Number
        }
    ],
    flashCards: [FlashCardsSchema]
});

export const PDF = mongoose.models.PDF || mongoose.model("PDF", PDFSchema);
