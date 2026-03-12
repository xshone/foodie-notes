import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ClockIcon, HeartIcon, FlameIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type RecipeCardProps = {
  recipe: {
    id: string
    title: string
    description: string | null
    category: string | null
    difficulty: string | null
    prepTime: number | null
    cookTime: number | null
    tags: string[]
    imageUrl: string | null
    isFavorite: boolean
    createdAt: Date
  }
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "简单",
  medium: "中等",
  hard: "高难",
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99] transition-transform">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold text-base truncate">{recipe.title}</h2>
                {recipe.isFavorite && (
                  <HeartIcon className="shrink-0 size-4 fill-rose-500 text-rose-500" />
                )}
              </div>

              {recipe.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {recipe.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {recipe.category && (
                  <Badge variant="secondary" className="text-xs">
                    {recipe.category}
                  </Badge>
                )}
                {recipe.difficulty && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      DIFFICULTY_COLORS[recipe.difficulty] ??
                        "bg-secondary text-secondary-foreground",
                    )}
                  >
                    <FlameIcon className="size-3" />
                    {DIFFICULTY_LABELS[recipe.difficulty] ?? recipe.difficulty}
                  </span>
                )}
                {totalTime > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <ClockIcon className="size-3" />
                    {totalTime} 分钟
                  </span>
                )}
              </div>

              {recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {recipe.imageUrl && (
              <div className="shrink-0 size-20 rounded-lg overflow-hidden bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={recipe.imageUrl} alt={recipe.title} className="size-full object-cover" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
