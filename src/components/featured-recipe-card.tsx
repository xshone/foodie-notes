import { ClockIcon, HeartIcon, FlameIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type FeaturedRecipeCardProps = {
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
  }
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-500 text-white",
  medium: "bg-amber-500 text-white",
  hard: "bg-rose-500 text-white",
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "简单",
  medium: "中等",
  hard: "高难",
}

export function FeaturedRecipeCard({ recipe }: FeaturedRecipeCardProps) {
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="relative h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-[0.98]">
        {/* Background image or default placeholder */}
        <div className="absolute inset-0">
          {recipe.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover scale-[1.05]"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-amber-200 via-orange-100 to-yellow-200 dark:from-amber-900/60 dark:via-orange-900/50 dark:to-yellow-900/60 flex items-center justify-center">
              <span className="text-9xl opacity-30 select-none">🍽️</span>
            </div>
          )}
        </div>

        {/* Top-to-bottom gradient for depth */}
        <div className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/65" />

        {/* Vignette — feathers & darkens edges */}
        <div className="absolute inset-0 shadow-[inset_0_0_80px_22px_rgba(0,0,0,0.45)]" />

        {/* Favorite indicator */}
        {recipe.isFavorite && (
          <div className="absolute top-3 right-3 drop-shadow-lg">
            <HeartIcon className="size-5 fill-rose-400 text-rose-400" />
          </div>
        )}

        {/* Frosted glass panel */}
        <div className="absolute bottom-0 left-0 right-0 backdrop-blur-xl bg-black/30 px-4 py-3.5 border-t border-white/10">
          <h2
            className="font-bold text-xl text-white leading-tight mb-1"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.9)" }}
          >
            {recipe.title}
          </h2>
          {recipe.description && (
            <p className="text-xs text-white/70 line-clamp-1 mb-2.5">{recipe.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-1.5">
            {recipe.category && (
              <span className="text-xs text-white/85 bg-white/15 rounded-full px-2 py-0.5 leading-none">
                {recipe.category}
              </span>
            )}
            {recipe.difficulty && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium leading-none",
                  DIFFICULTY_COLORS[recipe.difficulty] ?? "bg-white/20 text-white",
                )}
              >
                <FlameIcon className="size-3" />
                {DIFFICULTY_LABELS[recipe.difficulty] ?? recipe.difficulty}
              </span>
            )}
            {totalTime > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-white/70 leading-none">
                <ClockIcon className="size-3" />
                {totalTime} 分钟
              </span>
            )}
            {recipe.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-white/50 leading-none">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
