import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import path from "path";
import * as fs from "fs";

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

import sharp from "sharp";

export async function uploadProductPhoto(photo: any) {
  const key = `products/${crypto.randomUUID()}.webp`;

  const originalBuffer = await fs.promises.readFile(photo.filepath);

  const optimizedBuffer = await sharp(originalBuffer)
    .resize({
      width: 1600,
      withoutEnlargement: true,
    })
    .webp({
      quality: 100,
    })
    .toBuffer();

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: optimizedBuffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    key,
    url: `${publicUrl}/${key}`,
    contentType: "image/webp",
  };
}

export async function deleteProductPhoto(key: string) {
  await r2.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  }));
}