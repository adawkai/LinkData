import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

function requiredEnv(name: string): string {
  const v = (import.meta as any).env?.[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function makeClient() {
  const endpoint = requiredEnv("VITE_S3_ENDPOINT");
  const region = (import.meta as any).env?.VITE_S3_REGION ?? "us-east-1";
  const accessKeyId = (import.meta as any).env?.VITE_S3_ACCESS_KEY_ID ?? "test";
  const secretAccessKey =
    (import.meta as any).env?.VITE_S3_SECRET_ACCESS_KEY ?? "test";

  return new S3Client({
    region,
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

function guessExt(file: File) {
  const parts = file.name.split(".");
  const ext = parts.length > 1 ? parts[parts.length - 1] : "";
  return ext ? ext.toLowerCase() : "bin";
}

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return uuidv4();
}

export async function uploadAvatar(params: {
  userId: string;
  file: File;
}): Promise<{ key: string; url: string }> {
  const bucket = requiredEnv("VITE_S3_BUCKET");
  const publicBase = requiredEnv("VITE_S3_PUBLIC_BASE_URL");
  const client = makeClient();

  const ext = guessExt(params.file);
  const key = `avatars/${params.userId}/${randomId()}.${ext}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: params.file,
      ContentType: params.file.type || undefined,
      ACL: "public-read",
    }),
  );

  const url = `${publicBase.replace(/\/$/, "")}/${bucket}/${key}`;
  return { key, url };
}

