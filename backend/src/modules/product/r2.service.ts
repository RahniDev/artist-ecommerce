import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import * as fs from "fs";
import sharp from "sharp";

const bucket = process.env.R2_BUCKET_NAME!;
const publicUrl = process.env.R2_PUBLIC_URL!;

export const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

export async function uploadProductPhoto(photo: any) {

    const imageId = crypto.randomUUID();

    const originalBuffer = await fs.promises.readFile(photo.filepath);

    type ImageSize = "xs" | "sm" | "md" | "lg" | "xl";

    const imageSizes: { name: ImageSize; width: number }[] = [
        { name: "xs", width: 160 },
        { name: "sm", width: 320 },
        { name: "md", width: 640 },
        { name: "lg", width: 960 },
        { name: "xl", width: 1600 }
    ];

    const urls: Record<ImageSize, string> = {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
    };

    await Promise.all(

        imageSizes.map(async ({ name, width }) => {

            const key = `products/${imageId}-${name}.webp`;

            const buffer = await sharp(originalBuffer)
                .rotate()
                .resize({
                    width,
                    fit: "inside",
                    withoutEnlargement: true
                })
                .webp({
                    quality: 82,
                    effort: 6
                })
                .toBuffer();

            await r2.send(
                new PutObjectCommand({
                    Bucket: bucket,
                    Key: key,
                    Body: buffer,
                    ContentType: "image/webp",
                    CacheControl: "public,max-age=31536000,immutable"
                })
            );

            urls[name] = `${publicUrl}/${key}`;

        })
    );

    return {
        key: imageId,
        contentType: "image/webp",
        sizes: urls
    };
}

export async function deleteProductPhoto(imageId: string) {
    const sizes = ["xs", "sm", "md", "lg", "xl"];

    await Promise.all(
        sizes.map((size) =>
            r2.send(
                new DeleteObjectCommand({
                    Bucket: bucket,
                    Key: `products/${imageId}-${size}.webp`,
                })
            )
        )
    );
}