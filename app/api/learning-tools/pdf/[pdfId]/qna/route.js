import { getVectorStore } from "@/lib/getVectorStore";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
// import { Ollama } from "@langchain/ollama";

export async function POST(req, { params }) {
    try {
        const userId = req.headers.get("x-verified-user-id");

        const { pdfId } = await params;
        const { question } = await req.json();

        const { vectorStore } = await getVectorStore();

        const retriever = vectorStore.asRetriever({
            k: 4,
            filter: { pdfId, userId },
        });

        const retrievedDocs = await retriever.invoke(question);

        if (!retrievedDocs || retrievedDocs.length === 0) {
            return Response.json(
                { results: "No relevant context found." },
                { status: 200 },
            );
        }

        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `You are an assistant for question-answering tasks. 
Use the following pieces of retrieved context to answer the question. 
If you don't know the answer, just say that you don't know.
Use three sentences maximum and keep the answer concise.
`,
            ],
            ["human", "Question: {question}\n\nContext:\n{context}"],
        ]);

        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            maxOutputTokens: 2048,
            apiKey: process.env.GEMINI_API_KEY,
        });

        //         // const llm = new Ollama({
        //         //   model: "gemma3:4b",
        //         //   baseUrl: "http://localhost:11434"
        //         // });

        const ragChain = await createStuffDocumentsChain({
            llm,
            prompt,
            outputParser: new StringOutputParser(),
        });

        const results = await ragChain.invoke({
            question,
            context: retrievedDocs,
        });

        return Response.json({ results }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error }, { status: 500 });
    }
}
