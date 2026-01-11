import { Client } from "minio";

export const bucket = process.env.MINIO_BUCKET || "lemac-3dmodels";

export const minio = new Client({
  endPoint: process.env.MINIO_HOST || "127.0.0.1",
  port: Number(process.env.MINIO_PORT || 9000),
  useSSL: process.env.MINIO_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export async function ensureBucket() {
  const exists = await minio.bucketExists(bucket);
  if (!exists) await minio.makeBucket(bucket);
}