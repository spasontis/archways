import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AIAssistantBadge() {
  return (
    <Badge variant="secondary" className="gap-2 border-border/60 bg-secondary/50 px-3 py-1.5 font-medium">
      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
      AI-Powered
    </Badge>
  )
}
