import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore } from "@/lib/getVectorStore";
import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";
import  { Document } from "@langchain/core/documents";

export async function POST(req) {
    try {     
        await connectToDB();

        const { title, source } = await req.json();

        const vectorStore = await getVectorStore();

        const loader = new PDFLoader(source);
        const docs = await loader.load();

        //splitting the pdf
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 2000,
            chunkOverlap: 250
        });

        const splits = await textSplitter.splitDocuments(docs);
               
        //formatting the data that'll be stored in mongodb
        const pdfData = {
            title,
            source: splits[0].metadata.source,
            chunks: splits.map(split => ({ content: split.pageContent, pageNumber: split.metadata?.loc?.pageNumber })),
            flashCards: []
        };   
        
        const newPdfData = new PDF(pdfData);

        let pdfId;

        //saving pdf data to mongodb
        await newPdfData.save()
            .then(pdf => pdfId = pdf._id.toString())
            .catch(err => console.error(err));
                
        const documents = splits.map(split => 
            new Document({
                pageContent: split.pageContent,
                metadata: {
                    ...split.metadata,
                    pdfId
                }
            })
        );

        const ids = splits.map((_, i) => `${pdfId}_${i}`); // unique IDs per chunk

        //store vector embeddings to pinecone
        await vectorStore.addDocuments(documents, {
            ids
        });

        return Response.json({ pdfId }, { status: 201 });
        
    } catch (error) {
        console.error(error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}