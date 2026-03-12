import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { RecipeDetail } from "@/components/recipe-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const recipe = await prisma.recipe.findUnique({ where: { id }, select: { title: true } })
  return { title: recipe ? `${recipe.title} | Foodie Notes` : "菜谱详情 | Foodie Notes" }
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const recipe = await prisma.recipe.findUnique({ where: { id } })

  if (!recipe) notFound()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/recipes">
              <ArrowLeftIcon className="size-4" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold truncate">{recipe.title}</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <RecipeDetail recipe={recipe} />
      </main>
    </div>
  )
}
