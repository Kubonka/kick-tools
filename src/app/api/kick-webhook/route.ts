//import { buffer } from "stream/consumers"; // Usamos node:stream
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

export async function POST(req: Request): Promise<Response> {
  const messageId = req.headers.get("kick-event-message-id");
  const timestamp = req.headers.get("kick-event-message-timestamp");
  const signature = req.headers.get("kick-event-signature");

  if (!messageId || !timestamp || !signature) {
    return new Response(JSON.stringify({ error: "Missing headers" }), {
      status: 400,
    });
  }

  const rawBody = Buffer.from(await req.arrayBuffer());

  const isValid = verifySignature({
    rawBody,
    messageId,
    timestamp,
    signature,
    publicKeyPem: KICK_PUBLIC_KEY,
  });

  if (!isValid) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 401,
    });
  }

  const event = JSON.parse(rawBody.toString());
  console.log("[Kick Webhook] Evento recibido:", event);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
