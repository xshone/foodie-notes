import prisma from "@/lib/prisma"
import { RecipeCard } from "@/components/recipe-card"
import { FeaturedRecipeCard } from "@/components/featured-recipe-card"
import { EmptyState } from "@/components/empty-state"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { PlusIcon, HeartIcon, BookOpenIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "我的菜谱 | Foodie Notes",
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const showFavorites = filter === "favorites"

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

  const favoriteRecipes = recipes.filter((r) => r.isFavorite)
  const displayedRecipes = showFavorites ? favoriteRecipes : recipes

  // Date-seeded recommendation: same recipe all day, changes each day
  const today = new Date()
  const dateSeed = parseInt(
    `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`,
  )
  const featuredRecipe =
    !showFavorites && recipes.length > 0 ? recipes[dateSeed % recipes.length] : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">🍳 Foodie Notes</h1>
            <p className="text-xs text-muted-foreground">{recipes.length} 道菜谱</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm">
              <Link href="/recipes/new">
                <PlusIcon className="size-4" />
                记录菜谱
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex items-center gap-1">
          <Link
            href="/recipes"
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              !showFavorites
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <BookOpenIcon className="size-3.5" />
            全部
          </Link>
          <Link
            href="/recipes?filter=favorites"
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              showFavorites
                ? "bg-rose-500 text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            <HeartIcon className={cn("size-3.5", showFavorites && "fill-white")} />
            收藏
            {favoriteRecipes.length > 0 && (
              <span
                className={cn(
                  "ml-0.5 text-xs",
                  showFavorites ? "text-white/80" : "text-muted-foreground",
                )}
              >
                {favoriteRecipes.length}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {displayedRecipes.length === 0 ? (
          showFavorites ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <HeartIcon className="size-10 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">还没有收藏任何菜谱</p>
              <p className="text-muted-foreground/60 text-xs">
                在菜谱详情页点击收藏按钮即可加入收藏
              </p>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="space-y-6">
            {/* Today's Recommendation — only in all-recipes mode */}
            {featuredRecipe && (
              <section>
                <p className="text-xs font-medium text-muted-foreground/70 mb-2.5 px-0.5">
                  ✨ 今日推荐
                </p>
                <FeaturedRecipeCard recipe={featuredRecipe} />
              </section>
            )}

            {/* Recipe list */}
            <section>
              <p className="text-xs font-medium text-muted-foreground/70 mb-2.5 px-0.5">
                {showFavorites
                  ? `❤️ 我的收藏 · ${displayedRecipes.length} 道`
                  : `全部菜谱 · ${displayedRecipes.length} 道`}
              </p>
              <div className="grid gap-4">
                {displayedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
