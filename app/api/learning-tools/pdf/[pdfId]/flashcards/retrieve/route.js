import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";

export async function GET(req, { params }) {
    try {
        await connectToDB();

        const { pdfId } = await params;

        const pdf = await PDF.findById(pdfId).lean();

        if(!pdf) {
            return Response.json({ error: "PDF not found" }, { status: 404 });
        }
        
        return Response.json({ flashCards: pdf.flashCards.title }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error }, { status: 500 });
    }
}