import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const { fid, taskId } = await req.json();

    if (!fid || !taskId) {
      return NextResponse.json(
        { error: "FID and taskId are required" },
        { status: 400 }
      );
    }

    // Get task details
    const { data: task, error: taskError } = await supabaseAdmin
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .eq("is_active", true)
      .single();

    if (taskError || !task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check if user already has this task in progress or completed
    const { data: existingTask, error: existingError } = await supabaseAdmin
      .from("user_tasks")
      .select("*")
      .eq("user_fid", fid)
      .eq("task_id", taskId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Check cooldown if task was previously completed
    if (existingTask?.completed_at && task.cooldown_hours) {
      const completedAt = new Date(existingTask.completed_at);
      const cooldownEnd = new Date(
        completedAt.getTime() + task.cooldown_hours * 60 * 60 * 1000
      );
      const now = new Date();

      if (now < cooldownEnd) {
        const hoursRemaining = Math.ceil(
          (cooldownEnd.getTime() - now.getTime()) / (1000 * 60 * 60)
        );
        return NextResponse.json(
          { error: `Task on cooldown. Available in ${hoursRemaining}h` },
          { status: 400 }
        );
      }
    }

    // Check max completions
    if (task.max_completions) {
      const { count, error: countError } = await supabaseAdmin
        .from("user_tasks")
        .select("*", { count: "exact" })
        .eq("user_fid", fid)
        .eq("task_id", taskId)
        .eq("status", "claimed");

      if (countError) throw countError;

      if (count && count >= task.max_completions) {
        return NextResponse.json(
          { error: "Maximum completions reached for this task" },
          { status: 400 }
        );
      }
    }

    // Create or update user task
    const now = new Date().toISOString();
    
    if (existingTask && existingTask.status === "pending") {
      // Update existing pending task
      const { error: updateError } = await supabaseAdmin
        .from("user_tasks")
        .update({
          status: "completed",
          completed_at: now,
          updated_at: now,
        })
        .eq("id", existingTask.id);

      if (updateError) throw updateError;
    } else {
      // Create new user task
      const { error: insertError } = await supabaseAdmin.from("user_tasks").insert({
        user_fid: fid,
        task_id: taskId,
        status: "completed",
        completed_at: now,
        created_at: now,
      });

      if (insertError) throw insertError;
    }

    // Award points and tokens immediately
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("total_points, kntws_balance, tasks_completed")
      .eq("fid", fid)
      .single();

    if (userError) throw userError;

    const { error: updateUserError } = await supabaseAdmin
      .from("users")
      .update({
        total_points: (user.total_points || 0) + task.points_reward,
        kntws_balance: (user.kntws_balance || 0) + task.kntws_reward,
        tasks_completed: (user.tasks_completed || 0) + 1,
        updated_at: now,
      })
      .eq("fid", fid);

    if (updateUserError) throw updateUserError;

    return NextResponse.json({
      success: true,
      message: "Task completed!",
      rewards: {
        kntws: task.kntws_reward,
        points: task.points_reward,
      },
    });
  } catch (error) {
    console.error("Task completion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
