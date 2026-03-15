import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const { image } = await req.json();

  try {
    const upload = await cloudinary.uploader.upload(image, {
      upload_preset: "hoodify",
      resource_type: "image",
    });

    return NextResponse.json({
      success: true,
      url: upload.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
