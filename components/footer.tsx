import Link from "next/link"
import { Boxes } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Archway</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </Link>
            <Link href="/custom" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Custom
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Archway. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
