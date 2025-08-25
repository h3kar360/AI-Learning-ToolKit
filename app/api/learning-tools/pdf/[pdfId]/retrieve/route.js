import { PDF } from "@/mongoose/schemas/pdf";
import { connectToDB } from "@/lib/mongodbConnect";

export async function GET(req, { params }) {
  try {
    await connectToDB();

    const { pdfId } = await params;

    const pdf = await PDF.findById(pdfId);

    return Response.json({ pdf }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
