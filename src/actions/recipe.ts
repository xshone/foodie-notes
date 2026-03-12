"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type IngredientItem = {
  name: string
  amount: string
  unit: string
}

export type StepItem = {
  order: number
  text: string
}

export type RecipeFormData = {
  title: string
  description?: string
  category?: string
  servings?: number
  prepTime?: number
  cookTime?: number
  difficulty?: string
  ingredients: IngredientItem[]
  steps: StepItem[]
  tags?: string[]
  imageUrl?: string
  notes?: string
}

export async function createRecipe(data: RecipeFormData) {
  if (!data.title) throw new Error("Recipe title is required")

  await prisma.recipe.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      servings: data.servings,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      difficulty: data.difficulty,
      ingredients: data.ingredients,
      steps: data.steps,
      tags: data.tags ?? [],
      imageUrl: data.imageUrl,
      notes: data.notes,
    },
  })

  revalidatePath("/")
  revalidatePath("/recipes")
}

export async function updateRecipe(id: string, data: Partial<RecipeFormData>) {
  await prisma.recipe.update({
    where: { id },
    data: {
      ...data,
      ingredients: data.ingredients as object,
      steps: data.steps as object,
    },
  })

  revalidatePath("/")
  revalidatePath("/recipes")
  revalidatePath(`/recipes/${id}`)
}

export async function deleteRecipe(id: string) {
  await prisma.recipe.delete({ where: { id } })

  revalidatePath("/")
  revalidatePath("/recipes")
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  await prisma.recipe.update({
    where: { id },
    data: { isFavorite },
  })

  revalidatePath("/")
  revalidatePath("/recipes")
  revalidatePath(`/recipes/${id}`)
}
