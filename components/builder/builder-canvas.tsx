"use client"

import React, { useCallback, useMemo, useEffect } from "react"
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
  Handle,
  Position,
  NodeProps,
  MarkerType,
  SelectionMode,
  MiniMap,
  useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Plus, Minus, Globe, Server, Database, MessageSquare, Layers, FileCode, Cpu, Cloud, GitBranch, MousePointer2, Hand, Maximize, Map } from "lucide-react"

// Custom Node Components
const GroupNode = ({ data, selected }: NodeProps) => {
  const { layoutMode } = useBuilder()
  const Icon = data.icon || Globe
  const isHorizontal = layoutMode === "horizontal"

  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-lg border-2 bg-card/40 backdrop-blur-sm transition-all shadow-md p-2 min-w-[100px]",
      selected ? "border-primary ring-4 ring-primary/20" : "border-border/50",
      data.color
    )}>
      {isHorizontal ? (
        <>
          <Handle type="target" position={Position.Left} className="w-3 h-3 bg-background border-2 border-primary z-10" />
          <Handle type="source" position={Position.Right} className="w-3 h-3 bg-background border-2 border-primary z-10" />
        </>
      ) : (
        <>
          <Handle type="target" position={Position.Top} className="w-3 h-3 bg-background border-2 border-primary z-10" />
          <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-background border-2 border-primary z-10" />
        </>
      )}
      <div className="mb-1.5">
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <span className="text-sm font-bold tracking-tight text-center leading-tight">
        {data.label}
      </span>
    </div>
  )
}

const ItemNode = ({ data, selected }: NodeProps) => {
  const { layoutMode } = useBuilder()
  const Icon = data.icon || FileCode
  const isHorizontal = layoutMode === "horizontal"

  return (
    <div className={cn(
      "flex items-center gap-2 rounded border bg-background/95 p-2 shadow-sm transition-all whitespace-nowrap min-w-[110px]",
      selected ? "border-primary ring-2 ring-primary/20" : "border-border/50"
    )}>
      {isHorizontal ? (
        <>
          <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-background border-2 border-primary z-10" />
          <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-background border-2 border-primary z-10" />
        </>
      ) : (
        <>
          <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-background border-2 border-primary z-10" />
          <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-background border-2 border-primary z-10" />
        </>
      )}
      <div className="rounded bg-secondary/50 p-1">
        {Icon && <Icon className="h-3.5 w-3.5 text-foreground" />}
      </div>
      <span className="text-xs font-medium">{data.label}</span>
    </div>
  )
}

const nodeTypes = {
  group: GroupNode,
  item: ItemNode,
}

// Default edge options moved inside BuilderCanvas for theme awareness
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBuilder, NodeType } from "./builder-context"

// Custom Node Components
// ... (GroupNode and ItemNode stay the same, assuming they are defined above or kept)

const toolbarActions = [
  { icon: Globe, label: "Frontend", iconName: "Globe" },
  { icon: Layers, label: "Gateway", iconName: "Layers" },
  { icon: Server, label: "Service", iconName: "Server" },
  { icon: Database, label: "Database", iconName: "Database" },
  { icon: MessageSquare, label: "Message Queue", iconName: "MessageSquare" },
]

function BuilderToolbar({ 
  isSelectMode, 
  setIsSelectMode,
  showMiniMap,
  setShowMiniMap
}: { 
  isSelectMode: boolean, 
  setIsSelectMode: (val: boolean) => void,
  showMiniMap: boolean,
  setShowMiniMap: (val: boolean) => void
}) {
  const { 
    layoutMode, 
    setLayoutMode, 
    addNode,
    isSyncing 
  } = useBuilder()
  const { fitView, zoomIn, zoomOut } = useReactFlow()
  
  const [newName, setNewName] = React.useState("")
  const [addComponentState, setAddComponentState] = React.useState<{
    isOpen: boolean;
    type: string;
    iconName: string;
    label: string;
  }>({
    isOpen: false,
    type: "item",
    iconName: "FileCode",
    label: ""
  })

  const handleAddComponent = () => {
    if (newName.trim()) {
      addNode(newName, addComponentState.type as NodeType, undefined, addComponentState.iconName)
      setAddComponentState(prev => ({ ...prev, isOpen: false }))
      setNewName("")
    }
  }

  return (
    <>
      <Panel position="bottom-center" className="mb-4">
        <TooltipProvider>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/90 p-2 shadow-xl backdrop-blur-sm">
            {toolbarActions.map((item, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-muted-foreground hover:bg-accent hover:text-foreground"
                    onClick={() => {
                      setAddComponentState({
                        isOpen: true,
                        type: "item",
                        iconName: item.iconName,
                        label: item.label
                      })
                      setNewName("")
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add {item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <div className="mx-2 h-8 w-px bg-border" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-10 w-10 transition-colors",
                    layoutMode === "horizontal" ? "text-primary bg-primary/10" : "text-muted-foreground"
                  )}
                  onClick={() => setLayoutMode("horizontal")}
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Horizontal Layout</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-10 w-10 transition-colors",
                    layoutMode === "vertical" ? "text-primary bg-primary/10" : "text-muted-foreground"
                  )}
                  onClick={() => setLayoutMode("vertical")}
                >
                  <Layers className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vertical Layout</TooltipContent>
            </Tooltip>
            <div className="mx-2 h-8 w-px bg-border" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-10 w-10 transition-colors",
                    isSelectMode ? "text-primary bg-primary/10" : "text-muted-foreground"
                  )}
                  onClick={() => setIsSelectMode(!isSelectMode)}
                >
                  {isSelectMode ? <MousePointer2 className="h-5 w-5" /> : <Hand className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isSelectMode ? "Selection Tool" : "Pan Tool"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => zoomIn({ duration: 300 })}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => zoomOut({ duration: 300 })}
                >
                  <Minus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={() => fitView({ duration: 800 })}
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset View</TooltipContent>
            </Tooltip>
            <div className="mx-2 h-8 w-px bg-border" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "h-10 w-10 transition-colors",
                    showMiniMap ? "text-primary bg-primary/10" : "text-muted-foreground"
                  )}
                  onClick={() => setShowMiniMap(!showMiniMap)}
                >
                  <Map className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{showMiniMap ? "Hide MiniMap" : "Show MiniMap"}</TooltipContent>
            </Tooltip>
            <div className="mx-2 h-8 w-px bg-border" />
            <div className="flex items-center gap-2 px-3">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
                isSyncing ? "text-primary" : "text-muted-foreground"
              )}>
                {isSyncing ? "Syncing..." : "Live Sync"}
              </span>
              <div className={cn(
                "h-1.5 w-1.5 rounded-full transition-all",
                isSyncing ? "bg-primary animate-pulse scale-125" : "bg-emerald-500"
              )} />
            </div>
          </div>
        </TooltipProvider>
      </Panel>

      {/* Add Component Dialog moved inside toolbar context for consistency */}
      <Dialog open={addComponentState.isOpen} onOpenChange={(open) => setAddComponentState(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {addComponentState.label}</DialogTitle>
            <DialogDescription>
              Give your new {addComponentState.label.toLowerCase()} a descriptive name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder={`${addComponentState.label} Name`}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComponent()}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddComponentState(prev => ({ ...prev, isOpen: false }))}>Cancel</Button>
            <Button onClick={handleAddComponent}>Add Component</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function BuilderCanvas() {
  const { 
    nodes, 
    edges: contextEdges, 
    selectedNodeId, 
    setSelectedNodeId,
    onConnect,
    onNodesChange,
    onEdgesChange,
    deleteEdge,
    deleteNodes,
    isSyncing,
    layoutMode
  } = useBuilder()

  const { theme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const miniMapNodeColor = isDark ? "#1e293b" : "#f1f5f9"

  const defaultEdgeOptions = useMemo(() => ({
    type: 'smoothstep',
    animated: true,
    // Style is now mostly handled in globals.css for theme reactivity
    style: { opacity: 1 }, 
  }), [])

  const [mounted, setMounted] = React.useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [isSelectMode, setIsSelectMode] = React.useState(false)
  const [showMiniMap, setShowMiniMap] = React.useState(true)
  const [deleteEdgeId, setDeleteEdgeId] = React.useState<string | null>(null)

  const onNodesDelete = useCallback((deleted: any[]) => {
    deleteNodes(deleted.map(n => n.id))
  }, [deleteNodes])

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNodeId(node.id)
  }, [setSelectedNodeId])

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [setSelectedNodeId])

  const onEdgeClick = useCallback((event: any, edge: any) => {
    setDeleteEdgeId(edge.id)
  }, [])

  if (!mounted) return <div className="flex-1 bg-background" />

  return (
    <div className="relative flex-1 bg-background">
      <ReactFlow
        nodes={nodes}
        edges={contextEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onEdgeClick={onEdgeClick}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        deleteKeyCode={["Backspace", "Delete"]}
        selectionOnDrag={isSelectMode}
        selectionMode={SelectionMode.Partial}
        panOnDrag={!isSelectMode}
      >
        <Background gap={20} size={1} color={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
        {showMiniMap && (
          <MiniMap 
            nodeStrokeColor="#3b82f6" 
            nodeColor={(n) => n.type === 'group' ? 'rgba(59, 130, 246, 0.1)' : miniMapNodeColor}
            maskColor={isDark ? "rgb(0, 0, 0, 0.2)" : "rgb(255, 255, 255, 0.2)"}
            className="bg-background/80 border border-border rounded-lg shadow-lg !m-4"
          />
        )}
        
        <BuilderToolbar 
          isSelectMode={isSelectMode} 
          setIsSelectMode={setIsSelectMode}
          showMiniMap={showMiniMap}
          setShowMiniMap={setShowMiniMap}
        />
      </ReactFlow>

      {/* Delete Edge Confirmation */}
      <AlertDialog open={!!deleteEdgeId} onOpenChange={(open) => !open && setDeleteEdgeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Connection?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the relationship between these two components. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteEdgeId) {
                  deleteEdge(deleteEdgeId)
                  setDeleteEdgeId(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
