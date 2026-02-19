import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";
import { REWARD_TIERS } from "@/lib/contracts/kntws";

export async function POST(req: NextRequest) {
  try {
    const { fid, tier } = await req.json();

    if (!fid || !tier) {
      return NextResponse.json(
        { error: "FID and tier are required" },
        { status: 400 }
      );
    }

    const tierData = REWARD_TIERS[tier as keyof typeof REWARD_TIERS];
    if (!tierData) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    // Get user balance
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("kntws_balance")
      .eq("fid", fid)
      .single();

    if (userError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has enough balance
    if (user.kntws_balance < tierData.cost) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Start transaction
    const now = new Date().toISOString();

    // Deduct KNTWS
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        kntws_balance: user.kntws_balance - tierData.cost,
        updated_at: now,
      })
      .eq("fid", fid);

    if (updateError) throw updateError;

    // Create redemption record
    const { data: redemption, error: redemptionError } = await supabaseAdmin
      .from("redemptions")
      .insert({
        user_fid: fid,
        tier,
        kntws_cost: tierData.cost,
        reward_type: `${tier}_tier_reward`,
        reward_data: {
          multiplier: tierData.multiplier,
          duration_hours: 24,
          badge: tierData.name,
        },
        redeemed_at: now,
        status: "completed",
      })
      .select()
      .single();

    if (redemptionError) throw redemptionError;

    // Update user's active multiplier
    const multiplierExpiry = new Date();
    multiplierExpiry.setHours(multiplierExpiry.getHours() + 24);

    await supabaseAdmin
      .from("users")
      .update({
        active_multiplier: tierData.multiplier,
        multiplier_expires_at: multiplierExpiry.toISOString(),
        rank_title: tierData.name,
        updated_at: now,
      })
      .eq("fid", fid);

    return NextResponse.json({
      success: true,
      message: `Successfully redeemed ${tierData.name} reward!`,
      redemption: {
        id: redemption.id,
        tier,
        cost: tierData.cost,
        multiplier: tierData.multiplier,
        expiresAt: multiplierExpiry.toISOString(),
      },
    });
  } catch (error) {
    console.error("Redemption error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
