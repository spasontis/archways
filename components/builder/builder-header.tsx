import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Boxes, ChevronDown, Save, Share2, Play, PanelLeft, PanelRight, Maximize2 } from "lucide-react"
import { useBuilder } from "./builder-context"
import { useReactFlow } from "reactflow"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"

export function BuilderHeader() {
  const { showSidebar, setShowSidebar, showAssistant, setShowAssistant } = useBuilder()
  const { fitView } = useReactFlow()

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Boxes className="h-5 w-5 text-foreground" />
          <span className="text-sm font-semibold tracking-tight">Archways</span>
        </Link>
        <div className="h-4 w-px bg-border" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 font-normal">
              <span className="text-sm text-foreground">My Architecture</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem>My Architecture</DropdownMenuItem>
            <DropdownMenuItem>E-commerce System</DropdownMenuItem>
            <DropdownMenuItem>Auth Service Design</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <div className="flex items-center gap-1 mr-2 px-2 border-r border-border">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-8 w-8", !showSidebar && "text-muted-foreground opacity-50")}
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Sidebar</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-8 w-8", !showAssistant && "text-muted-foreground opacity-50")}
                  onClick={() => setShowAssistant(!showAssistant)}
                >
                  <PanelRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Assistant</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <ThemeToggle />
        <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground">
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button size="sm" className="h-8 gap-2">
          <Play className="h-4 w-4" />
          Validate
        </Button>
      </div>
    </header>
  )
}
