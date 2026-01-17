import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Boxes, ChevronDown, Save, Share2, Play } from "lucide-react"

export function BuilderHeader() {
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
