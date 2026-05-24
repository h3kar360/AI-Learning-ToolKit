import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

export async function getVectorStore() {
    try {
        const pinecone = new PineconeClient({
            apiKey: process.env.PINECONE_API_KEY,
        });

        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

        const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: "gemini-embedding-001",
            apiKey: process.env.GEMINI_API_KEY,
        });

        const vectorStore = new PineconeStore(embeddings, {
            pineconeIndex,
            maxConcurrency: 5,
        });

        // const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        //     pineconeIndex,
        //     maxConcurrency: 5
        // });

        return { vectorStore, pineconeIndex };
    } catch (error) {
        console.error(error);
        throw error;
    }
}
