import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Send, Lightbulb, AlertTriangle, TrendingUp } from "lucide-react"

export function AiAssistantPanel() {
  return (
    <aside className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="flex h-10 items-center gap-2 border-b border-border px-4">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">AI Assistant</span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Welcome message */}
        <Card className="mb-6 border-border bg-secondary/30">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-foreground" />
              <span className="text-sm font-medium">Architecture Assistant</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I can help you plan and optimize your architecture. Ask me about best practices, trade-offs, or let me
              analyze your current design.
            </p>
          </CardContent>
        </Card>

        {/* Capability cards */}
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">What I can help with</p>

          <Card className="border-border transition-colors hover:bg-accent/30 cursor-default">
            <CardContent className="p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium">Suggest Improvements</span>
              </div>
              <p className="text-xs text-muted-foreground">Get recommendations based on your architecture patterns</p>
            </CardContent>
          </Card>

          <Card className="border-border transition-colors hover:bg-accent/30 cursor-default">
            <CardContent className="p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-medium">Review Decisions</span>
              </div>
              <p className="text-xs text-muted-foreground">Identify potential issues and anti-patterns</p>
            </CardContent>
          </Card>

          <Card className="border-border transition-colors hover:bg-accent/30 cursor-default">
            <CardContent className="p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium">Help Evolve System</span>
              </div>
              <p className="text-xs text-muted-foreground">Plan migrations and scaling strategies</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Ask about your architecture..."
            className="h-9 flex-1 bg-secondary/30"
          />
          <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">AI features coming soon</p>
      </div>
    </aside>
  )
}
