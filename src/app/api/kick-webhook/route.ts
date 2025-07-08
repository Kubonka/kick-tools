// pages/api/kick-webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

const KICK_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq/+l1WnlRrGSolDMA+A8
6rAhMbQGmQ2SapVcGM3zq8ANXjnhDWocMqfWcTd95btDydITa10kDvHzw9WQOqp2
MZI7ZyrfzJuz5nhTPCiJwTwnEtWft7nV14BYRDHvlfqPUaZ+1KR4OCaO/wWIk/rQ
L/TjY0M70gse8rlBkbo2a8rKhu69RQTRsoaf4DVhDPEeSeI5jVrRDGAMGL3cGuyY
6CLKGdjVEM78g3JfYOvDU/RvfqD7L89TZ3iN94jrmWdGz34JNlEI5hqK8dd7C5EF
BEbZ5jgB8s8ReQV8H+MkuffjdAj3ajDDX3DOJMIut1lBrUVD1AaSrGCKHooWoL2e
twIDAQAB
-----END PUBLIC KEY-----`;

// async function fetchKickPublicKey(): Promise<string> {
//   const res = await fetch("https://api.kick.com/public/v1/public-key");
//   if (!res.ok) throw new Error("Error fetching Kick public key");

//   const data = await res.json();
//   return data.public_key as string;
//}

function verifySignature({
  rawBody,
  messageId,
  timestamp,
  signature,
  publicKeyPem,
}: {
  rawBody: Buffer;
  messageId: string;
  timestamp: string;
  signature: string;
  publicKeyPem: string;
}): boolean {
  const data = `${messageId}.${timestamp}.${rawBody.toString()}`;
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(data);
  verifier.end();

  const signatureBuffer = Buffer.from(signature, "base64");
  return verifier.verify(publicKeyPem, signatureBuffer);
}

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const rawBody = await buffer(req);

  const messageId = req.headers["kick-event-message-id"] as string;
  const timestamp = req.headers["kick-event-message-timestamp"] as string;
  const signature = req.headers["kick-event-signature"] as string;

  if (!messageId || !timestamp || !signature) {
    return res.status(400).json({ error: "Missing headers" });
  }

  const isValid = verifySignature({
    rawBody,
    messageId,
    timestamp,
    signature,
    publicKeyPem: KICK_PUBLIC_KEY,
  });

  if (!isValid) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const event = JSON.parse(rawBody.toString());
  console.log("[Kick Webhook] Evento recibido:", event);

  res.status(200).json({ success: true });
}
