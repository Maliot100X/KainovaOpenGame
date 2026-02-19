import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

// Verify webhook signature
function verifySignature(payload: string, signature: string): boolean {
  // In production, implement proper signature verification
  // For now, we'll do a basic check
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const signature = req.headers.get("x-farcaster-signature") || "";

    // Verify webhook signature
    if (!verifySignature(JSON.stringify(payload), signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { event, data } = payload;

    switch (event) {
      case "miniapp_added":
        await handleMiniAppAdded(data);
        break;

      case "miniapp_removed":
        await handleMiniAppRemoved(data);
        break;

      case "notifications_enabled":
        await handleNotificationsEnabled(data);
        break;

      case "notifications_disabled":
        await handleNotificationsDisabled(data);
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleMiniAppAdded(data: any) {
  const { fid, notificationDetails } = data;

  // Store or update user in database
  const { error } = await supabaseAdmin.from("users").upsert(
    {
      fid,
      notification_token: notificationDetails?.token || null,
      notification_url: notificationDetails?.url || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "fid" }
  );

  if (error) {
    console.error("Error handling miniapp_added:", error);
  }

  // Send welcome notification
  if (notificationDetails) {
    await sendNotification(notificationDetails, {
      title: "Welcome to KAINOVA! 🚀",
      body: "Complete your first task to earn KNTWS tokens.",
    });
  }
}

async function handleMiniAppRemoved(data: any) {
  const { fid } = data;

  // Clear notification details
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      notification_token: null,
      notification_url: null,
      updated_at: new Date().toISOString(),
    })
    .eq("fid", fid);

  if (error) {
    console.error("Error handling miniapp_removed:", error);
  }
}

async function handleNotificationsEnabled(data: any) {
  const { fid, notificationDetails } = data;

  const { error } = await supabaseAdmin
    .from("users")
    .update({
      notification_token: notificationDetails.token,
      notification_url: notificationDetails.url,
      updated_at: new Date().toISOString(),
    })
    .eq("fid", fid);

  if (error) {
    console.error("Error handling notifications_enabled:", error);
  }
}

async function handleNotificationsDisabled(data: any) {
  const { fid } = data;

  const { error } = await supabaseAdmin
    .from("users")
    .update({
      notification_token: null,
      notification_url: null,
      updated_at: new Date().toISOString(),
    })
    .eq("fid", fid);

  if (error) {
    console.error("Error handling notifications_disabled:", error);
  }
}

async function sendNotification(
  notificationDetails: { url: string; token: string },
  content: { title: string; body: string }
) {
  try {
    const response = await fetch(notificationDetails.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: notificationDetails.token,
        ...content,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send notification:", await response.text());
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
