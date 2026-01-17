import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AIAssistantBadge } from "@/components/ai-assistant-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Box, GitBranch, Layers, Network, Radio } from "lucide-react"
import Link from "next/link"

const templates = [
  {
    icon: Box,
    name: "Monolith",
    description:
      "A single, unified codebase where all components are tightly integrated. Best for smaller teams and simpler applications.",
    tags: ["Simple", "Quick Start", "Low Overhead"],
  },
  {
    icon: Layers,
    name: "Modular Monolith",
    description:
      "A monolithic architecture with clear module boundaries. Combines simplicity with better maintainability.",
    tags: ["Organized", "Scalable", "Team-friendly"],
  },
  {
    icon: Network,
    name: "Microservices",
    description:
      "Distributed architecture with independently deployable services. Ideal for large teams and complex domains.",
    tags: ["Distributed", "Independent", "Scalable"],
  },
  {
    icon: Radio,
    name: "Event-Driven",
    description:
      "Architecture built around event production, detection, and reaction. Perfect for real-time and async workflows.",
    tags: ["Async", "Decoupled", "Real-time"],
  },
]

export default function TemplatesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/40">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <AIAssistantBadge />
              <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Find your Template</h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Start with a proven architecture framework and customize it to fit your needs. Each template is designed
                for different scales and team structures.
              </p>
            </div>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="bg-card/30">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-6 md:grid-cols-2">
              {templates.map((template) => (
                <Card
                  key={template.name}
                  className="group relative transition-all hover:border-border hover:bg-card/80"
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <template.icon className="h-6 w-6 text-foreground" />
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 transition-opacity group-hover:opacity-100">
                      Select
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-2 text-lg font-semibold">{template.name}</CardTitle>
                    <p className="text-sm leading-relaxed text-muted-foreground">{template.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="font-medium text-muted-foreground"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Customization Section */}
        <section className="border-t border-border/40">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="order-2 lg:order-1">
                <div className="aspect-video rounded-lg border border-border/40 bg-card/50 p-8">
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    <GitBranch className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-center text-sm text-muted-foreground">Extend and customize your template</p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold tracking-tight">Start with a foundation, make it yours</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Templates are starting points, not constraints. Once you select a framework, you have full control to
                  extend, modify, and customize every aspect to fit your specific requirements.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Add or remove components based on your needs",
                    "Adjust scaling strategies and patterns",
                    "Integrate with your existing infrastructure",
                    "Get AI suggestions for improvements",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/40 bg-card/30">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div>
                <h3 className="text-xl font-semibold">Need something different?</h3>
                <p className="mt-1 text-muted-foreground">Design a completely custom architecture from scratch.</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/custom">
                  Start Custom Build
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
