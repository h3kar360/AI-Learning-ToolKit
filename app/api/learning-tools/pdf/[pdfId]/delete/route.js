import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";
import { getVectorStore } from "@/lib/getVectorStore";

export async function DELETE(req, { params }) {
    try {
        await connectToDB();

        const { pineconeIndex } = await getVectorStore();

        const { pdfId } = await params;

        await PDF.findOneAndDelete({ _id: pdfId });

        await pineconeIndex.namespace("__default__").deleteMany({
            pdfId          
        });

        return Response.json({ message: "Successfully deleted PDF and its components." }, { status: 203 });
    } catch (error) {
        console.error(error);
        return Response.json({ error }, { status: 500 });
    }
}