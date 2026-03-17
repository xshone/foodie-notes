"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  deleteRecipe,
  toggleFavorite,
  updateRecipe,
  type IngredientItem,
  type StepItem,
} from "@/actions/recipe"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ClockIcon, HeartIcon, TrashIcon, FlameIcon, UsersIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageUpload } from "@/components/image-upload"

type Recipe = {
  id: string
  title: string
  description: string | null
  category: string | null
  servings: number | null
  prepTime: number | null
  cookTime: number | null
  difficulty: string | null
  ingredients: unknown
  steps: unknown
  tags: string[]
  imageUrl: string | null
  notes: string | null
  isFavorite: boolean
  createdAt: Date
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "简单",
  medium: "中等",
  hard: "高难",
}

export function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isFav, setIsFav] = useState(recipe.isFavorite)
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl ?? "")

  const ingredients = recipe.ingredients as IngredientItem[]
  const steps = recipe.steps as StepItem[]
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)

  const handleFavorite = () => {
    const next = !isFav
    setIsFav(next)
    startTransition(() => toggleFavorite(recipe.id, next))
  }

  const handleDelete = () => {
    if (!confirm("确定要删除这道菜谱吗？")) return
    startTransition(async () => {
      await deleteRecipe(recipe.id)
      router.push("/recipes")
    })
  }

  const handleImageChange = (base64: string) => {
    setImageUrl(base64)
    startTransition(() => updateRecipe(recipe.id, { imageUrl: base64 || undefined }))
  }

  return (
    <article className="space-y-6 pb-10">
      {/* Hero image + upload */}
      <div className="-mx-4">
        {imageUrl ? (
          <div className="relative aspect-video overflow-hidden bg-secondary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={recipe.title} className="size-full object-cover" />
          </div>
        ) : null}
        <div className={cn("px-4", imageUrl ? "pt-3" : "pt-0")}>
          <ImageUpload value={imageUrl} onChange={handleImageChange} />
        </div>
      </div>

      {/* Title & actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{recipe.title}</h1>
          {recipe.description && (
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {recipe.description}
            </p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" size="icon-sm" onClick={handleFavorite} disabled={isPending}>
            <HeartIcon className={cn("size-5", isFav && "fill-rose-500 text-rose-500")} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={handleDelete} disabled={isPending}>
            <TrashIcon className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap gap-2">
        {recipe.category && <Badge variant="secondary">{recipe.category}</Badge>}
        {recipe.difficulty && (
          <Badge variant="outline">
            <FlameIcon className="size-3 mr-1" />
            {DIFFICULTY_LABELS[recipe.difficulty] ?? recipe.difficulty}
          </Badge>
        )}
        {recipe.servings && (
          <Badge variant="outline">
            <UsersIcon className="size-3 mr-1" />
            {recipe.servings} 人份
          </Badge>
        )}
        {totalTime > 0 && (
          <Badge variant="outline">
            <ClockIcon className="size-3 mr-1" />
            {totalTime} 分钟
          </Badge>
        )}
      </div>

      {/* Time detail */}
      {(recipe.prepTime || recipe.cookTime) && (
        <div className="grid grid-cols-2 gap-3">
          {recipe.prepTime && (
            <div className="rounded-xl bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">备料时间</p>
              <p className="text-lg font-semibold mt-0.5">
                {recipe.prepTime}
                <span className="text-xs font-normal ml-0.5">分钟</span>
              </p>
            </div>
          )}
          {recipe.cookTime && (
            <div className="rounded-xl bg-secondary p-3 text-center">
              <p className="text-xs text-muted-foreground">烹饪时间</p>
              <p className="text-lg font-semibold mt-0.5">
                {recipe.cookTime}
                <span className="text-xs font-normal ml-0.5">分钟</span>
              </p>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Ingredients */}
      {ingredients?.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">食材清单</h2>
          <ul className="space-y-2">
            {ingredients.map((ing, i) => (
              <li key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm">{ing.name}</span>
                <span className="text-sm text-muted-foreground">
                  {ing.amount} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ingredients?.length > 0 && steps?.length > 0 && <Separator />}

      {/* Steps */}
      {steps?.length > 0 && (
        <section>
          <h2 className="font-semibold mb-4">烹饪步骤</h2>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 mt-0.5 size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {step.order ?? i + 1}
                </span>
                <p className="text-sm leading-relaxed pt-0.5">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Notes */}
      {recipe.notes && (
        <>
          <Separator />
          <section>
            <h2 className="font-semibold mb-2">备注 & 小贴士</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {recipe.notes}
            </p>
          </section>
        </>
      )}

      {/* Delete */}
      <Separator />
      <div className="pt-2">
        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/30"
          onClick={handleDelete}
          disabled={isPending}
        >
          <TrashIcon className="size-4 mr-2" />
          删除这道菜谱
        </Button>
      </div>
    </article>
  )
}
