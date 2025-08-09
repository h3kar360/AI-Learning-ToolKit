import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

export async function getVectorStore() {
    try {
        const pinecone = new PineconeClient();
        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

        const embeddings = new TogetherAIEmbeddings({
            model: "BAAI/bge-base-en-v1.5",
            apiKey: process.env.TOGETHER_AI_API_KEY
        });

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            maxConcurrency: 5
        });

        return { vectorStore, pineconeIndex };
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}