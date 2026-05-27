import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";

export async function DELETE(req, { params }) {
    try {
        const userId = req.headers.get("x-verified-user-id");

        await connectToDB();

        const { pdfId, flashCardId } = await params;

        await PDF.updateOne(
            { _id: pdfId, userId },
            { $pull: { flashCards: { _id: flashCardId } } },
        );

        return Response.json(
            { message: "Successfully deleted the flashcard." },
            { status: 203 },
        );
    } catch (error) {
        console.log(error);
        return Response.json({ error }, { stauts: 500 });
    }
}
