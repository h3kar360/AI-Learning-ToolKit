import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";
import { getVectorStore } from "@/lib/getVectorStore";
import { supabase } from "@/lib/supabaseClient";

export async function DELETE(req, { params }) {
    try {
        const userId = req.headers.get("x-verified-user-id");

        await connectToDB();

        const { pineconeIndex } = await getVectorStore();

        const { pdfId } = await params;

        //get pdf url
        const { source } = await PDF.findById(pdfId);

        const fileName = source.split("/object/public/pdfs/")[1];
        const formattedFileName = fileName.split("%20").join(" ");

        //delete in MongoDB
        await PDF.findOneAndDelete({ _id: pdfId, userId });

        //delete chunks in Pinecone
        await pineconeIndex.namespace("__default__").deleteMany({
            pdfId,
            userId,
        });

        //delete pdf in Supabase
        const { data, error } = await supabase.storage
            .from("pdfs")
            .remove([formattedFileName]);

        if (error) throw error;

        return Response.json(
            {
                message: "Successfully deleted PDF and its components.",
            },
            { status: 203 },
        );
    } catch (error) {
        console.error(error);
        return Response.json({ error }, { status: 500 });
    }
}
