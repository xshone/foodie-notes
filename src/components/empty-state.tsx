import { Button } from "@/components/ui/button"
import { PlusIcon, UtensilsCrossedIcon } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="size-20 rounded-full bg-secondary flex items-center justify-center mb-5">
        <UtensilsCrossedIcon className="size-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">还没有菜谱</h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
        开始记录你的第一道专属菜谱吧，让美食成为你的记忆。
      </p>
      <Button asChild>
        <Link href="/recipes/new">
          <PlusIcon className="size-4" />
          记录第一道菜谱
        </Link>
      </Button>
    </div>
  )
}
