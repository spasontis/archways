import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AIAssistantBadge } from "@/components/ai-assistant-badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Boxes, GitBranch, Layers, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Layers,
    title: "Ready-made Templates",
    description:
      "Start with battle-tested architecture patterns like Microservices, Monolith, or Event-driven designs.",
  },
  {
    icon: GitBranch,
    title: "Custom Architecture",
    description: "Build your architecture from scratch with complete flexibility and full control over every decision.",
  },
  {
    icon: Sparkles,
    title: "AI Assistance",
    description: "Get intelligent suggestions, reviews, and improvements as you design your system architecture.",
  },
  {
    icon: Zap,
    title: "Evolve Over Time",
    description: "Your architecture grows with you. Iterate, refine, and scale as your requirements change.",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/50 via-background to-background" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <AIAssistantBadge />
              <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Plan your application architecture with confidence
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Design, compare, and improve architectural solutions for web applications. Start from proven templates
                or build from scratch — with AI assistance at every step.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/templates">
                    Browse Templates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/custom">Start from Scratch</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border/40 bg-card/30">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need to architect modern applications
              </h2>
              <p className="mt-4 text-muted-foreground">
                A structured approach to making architectural decisions that scale.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-lg border border-border/40 bg-card/50 p-6 transition-colors hover:border-border hover:bg-card"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Section */}
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">AI Assistant</span>
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight">Your professional architecture advisor</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  AI assistance is available throughout your planning process. Get suggestions for patterns, have your
                  decisions reviewed, and receive proposals for improvements — all tailored to your specific context.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Suggest architectural patterns based on your requirements",
                    "Review decisions and identify potential issues",
                    "Propose improvements and optimizations",
                    "Help evolve your architecture over time",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-lg border border-border/40 bg-card/50 p-8">
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    <Boxes className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-center text-sm text-muted-foreground">AI-powered architecture visualization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/40 bg-card/30">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Ready to plan your architecture?</h2>
              <p className="mt-4 text-muted-foreground">Start with a template or design something completely custom.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/templates">
                    Explore Templates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
