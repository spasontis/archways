import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AIAssistantBadge } from "@/components/ai-assistant-badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Blocks, CircleDot, Layers, Sparkles, Workflow } from "lucide-react"
import Link from "next/link"

const capabilities = [
  {
    icon: Blocks,
    title: "Define Components",
    description: "Create any component type — services, databases, queues, caches, and more.",
  },
  {
    icon: Workflow,
    title: "Map Connections",
    description: "Define how your components communicate and depend on each other.",
  },
  {
    icon: Layers,
    title: "Set Boundaries",
    description: "Establish clear boundaries between domains and modules.",
  },
  {
    icon: CircleDot,
    title: "Version & Evolve",
    description: "Track changes over time and plan migrations between architectures.",
  },
]

export default function CustomPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/40">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <AIAssistantBadge />
              <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Build from scratch</h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Full flexibility, zero constraints. Design an architecture that&apos;s uniquely tailored to your
                application&apos;s requirements and your team&apos;s way of working.
              </p>
              <div className="mt-10">
                <Button size="lg">
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="bg-card/30">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">You define everything</h2>
              <p className="mt-4 text-muted-foreground">
                Nothing is imposed. Start with a blank canvas and build exactly what you need.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((capability) => (
                <div key={capability.title} className="rounded-lg border border-border/40 bg-card p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                    <capability.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold">{capability.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{capability.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Assistance */}
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">AI-Assisted</span>
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight">Guidance without constraints</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Even when building from scratch, you&apos;re not alone. Our AI assistant helps you explore options,
                  validates decisions, and suggests improvements — while keeping you in full control.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="rounded-lg border border-border/40 bg-card/50 p-4">
                    <p className="text-sm font-medium">Ask questions like:</p>
                    <ul className="mt-3 space-y-2">
                      {[
                        '"What caching strategy would work best for my use case?"',
                        '"Should I separate this into its own service?"',
                        '"What are the trade-offs of this approach?"',
                      ].map((question) => (
                        <li key={question} className="flex items-start gap-2">
                          <span className="text-muted-foreground">→</span>
                          <span className="text-sm text-muted-foreground italic">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <div className="aspect-square rounded-lg border border-border/40 bg-card/50 p-8">
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    <Sparkles className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-center text-sm text-muted-foreground">AI-powered design assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/40 bg-card/30">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div>
                <h3 className="text-xl font-semibold">Prefer a head start?</h3>
                <p className="mt-1 text-muted-foreground">Browse our collection of proven architecture templates.</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/templates">
                  View Templates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
