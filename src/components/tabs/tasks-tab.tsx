"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, 
  Bot, 
  Share2, 
  Star, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useMiniApp } from "@/lib/contexts/miniapp-context";
import { supabase, Task, UserTask } from "@/lib/supabase/client";

interface TaskWithStatus extends Task {
  userStatus: UserTask | null;
  canComplete: boolean;
  cooldownRemaining?: number;
}

type TaskCategory = "all" | "daily" | "agent" | "social" | "special";

const categoryIcons = {
  daily: Flame,
  agent: Bot,
  social: Share2,
  special: Star,
};

export function TasksTab() {
  const { user } = useMiniApp();
  const [activeCategory, setActiveCategory] = useState<TaskCategory>("all");
  const [tasks, setTasks] = useState<TaskWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState<string | null>(null);

  useEffect(() => {
    if (user.fid) {
      fetchTasks();
    }
  }, [user.fid]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all active tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("is_active", true)
        .or(`expires_at.is.null,expires_at.gte.${new Date().toISOString()}`);

      if (tasksError) throw tasksError;

      // Fetch user's task progress
      const { data: userTasksData, error: userTasksError } = await supabase
        .from("user_tasks")
        .select("*")
        .eq("user_fid", user.fid);

      if (userTasksError) throw userTasksError;

      // Merge task data with user progress
      const tasksWithStatus: TaskWithStatus[] = (tasksData || []).map((task) => {
        const userTask = userTasksData?.find((ut) => ut.task_id === task.id);
        
        let canComplete = true;
        let cooldownRemaining = 0;

        if (userTask) {
          if (task.max_completions && userTask.status === "claimed") {
            const completionCount = userTasksData.filter(
              (ut) => ut.task_id === task.id && ut.status === "claimed"
            ).length;
            canComplete = completionCount < task.max_completions;
          }

          if (task.cooldown_hours && userTask.completed_at) {
            const completedAt = new Date(userTask.completed_at);
            const cooldownEnd = new Date(completedAt.getTime() + task.cooldown_hours * 60 * 60 * 1000);
            const now = new Date();
            
            if (now < cooldownEnd) {
              canComplete = false;
              cooldownRemaining = Math.ceil((cooldownEnd.getTime() - now.getTime()) / (1000 * 60 * 60));
            }
          }
        }

        return {
          ...task,
          userStatus: userTask || null,
          canComplete,
          cooldownRemaining,
        };
      });

      setTasks(tasksWithStatus);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!user.fid || completingTask) return;

    setCompletingTask(taskId);
    try {
      const response = await fetch("/api/tasks/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid: user.fid, taskId }),
      });

      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setCompletingTask(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeCategory === "all") return true;
    return task.type === activeCategory;
  });

  const categories: { id: TaskCategory; label: string }[] = [
    { id: "all", label: "All" },
    { id: "daily", label: "Daily" },
    { id: "agent", label: "Agent" },
    { id: "social", label: "Social" },
    { id: "special", label: "Special" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-kainova-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-panel p-4 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-1">Available Tasks</h2>
        <p className="text-sm text-gray-400">
          Complete tasks to earn KNTWS tokens and climb the leaderboard
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-kainova-accent text-black"
                : "bg-kainova-grid/50 text-gray-400 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => {
            const Icon = categoryIcons[task.type as keyof typeof categoryIcons] || Star;
            const isCompleted = task.userStatus?.status === "claimed";
            const isPending = task.userStatus?.status === "completed";

            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-panel p-4 rounded-2xl transition-all ${
                  isCompleted ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? "bg-green-500/20"
                      : "bg-kainova-accent/20"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <Icon className="w-6 h-6 text-kainova-accent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-white text-sm">{task.title}</h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-kainova-accent flex-shrink-0">
                        +{task.kntws_reward}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="mt-3">
                      {isCompleted ? (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </span>
                      ) : isPending ? (
                        <span className="text-xs text-yellow-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending verification
                        </span>
                      ) : !task.canComplete && task.cooldownRemaining ? (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Available in {task.cooldownRemaining}h
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={completingTask === task.id}
                          className="w-full py-2 bg-kainova-accent/20 hover:bg-kainova-accent/30 text-kainova-accent rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1"
                        >
                          {completingTask === task.id ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Complete Task
                              <ChevronRight className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <div className="text-center py-10">
            <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No tasks available in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
