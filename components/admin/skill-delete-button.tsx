"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteSkill } from "@/lib/actions/skills";

interface SkillDeleteButtonProps {
  id: string;
}

export function SkillDeleteButton({ id }: SkillDeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      startTransition(async () => {
        const result = await deleteSkill(id);
        if (!result.success) {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 transition-colors hover:bg-red-500/15 focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
      title="Delete skill"
      type="button"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
