import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { nodeId, data } = body

        // Resolve path to architecture.json
        const filePath = path.join(process.cwd(), "data", "architecture.json")

        // Read existing data
        const fileContent = await fs.readFile(filePath, "utf-8")
        const architecture = JSON.parse(fileContent)

        // Find and update the node
        const nodeIndex = architecture.findIndex((n: any) => n.id === nodeId)
        if (nodeIndex !== -1) {
            architecture[nodeIndex].name = data.label
            // You can also update other properties if needed
        } else {
            return NextResponse.json({ success: false, error: "Node not found" }, { status: 404 })
        }

        // Write updated data back to file
        await fs.writeFile(filePath, JSON.stringify(architecture, null, 2), "utf-8")

        console.log(`[DB] Updated node ${nodeId} name to: ${data.label}`)

        return NextResponse.json({ success: true, nodeId, data })
    } catch (error) {
        console.error("[DB] Update failed:", error)
        return NextResponse.json({ success: false, error: "Failed to update node" }, { status: 500 })
    }
}
