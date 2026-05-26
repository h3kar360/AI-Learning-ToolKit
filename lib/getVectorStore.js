import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

export async function getVectorStore() {
    try {
        const apiKey = process.env.PINECONE_API_KEY;
        const indexName = process.env.PINECONE_INDEX;
        const geminiKey = process.env.GEMINI_API_KEY;

        const pinecone = new PineconeClient({ apiKey });
        const pineconeIndex = pinecone.Index(indexName);

        const embeddings = new GoogleGenerativeAIEmbeddings({
            model: "gemini-embedding-001",
            apiKey: geminiKey,
        });

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            maxConcurrency: 5,
            textKey: "pageContent",
        });

        return { vectorStore, pineconeIndex };
    } catch (error) {
        console.error("VECTOR STORE INIT ERROR:", error);
        throw error;
    }
}
