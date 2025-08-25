import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore } from "@/lib/getVectorStore";
import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";
import { Document } from "@langchain/core/documents";
import { supabase } from "@/lib/initSupabase";

export async function POST(req) {
  try {
    await connectToDB();

    const { vectorStore } = await getVectorStore();
    const formData = await req.formData();

    const title = formData.get("title");
    const pdfFile = formData.get("pdf");

    if (!pdfFile) {
      return Response.json({ error }, { status: 400 });
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${Date.now()}-${title}.pdf`;

    const { error } = await supabase.storage
      .from("pdfs")
      .upload(fileName, buffer, {
        contentType: "application/pdf",
      });

    if (error) throw error;

    const { data } = supabase.storage.from("pdfs").getPublicUrl(fileName);
    const publicUrl = data.publicUrl;

    const loader = new PDFLoader(pdfFile);
    const docs = await loader.load();

    //splitting the pdf
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2000,
      chunkOverlap: 250,
    });

    const splits = await textSplitter.splitDocuments(docs);

    //formatting the data that'll be stored in mongodb
    const pdfData = {
      title,
      source: publicUrl,
      chunks: splits.map((split) => ({
        content: split.pageContent,
        pageNumber: split.metadata?.loc?.pageNumber,
      })),
      flashCards: [],
    };

    const newPdfData = new PDF(pdfData);

    let pdfId;

    //saving pdf data to mongodb
    await newPdfData
      .save()
      .then((pdf) => (pdfId = pdf._id.toString()))
      .catch((err) => console.error(err));

    const documents = splits.map(
      (split) =>
        new Document({
          pageContent: split.pageContent,
          metadata: {
            ...split.metadata,
            pdfId,
          },
        })
    );

    const ids = splits.map((_, i) => `${pdfId}_${i}`); // unique IDs per chunk

    //store vector embeddings to pinecone
    await vectorStore.addDocuments(documents, {
      ids,
    });

    return Response.json({ pdfId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
