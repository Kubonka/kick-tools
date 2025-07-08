import { NextResponse } from "next/server";
import axios from "axios";

export async function POST() {
  //! rtmps://fa723fc1b171.global-contribute.live-video.net -> STREAM URL
  try {
    const KICK_CLIENT_ID = process.env.KICK_CLIENT_ID!;
    const KICK_CLIENT_SECRET = process.env.KICK_CLIENT_SECRET!;
    const BROADCASTER_ID =
      "sk_us-west-2_XhWRlZLqE3Fw_2b30GaDhISb93EO3U6ixgIlxn6GB0K"; // o hacelo dinámico
    const WEBHOOK_URL = "https://kick-tools.vercel.app/api/kick-webhook";

    // Obtener token
    console.log("token request");
    const tokenRes = await axios.post("https://kick.com/oauth2/token", {
      client_id: KICK_CLIENT_ID,
      client_secret: KICK_CLIENT_SECRET,
      grant_type: "client_credentials",
    });
    const accessToken = tokenRes.data.access_token;
    console.log("token ", accessToken);

    // Registrar el webhook
    const registerRes = await axios.post(
      "https://api.kick.com/v1/event-subscriptions",
      {
        event_type: "chat.message.sent",
        version: "1",
        condition: {
          broadcaster_user_id: BROADCASTER_ID,
        },
        transport: {
          method: "webhook",
          callback: WEBHOOK_URL,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, data: registerRes.data });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("[Kick Webhook Error]", err.response?.data || err.message);
      return NextResponse.json(
        { success: false, error: err.response?.data || err.message },
        { status: 500 }
      );
    }
    console.error("[Kick Webhook Error]", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
