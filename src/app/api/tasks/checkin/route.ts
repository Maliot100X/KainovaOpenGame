import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const { fid } = await req.json();

    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 });
    }

    // Check if user already checked in today
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("last_checkin, streak_count, kntws_balance")
      .eq("fid", fid)
      .single();

    if (userError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const lastCheckin = user.last_checkin ? new Date(user.last_checkin) : null;
    
    // Check if already checked in today
    if (lastCheckin) {
      const lastCheckinDate = new Date(lastCheckin);
      lastCheckinDate.setHours(0, 0, 0, 0);
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      if (lastCheckinDate.getTime() === today.getTime()) {
        return NextResponse.json(
          { error: "Already checked in today" },
          { status: 400 }
        );
      }
    }

    // Calculate new streak
    let newStreak = 1;
    if (lastCheckin) {
      const diffDays = Math.floor(
        (now.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diffDays === 1) {
        newStreak = (user.streak_count || 0) + 1;
      }
    }

    // Streak bonus
    const baseReward = 10;
    const streakBonus = Math.min(newStreak * 2, 50); // Max 50 bonus
    const totalReward = baseReward + streakBonus;

    // Update user
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({
        kntws_balance: (user.kntws_balance || 0) + totalReward,
        streak_count: newStreak,
        last_checkin: now.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq("fid", fid);

    if (updateError) {
      throw updateError;
    }

    // Log the check-in
    await supabaseAdmin.from("checkins").insert({
      user_fid: fid,
      streak_count: newStreak,
      reward: totalReward,
      created_at: now.toISOString(),
    });

    return NextResponse.json({
      success: true,
      reward: totalReward,
      newStreak,
      message: `Checked in! +${totalReward} KNTWS`,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
