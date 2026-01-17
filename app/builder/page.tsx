"use client"

import { ArchitectureSidebar } from "@/components/builder/architecture-sidebar"
import { BuilderCanvas } from "@/components/builder/builder-canvas"
import { AiAssistantPanel } from "@/components/builder/ai-assistant-panel"
import { BuilderHeader } from "@/components/builder/builder-header"
import { BuilderProvider } from "@/components/builder/builder-context"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { ReactFlowProvider } from "reactflow"

export default function BuilderPage() {
  return (
    <ReactFlowProvider>
      <BuilderProvider>
        <div className="flex h-screen flex-col bg-background">
          <BuilderHeader />
          <div className="flex flex-1 overflow-hidden">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
                <ArchitectureSidebar />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={80}>
                <div className="flex h-full w-full overflow-hidden">
                  <BuilderCanvas />
                  <AiAssistantPanel />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </BuilderProvider>
    </ReactFlowProvider>
  )
}
