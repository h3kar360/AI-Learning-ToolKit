import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";

export async function GET() {
    try {
        await connectToDB();

        const allPdfs = await PDF.find({}).lean();

        return Response.json({ PDFs: allPdfs }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error }, { status: 500 });
    }
}