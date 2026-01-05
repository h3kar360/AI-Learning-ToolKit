import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";

export async function GET(req, { params }) {
    try {
        const userId = req.headers.get("x-user-id");

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();

        const { pdfId } = await params;

        const pdf = await PDF.findOne({ _id: pdfId, userId });

        return Response.json({ pdf }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error }, { status: 500 });
    }
}
