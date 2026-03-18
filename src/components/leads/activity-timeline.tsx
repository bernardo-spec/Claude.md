"use client";

import { formatRelativeTime } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  ArrowRightLeft,
  Info,
} from "lucide-react";

type Activity = {
  id: string;
  lead_id: string;
  user_id: string;
  type: string;
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  profiles?: { id: string; full_name: string } | null;
};

const typeConfig: Record<string, { icon: typeof MessageSquare; label: string; color: string }> = {
  note: { icon: MessageSquare, label: "Nota", color: "text-blue-500" },
  call: { icon: Phone, label: "Ligação", color: "text-green-500" },
  email: { icon: Mail, label: "E-mail", color: "text-orange-500" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp", color: "text-emerald-500" },
  meeting: { icon: Calendar, label: "Reunião", color: "text-purple-500" },
  stage_change: { icon: ArrowRightLeft, label: "Mudança", color: "text-yellow-500" },
  system: { icon: Info, label: "Sistema", color: "text-gray-500" },
};

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhuma atividade registrada
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const config = typeConfig[activity.type] || typeConfig.system;
        const Icon = config.icon;

        return (
          <div key={activity.id} className="flex gap-3">
            <div className={`mt-0.5 ${config.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {config.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {activity.profiles?.full_name || "Sistema"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(activity.created_at)}
                </span>
              </div>
              <p className="text-sm">{activity.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
