import { RecipeForm } from "@/components/recipe-form"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "新建菜谱 | Foodie Notes",
}

export default function NewRecipePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/recipes">
              <ArrowLeftIcon className="size-4" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold">记录新菜谱</h1>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <RecipeForm />
      </main>
    </div>
  )
}
