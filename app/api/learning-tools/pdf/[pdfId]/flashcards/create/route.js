//import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { Ollama } from "@langchain/ollama"; // optional local LLM
import { GoogleGenAI } from "@google/genai";
import { connectToDB } from "@/lib/mongodbConnect";
import { PDF } from "@/mongoose/schemas/pdf";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req, { params }) {
    try {
        await connectToDB();

        const { pdfId } = await params;
        const { title, pages } = await req.json();

        // Flatten page ranges
        const completePages = pages.flatMap((chunk) => {
            if (chunk.includes("-")) {
                const [start, end] = chunk.split("-").map(Number);
                return Array.from(
                    { length: end - start + 1 },
                    (_, i) => start + i,
                );
            }
            return [Number(chunk)];
        });

        const pdfDoc = await PDF.findById(pdfId);
        if (!pdfDoc) throw new Error("PDF not found");
        const { chunks } = pdfDoc;

        // Select chunks for requested pages
        const selectedChunks = [];
        completePages.forEach((page) => {
            selectedChunks.push(
                ...chunks.filter((chunk) => chunk.pageNumber === page),
            );
        });

        // Initialize LLM
        // const llm = new ChatGoogleGenerativeAI({
        //     model: "gemini-1.5-flash",
        //     maxOutputTokens: 8192,
        //     apiKey: process.env.GOOGLE_API_KEY,
        //     maxRetries: 1,
        // });

        // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        // const model = genAI.getGenerativeModel({
        //     model: "gemini-3-flash-preview",
        //     generationConfig: { maxOutputTokens: 2048 },
        // });

        // const llm = new Ollama({
        //   model: "gemma3:4b",
        //   baseUrl: "http://localhost:11434"
        // });

        let batch = selectedChunks.map((c) => c.content).join(" ");

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
${batch}

Flashcards:`;

        // const res = await llm.invoke([
        //     {
        //         type: "human",
        //         content: prompt,
        //     },
        // ]);

        // if (!res || !res.content) throw new Error("No response from Gemini");

        const res = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
        });

        //const result = await model.generateContent(prompt);
        const response = res.text;

        const results = response.trim();

        // Split flashcards into objects
        const flashCardList = results
            .split("$")
            .filter(Boolean)
            .map((qna) => {
                const [question, answer] = qna.split("@");
                return { question: question?.trim(), answer: answer?.trim() };
            });

        const filteredFlashCardList = flashCardList.filter(
            (flashCard) =>
                flashCard.question !== null && flashCard.answer !== null,
        );

        const flashCardData = {
            title,
            flashCards: filteredFlashCardList,
        };

        const updatedPdf = await PDF.findOneAndUpdate(
            { _id: pdfId },
            { $push: { flashCards: flashCardData } },
            { new: true },
        );

        const flashCardId =
            updatedPdf.flashCards[updatedPdf.flashCards.length - 1]._id;

        return Response.json(
            { message: "successfully created a flashcard", flashCardId },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        if (error.cause) console.error("cause: " + error.cause);
        return Response.json({ error: error }, { status: 500 });
    }
}
