"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useBuilder } from "./builder-context"
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode,
  Database,
  Server,
  Globe,
  Cpu,
  GitBranch,
  Cloud,
  Layers,
  Plus,
  Github,
  Loader2,
} from "lucide-react"

interface TreeNode {
  id: string
  name: string
  icon: React.ElementType
  children?: TreeNode[]
}


import { Trash2 } from "lucide-react"
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

import { useEffect } from "react"

function TreeItem({ 
  node, 
  level = 0, 
  allNodes, 
  onAdd,
  onDelete
}: { 
  node: any; 
  level?: number; 
  allNodes: any[]; 
  onAdd: (parentId: string) => void;
  onDelete: (nodeId: string) => void;
}) {
  const { selectedNodeId, selectedNodeIds, setSelectedNodeId } = useBuilder()
  const [isOpen, setIsOpen] = useState(false) // Default to collapsed
  const isGroup = node.type === "group"
  const children = allNodes
    .filter(n => n.parentId === node.id)
    .sort((a, b) => {
      if (a.type === "group" && b.type !== "group") return -1
      if (a.type !== "group" && b.type === "group") return 1
      return a.name.localeCompare(b.name)
    })
  const hasChildren = children.length > 0
  const Icon = node.icon
  const FolderIcon = isOpen ? FolderOpen : Folder
  const isSelected = selectedNodeIds.includes(node.id)

  // Load expansion state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`folder_expanded_${node.id}`)
    if (saved !== null) {
      setIsOpen(saved === "true")
    }
  }, [node.id])

  // Save expansion state to localStorage
  const toggleOpen = () => {
    const nextState = !isOpen
    setIsOpen(nextState)
    localStorage.setItem(`folder_expanded_${node.id}`, String(nextState))
  }

  // Auto-expand if this node is a parent of any selected node
  useEffect(() => {
    if (isGroup && selectedNodeIds.length > 0) {
      // Check if any selected node is a descendant of this node
      const isParentOfSelected = selectedNodeIds.some(selectedId => {
        let currentNode = allNodes.find(n => n.id === selectedId)
        while (currentNode?.parentId) {
          if (currentNode.parentId === node.id) {
            return true
          }
          currentNode = allNodes.find(n => n.id === currentNode!.parentId)
        }
        return false
      })
      
      if (isParentOfSelected && !isOpen) {
        setIsOpen(true)
        localStorage.setItem(`folder_expanded_${node.id}`, "true")
      }
    }
  }, [selectedNodeIds, node.id, isGroup, allNodes, isOpen])

  return (
    <div>
      <div className="group flex items-center pr-2">
        <button
          onClick={() => {
            if (isGroup) {
              toggleOpen()
            }
            setSelectedNodeId(node.id)
          }}
          className={cn(
            "flex flex-1 items-center gap-1.5 rounded-sm px-2 py-1 text-sm transition-colors text-left",
            isSelected 
              ? "bg-accent text-accent-foreground font-medium" 
              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {isGroup ? (
            isOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )
          ) : (
            <span className="w-4" />
          )}
          {isGroup ? (
            <FolderIcon className="h-4 w-4 shrink-0" />
          ) : (
            Icon && <Icon className="h-4 w-4 shrink-0" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {isGroup && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.stopPropagation()
                onAdd(node.id)
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(node.id)
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {isGroup && isOpen && (
        <div className="mt-0.5">
          {children.map((child: any) => (
            <TreeItem 
              key={child.id} 
              node={child} 
              level={level + 1} 
              allNodes={allNodes}
              onAdd={onAdd}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ArchitectureSidebar() {
  const { archNodes: nodes, addNode, deleteNode, setFullArchitecture, selectedNodeIds } = useBuilder()
  const topLevelNodes = (nodes || [])
    .filter(n => !n.parentId)
    .sort((a, b) => {
      if (a.type === "group" && b.type !== "group") return -1
      if (a.type !== "group" && b.type === "group") return 1
      return a.name.localeCompare(b.name)
    })

  const [addDialog, setAddDialog] = useState<{
    isOpen: boolean;
    parentId?: string;
    type: "group" | "item";
  }>({
    isOpen: false,
    type: "group"
  })
  const [githubDialog, setGithubDialog] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [deleteNodeId, setDeleteNodeId] = useState<string | null>(null)
  const [newName, setNewName] = useState("")

  const handleCreateNode = () => {
    if (newName.trim()) {
      addNode(newName, addDialog.type, addDialog.parentId)
      setAddDialog(prev => ({ ...prev, isOpen: false }))
      setNewName("")
    }
  }

  const handleGithubImport = async () => {
    if (!repoUrl.trim()) return
    
    // Extract owner/repo
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) {
      alert("Please enter a valid GitHub repository URL.")
      return
    }
    
    const [_, owner, repoName] = match
    const repo = repoName.replace(/\.git$/, "")
    
    const COLORS = [
      "bg-blue-500/10 border-blue-500/50 text-blue-500",
      "bg-purple-500/10 border-purple-500/50 text-purple-500",
      "bg-amber-500/10 border-amber-500/50 text-amber-500",
      "bg-emerald-500/10 border-emerald-500/50 text-emerald-500",
      "bg-rose-500/10 border-rose-500/50 text-rose-500",
      "bg-cyan-500/10 border-cyan-500/50 text-cyan-500",
      "bg-indigo-500/10 border-indigo-500/50 text-indigo-500",
      "bg-orange-500/10 border-orange-500/50 text-orange-500",
      "bg-teal-500/10 border-teal-500/50 text-teal-500",
    ]
    
    setIsAnalyzing(true)
    setAnalysisStep("Initializing AI analysis engine...")
    
    try {
      await new Promise(r => setTimeout(r, 600))
      setAnalysisStep(`Fetching repo structure from ${owner}/${repo}...`)
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`)
      
      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`)
      }
      
      const data = await response.json()
      const tree = data.tree || []
      
      setAnalysisStep(`Analyzing ${tree.length} files and folders...`)
      await new Promise(r => setTimeout(r, 800))
      
      const nodes: any[] = []
      const edges: any[] = []
      const pathMap: Record<string, string> = {}

      // Create a root node for the repo
      const rootId = "repo-root"
      nodes.push({
        id: rootId,
        type: "group",
        data: { 
          label: repo, 
          iconName: "Github",
          color: COLORS[0],
          isRoot: true
        },
        position: { x: 0, y: 0 }
      })
      pathMap[""] = rootId

      // Limit to first 120 entries for a better overview
      const entries = tree.slice(0, 120)
      
      entries.forEach((entry: any, index: number) => {
        const parts = entry.path.split("/")
        const depth = parts.length
        const name = parts[parts.length - 1]
        const parentPath = parts.slice(0, -1).join("/")
        const id = `node-${entry.sha}-${Math.random().toString(36).substr(2, 4)}`
        const type = entry.type === "tree" ? "group" : "item"
        const iconName = type === "group" ? "Folder" : "FileCode"
        
        // Color selection based on depth or random index
        const colorIndex = (depth + nodes.length) % COLORS.length
        const color = type === "group" ? COLORS[colorIndex] : undefined

        nodes.push({
          id,
          type,
          data: { label: name, iconName, color },
          position: { x: 0, y: 0 }
        })
        
        pathMap[entry.path] = id
        
        const parentId = pathMap[parentPath] || rootId
        edges.push({
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
          animated: parentId !== rootId,
          type: 'smoothstep'
        })
      })
      
      setAnalysisStep("Drafting architectural blueprint...")
      await new Promise(r => setTimeout(r, 600))
      
      setFullArchitecture(nodes as any, edges as any)
      setIsAnalyzing(false)
      setGithubDialog(false)
      setRepoUrl("")
    } catch (error) {
      console.error("GitHub Analysis Error:", error)
      alert("Analysis failed. Please check the URL and ensure the repository is public.")
      setIsAnalyzing(false)
    }
  }

  return (
    <aside className="flex h-full shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-10 items-center justify-between border-b border-border px-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Architecture</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
          setAddDialog({ isOpen: true, type: "group" })
          setNewName("")
        }}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {topLevelNodes.map((node) => (
          <TreeItem 
            key={node.id} 
            node={node} 
            allNodes={nodes}
            onAdd={(parentId) => {
              setAddDialog({ isOpen: true, parentId, type: "item" })
              setNewName("")
            }}
            onDelete={(id) => setDeleteNodeId(id)}
          />
        ))}
      </div>
      <div className="border-t border-border p-3">
        <Button
          variant="outline"
          className="w-full justify-center gap-2 border-dashed text-muted-foreground hover:text-foreground"
          size="sm"
          onClick={() => {
            setAddDialog({ isOpen: true, type: "group" })
            setNewName("")
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Add Layer</span>
        </Button>
        <Button
          variant="ghost"
          className="mt-2 w-full justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          size="sm"
          onClick={() => {
            setGithubDialog(true)
            setRepoUrl("")
          }}
        >
          <Github className="h-4 w-4" />
          <span>Import from GitHub</span>
        </Button>
      </div>

      {/* Add Dialog */}
      <Dialog open={addDialog.isOpen} onOpenChange={(open) => setAddDialog(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {addDialog.type === "group" ? "Layer" : "Item"}</DialogTitle>
            <DialogDescription>
              Enter a name for the new architecture {addDialog.type === "group" ? "layer" : "component"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="node-name">Name</Label>
              <Input
                id="node-name"
                placeholder="Database, Frontend, etc."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateNode()}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(prev => ({ ...prev, isOpen: false }))}>Cancel</Button>
            <Button onClick={handleCreateNode}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GitHub Import Dialog */}
      <Dialog open={githubDialog} onOpenChange={(open) => !isAnalyzing && setGithubDialog(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import from GitHub</DialogTitle>
            <DialogDescription>
              Enter the repository URL. Our AI will analyze the code and generate an architectural overview.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="repo-url">Repository URL</Label>
              <Input
                id="repo-url"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={isAnalyzing}
                onKeyDown={(e) => e.key === "Enter" && handleGithubImport()}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGithubDialog(false)} disabled={isAnalyzing}>Cancel</Button>
            <Button onClick={handleGithubImport} disabled={isAnalyzing || !repoUrl.trim()}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {analysisStep}
                </>
              ) : (
                "Analyze & Generate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteNodeId} onOpenChange={(open) => !open && setDeleteNodeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Component?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this component and all its child elements from the architecture.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteNodeId) {
                  deleteNode(deleteNodeId)
                  setDeleteNodeId(null)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  )
}
