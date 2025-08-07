import mongoose from "mongoose";

const FlashCardList = new mongoose.Schema({
    question: { type: String, require: true },
    answer: { type: String, require: true }
});

const FlashCardsSchema = new mongoose.Schema({
    title: { type: String, default: "Untitled" },
    flashCards: [FlashCardList]
});

const ChunkSchema = new mongoose.Schema({
    content: String,
    pageNumber: Number
})

const PDFSchema = new mongoose.Schema({
    title: { type: String, default: "Untitled" },
    source: { type: String, required: true },
    chunks: [ChunkSchema],
    flashCards: [FlashCardsSchema]
});

export const PDF = mongoose.models.PDF || mongoose.model("PDF", PDFSchema);
