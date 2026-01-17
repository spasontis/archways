"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react"
import { Globe, FileCode, Layers, Cpu, Server, Database, Cloud, GitBranch, Folder } from "lucide-react"
import { Edge, Node, addEdge, Connection, EdgeChange, NodeChange, applyNodeChanges, applyEdgeChanges, useNodesState, useEdgesState, Position } from "reactflow"

export type NodeType = "group" | "item"

export interface ArchitectureNode {
  id: string
  name: string
  type: NodeType
  parentId?: string
  icon: any
  color?: string
  position: { x: number; y: number }
}

interface BuilderContextType {
  nodes: Node[]
  archNodes: ArchitectureNode[]
  edges: Edge[]
  layoutMode: "horizontal" | "vertical"
  selectedNodeId: string | null
  setSelectedNodeId: (id: string | null) => void
  setLayoutMode: (mode: "horizontal" | "vertical") => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  deleteEdge: (edgeId: string) => void
  deleteNode: (nodeId: string) => void
  deleteNodes: (nodeIds: string[]) => void
  addNode: (name: string, type: NodeType, parentId?: string, iconName?: string) => void
  setFullArchitecture: (nodes: Node[], edges: Edge[]) => void
  isSyncing: boolean
  showSidebar: boolean
  setShowSidebar: (show: boolean) => void
  showAssistant: boolean
  setShowAssistant: (show: boolean) => void
  updateNodeData: (nodeId: string, data: any) => void
  renameNode: (nodeId: string, newName: string) => void
  syncNodes: () => void
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined)

import architectureData from "@/data/architecture.json"
import { MessageSquare } from "lucide-react"

const iconMap: Record<string, any> = { 
  Globe, FileCode, Layers, Cpu, Server, Database, Cloud, GitBranch, Folder, MessageSquare
}

const iconToNameMap: Record<string, string> = {
  "Frontend": "Globe",
  "Gateway": "Layers",
  "Service": "Server",
  "Database": "Database",
  "Message Queue": "MessageSquare"
}
export function BuilderProvider({ children }: { children: ReactNode }) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [layoutMode, setLayoutMode] = useState<"horizontal" | "vertical">("horizontal")
  const [manualPositions, setManualPositions] = useState<{
    horizontal: Record<string, { x: number, y: number }>,
    vertical: Record<string, { x: number, y: number }>
  }>({ horizontal: {}, vertical: {} })
  const [showSidebar, setShowSidebar] = useState(true)
  const [showAssistant, setShowAssistant] = useState(true)

  // Default data for SSR and initial client render
  const defaultNodes: Node[] = architectureData.map(node => ({
    id: node.id,
    type: node.type,
    data: { 
      label: node.name, 
      icon: iconMap[node.iconName] || FileCode, 
      color: node.color,
      iconName: node.iconName 
    },
    position: node.position || { x: 0, y: 0 }
  }))

  const defaultEdges: Edge[] = architectureData
    .filter(node => node.parentId)
    .map(node => ({
      id: `e-${node.parentId}-${node.id}`,
      source: node.parentId!,
      target: node.id,
      animated: true,
      type: 'smoothstep'
    }))

  const [nodes, setNodes] = useState<Node[]>(defaultNodes)
  const [edges, setEdges] = useState<Edge[]>(defaultEdges)

  // Keep a ref to nodes/edges for sync operations to avoid stale closures
  const nodesRef = React.useRef(nodes)
  const edgesRef = React.useRef(edges)
  const manualPositionsRef = React.useRef(manualPositions)

  useEffect(() => {
    nodesRef.current = nodes
    edgesRef.current = edges
    manualPositionsRef.current = manualPositions
  }, [nodes, edges, manualPositions])

  const applyAutoLayout = useCallback((mode: "horizontal" | "vertical", currentNodes: Node[]) => {
    const isHorizontal = mode === "horizontal"
    const targetPos = isHorizontal ? Position.Left : Position.Top
    const sourcePos = isHorizontal ? Position.Right : Position.Bottom

    // 1. Build Adjacency List
    const adj = new Map<string, string[]>()
    edges.forEach(e => {
      if (!adj.has(e.source)) adj.set(e.source, [])
      adj.get(e.source)!.push(e.target)
    })

    // 2. Identify Roots
    const roots = currentNodes.filter(n => !edges.some(e => e.target === n.id))
    
    // 3. Track depth dimensions and node metadata
    const nodeMeta = new Map<string, { depth: number, avgV: number, size: number }>()
    const depthMaxDim = new Map<number, number>()
    let leafCounter = 0
    
    const analyze = (nodeId: string, depth: number) => {
      const node = currentNodes.find(n => n.id === nodeId)
      if (!node) return

      // Estimate node size based on label length (approx 8px per char + room for icon/padding)
      const labelLen = node.data?.label?.length || 0
      const estimatedDim = isHorizontal 
        ? Math.max(140, labelLen * 8.5 + 40) 
        : Math.max(120, labelLen * 8.5 + 40)
      
      depthMaxDim.set(depth, Math.max(depthMaxDim.get(depth) || 0, estimatedDim))

      const children = adj.get(nodeId) || []
      const startV = leafCounter
      
      if (children.length === 0) {
        leafCounter++
      } else {
        children.forEach(childId => analyze(childId, depth + 1))
      }
      
      const endV = leafCounter - 1
      const avgV = (startV + endV) / 2
      
      nodeMeta.set(nodeId, { depth, avgV, size: estimatedDim })
    }

    roots.forEach(root => analyze(root.id, 0))

    // 4. Calculate cumulative depth offsets
    const depthOffsets = new Map<number, number>()
    let currentOffset = 40
    for (let d = 0; d <= Math.max(0, ...Array.from(depthMaxDim.keys())); d++) {
      depthOffsets.set(d, currentOffset)
      currentOffset += (depthMaxDim.get(d) || 120) + (isHorizontal ? 80 : 100)
    }

    // 5. Final positioning
    return currentNodes.map((node) => {
      if (manualPositions[mode][node.id]) {
        return {
          ...node,
          position: manualPositions[mode][node.id],
          targetPosition: targetPos,
          sourcePosition: sourcePos
        }
      }

      const meta = nodeMeta.get(node.id)
      if (!meta) return node

      const autoPos = isHorizontal ? {
        x: depthOffsets.get(meta.depth) || (40 + meta.depth * 180),
        y: 40 + meta.avgV * 90
      } : {
        x: 40 + meta.avgV * 150,
        y: depthOffsets.get(meta.depth) || (40 + meta.depth * 130)
      }

      return {
        ...node,
        position: autoPos,
        targetPosition: targetPos,
        sourcePosition: sourcePos
      }
    })
  }, [edges, manualPositions])

  // Load from localStorage only after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    const savedNodes = localStorage.getItem("arch_nodes")
    const savedEdges = localStorage.getItem("arch_edges")
    const savedLayout = localStorage.getItem("arch_layout")
    const savedManual = localStorage.getItem("arch_manual")

    if (savedLayout) setLayoutMode(savedLayout as any)
    if (savedManual) setManualPositions(JSON.parse(savedManual))

    if (savedNodes) {
      try {
        const parsedNodes = JSON.parse(savedNodes)
        // Re-attach icons from names
        const reconstructedNodes = parsedNodes.map((n: Node) => ({
          ...n,
          data: {
            ...n.data,
            icon: iconMap[n.data.iconName] || FileCode
          }
        }))
        setNodes(reconstructedNodes)
      } catch (e) {
        console.error("Failed to load saved nodes:", e)
      }
    }

    if (savedEdges) {
      try {
        setEdges(JSON.parse(savedEdges))
      } catch (e) {
        console.error("Failed to load saved edges:", e)
      }
    }
  }, [])

  // Auto-layout on mode change or node count change
  useEffect(() => {
    if (mounted) {
      setNodes(nds => {
        // Only trigger auto-layout if a node has the default 100,100 position (meaning it was just added)
        // OR if the layout mode just changed.
        const hasNewNode = nds.some(n => n.position.x === 100 && n.position.y === 100)
        if (hasNewNode) {
          return applyAutoLayout(layoutMode, nds)
        }
        return nds
      })
    }
  }, [nodes.length, layoutMode, applyAutoLayout, mounted])

  // Initial layout and mode change
  useEffect(() => {
    if (mounted) {
      setNodes(nds => applyAutoLayout(layoutMode, nds))
    }
  }, [layoutMode, applyAutoLayout, mounted])

  // Sync to localStorage manually or on specific triggers
  const syncNodes = useCallback(() => {
    if (mounted && nodesRef.current.length > 0) {
      setIsSyncing(true)
      localStorage.setItem("arch_nodes", JSON.stringify(nodesRef.current))
      localStorage.setItem("arch_edges", JSON.stringify(edgesRef.current))
      localStorage.setItem("arch_layout", layoutMode)
      localStorage.setItem("arch_manual", JSON.stringify(manualPositionsRef.current))
      const timer = setTimeout(() => setIsSyncing(false), 500)
      return () => clearTimeout(timer)
    }
  }, [layoutMode, mounted])

  // Explicitly update node data without triggering a full re-render/sync immediately
  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) => nds.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, ...newData } }
      }
      return node
    }))
  }, [])

  const renameNode = useCallback((nodeId: string, newName: string) => {
    setNodes((nds) => {
      const newNodes = nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label: newName } }
        }
        return node
      })
      
      // Update ref immediately for sync safety
      nodesRef.current = newNodes
      
      // Trigger immediate sync
      if (mounted) {
        setIsSyncing(true)
        localStorage.setItem("arch_nodes", JSON.stringify(newNodes))
        setTimeout(() => setIsSyncing(false), 200)
      }
      
      return newNodes
    })
  }, [mounted])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const nextNodes = applyNodeChanges(changes, nds)
        
        // Track manual moves
        changes.forEach(change => {
          if (change.type === 'position' && (change as any).dragging) {
            const node = nextNodes.find(n => n.id === change.id)
            if (node) {
              setManualPositions(prev => ({
                ...prev,
                [layoutMode]: {
                  ...prev[layoutMode],
                  [node.id]: (change as any).position || node.position
                }
              }))
            }
          }
        })

        return nextNodes
      })
    },
    [layoutMode]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    []
  )

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true, type: 'smoothstep', style: undefined }, eds))
    },
    []
  )

  const deleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter(e => e.id !== edgeId))
  }, [])

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter(n => n.id !== nodeId))
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId))
    if (selectedNodeId === nodeId) setSelectedNodeId(null)
  }, [selectedNodeId])

  const deleteNodes = useCallback((nodeIds: string[]) => {
    setNodes((nds) => nds.filter(n => !nodeIds.includes(n.id)))
    setEdges((eds) => eds.filter(e => !nodeIds.includes(e.source) && !nodeIds.includes(e.target)))
    if (selectedNodeId && nodeIds.includes(selectedNodeId)) setSelectedNodeId(null)
  }, [selectedNodeId])

  const addNode = useCallback((name: string, type: NodeType, parentId?: string, iconName?: string) => {
    const newId = Math.random().toString(36).substr(2, 9)
    const finalIconName = iconName || (type === "group" ? "Folder" : "FileCode")
    
    const newNode: Node = {
      id: newId,
      type,
      data: { 
        label: name, 
        icon: iconMap[finalIconName], 
        color: type === "group" ? "bg-slate-500/10 border-slate-500/50 text-slate-500" : undefined,
        iconName: finalIconName
      },
      position: { x: 100, y: 100 }
    }
    
    setNodes(prev => [...prev, newNode])
    
    if (parentId) {
      const newEdge: Edge = {
        id: `e-${parentId}-${newId}`,
        source: parentId,
        target: newId,
        animated: true,
        type: 'smoothstep'
      }
      setEdges(prev => [...prev, newEdge])
    }
  }, [])

  const setFullArchitecture = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    // Inflate nodes with icon components before setting state
    const inflatedNodes = newNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        icon: iconMap[node.data.iconName] || (node.type === "group" ? Globe : FileCode)
      }
    }))

    setNodes(inflatedNodes)
    setEdges(newEdges.map(edge => ({
      ...edge,
      animated: true,
      style: undefined // Remove any specialized static styles
    })))
  }, [])

  // Map internal nodes back to ArchitectureNode structure for sidebar/other views
  const archNodes: ArchitectureNode[] = useMemo(() => {
    return nodes.map(n => ({
      id: n.id,
      name: n.data.label,
      type: n.type as NodeType,
      icon: n.data.icon,
      color: n.data.color,
      position: n.position,
      parentId: edges.find(e => e.target === n.id && e.source !== n.id)?.source 
    }))
  }, [nodes, edges])

  return (
    <BuilderContext.Provider value={{ 
      nodes,
      archNodes,
      edges, 
      layoutMode,
      selectedNodeId, 
      setSelectedNodeId,
      setLayoutMode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      deleteEdge,
      deleteNode,
      deleteNodes,
      addNode,
      setFullArchitecture,
      isSyncing,
      showSidebar,
      setShowSidebar,
      showAssistant,
      setShowAssistant,
      updateNodeData,
      renameNode,
      syncNodes
    }}>
      {children}
    </BuilderContext.Provider>
  )
}

export function useBuilder() {
  const context = useContext(BuilderContext)
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider")
  }
  return context
}
