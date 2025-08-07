import mongoose from "mongoose";
import { FlashCards } from "@/mongoose/schemas/flashcards";

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        const flashcards = await FlashCards.findById(id);

        return Response.json({ flashcards }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error }, { status: 500 });
    }    
}