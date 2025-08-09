import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";

export async function DELETE(req, { params }) {
    try {
        await connectToDB();

        const { pdfId } = await params;

        await PDF.updateOne(
            { _id: pdfId },
            { $set: { flashCards: [] } }                
        );

        return Response.json({ message: "Successfully deleted all flashcards." }, { status: 203 });
    } catch (error) {
        console.error(error);
        return Response.json({ error }, { status: 500 });
    }
}