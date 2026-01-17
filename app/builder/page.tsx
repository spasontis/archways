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
import { useBuilder } from "@/components/builder/builder-context"

export default function BuilderPage() {
  return (
    <ReactFlowProvider>
      <BuilderProvider>
        <BuilderPageContent />
      </BuilderProvider>
    </ReactFlowProvider>
  )
}

function BuilderPageContent() {
  const { showSidebar, showAssistant } = useBuilder()

  return (
    <div className="flex h-screen flex-col bg-background">
      <BuilderHeader />
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {showSidebar && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={40} order={1}>
                <ArchitectureSidebar />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          
          <ResizablePanel defaultSize={showSidebar ? (showAssistant ? 60 : 80) : (showAssistant ? 72 : 100)} order={2}>
            <div className="flex h-full w-full overflow-hidden">
              <BuilderCanvas />
            </div>
          </ResizablePanel>

          {showAssistant && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={40} order={3}>
                <AiAssistantPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
