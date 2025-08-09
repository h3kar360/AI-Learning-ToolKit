import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";

export async function DELETE(req, { params }) {
    try {
        await connectToDB();

        const { pdfId, flashCardId } = await params;

        await PDF.updateOne(
            { _id: pdfId },
            { $pull: { flashCards: { _id: flashCardId } } }
        );

        return Response.json({ message: "Successfully deleted the flashcard." }, { status: 203 });

    } catch (error) {
        console.log(error);
        return Response.json({ error }, { stauts: 500 });
    }
} 