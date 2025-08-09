import { Ollama } from "@langchain/ollama";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { connectToDB } from "@/lib/mongodbConnect";
import { PDF } from "@/mongoose/schemas/pdf";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req, { params }) {
    try {
        await connectToDB();

        const { pdfId } = await params;
        const { title, pages } = await req.json();

        
        const { chunks } = await PDF.findById(pdfId);
        
        let selectedChunks = [];
        pages.forEach(page => {
            selectedChunks.push(...chunks.filter(chunk => chunk.pageNumber === page));
        });
        
        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash",
            maxOutputTokens: 2048,
            apiKey: process.env.GOOGLE_API_KEY
        });

        // const llm = new Ollama({
        //     model: "gemma3:4b",
        //     baseUrl: "http://localhost:11434"
        // });

        const arrayResults = await Promise.all(
            selectedChunks.map(async chunk => {
                const prompt = `You are an expert flashcard generator for students.

                                Your task is to generate highly effective flashcards from the context provided. Focus only on core educational value. Avoid creating cards for trivial or repetitive information.

                                Each flashcard must test understanding of a *key concept*, definition, or relationship. Group similar ideas into a single card when logical.

                                Use **clear, complete, and unambiguous** language. Avoid cards that are overly broad, vague, or contain only single words.

                                #Format (Strict):
                                Question@Answer$

                                Do NOT include newlines. All cards must be in a single line like this:
                                Question@Answer$Question@Answer$...

                                #Rules:
                                - Only output flashcards. No extra explanation or notes.
                                - No numbering.
                                - No line breaks.
                                - Avoid duplicate or near-identical questions.
                                - Avoid low-value facts (like class material requirements or prep time).
                                - Use the original terminology from the text if relevant.
                                - Ensure **each question has one complete, direct answer**.
                                - Do not respond e.g. Question: what is..., rather directly give the question. What is...@It is...$

                                Context:
                                ${chunk}

                                Flashcards:`;

                const res = await llm.invoke(prompt);

                return res.content.trim();
            })
        );  
        
        //transforming the llm string into an array of question and answer objects
        const results = arrayResults.join("");
       
        //splitting flashcards into objects
        const flashCardList = results.split("$")
            .filter(Boolean)
            .map(qna => {
                const [question, answer] = qna.split("@");
                return { question, answer };
            });

        const filteredFlashCardList = flashCardList.filter(flashCard => flashCard.question !== null && flashCard.answer !== null);
        
        const flashCardData = {
            title,
            flashCards: filteredFlashCardList
        }

        await PDF.updateOne(
            { _id: pdfId },
            { $push: { flashCards: flashCardData }},
            { new: true }
        );

        return Response.json({ message: "successfully created a flashcard" }, { stuats: 201 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: error }, { status: 500 });
    }
} 