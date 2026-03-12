import prisma from "@/lib/prisma"
import { RecipeCard } from "@/components/recipe-card"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "我的菜谱 | Foodie Notes",
}

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      difficulty: true,
      prepTime: true,
      cookTime: true,
      tags: true,
      imageUrl: true,
      isFavorite: true,
      createdAt: true,
    },
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">🍳 Foodie Notes</h1>
            <p className="text-xs text-muted-foreground">{recipes.length} 道菜谱</p>
          </div>
          <Button asChild size="sm">
            <Link href="/recipes/new">
              <PlusIcon className="size-4" />
              记录菜谱
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {recipes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
