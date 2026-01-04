import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";

export async function GET(req) {
    try {
        const userId = req.headers.get("x-user-id");

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDB();

        const allPdfs = await PDF.find({ userId }).lean();

        return Response.json({ PDFs: allPdfs }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error }, { status: 500 });
    }
}
