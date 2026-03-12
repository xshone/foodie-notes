"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createRecipe, type IngredientItem, type StepItem } from "@/actions/recipe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, TrashIcon, XIcon } from "lucide-react"

const CATEGORIES = ["家常菜", "早餐", "汤粥", "烘焙甜点", "凉菜", "火锅", "西餐", "饮品", "其他"]
const DIFFICULTIES = [
  { value: "easy", label: "简单" },
  { value: "medium", label: "中等" },
  { value: "hard", label: "高难" },
]

export function RecipeForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [servings, setServings] = useState("")
  const [prepTime, setPrepTime] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [notes, setNotes] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { name: "", amount: "", unit: "" },
  ])
  const [steps, setSteps] = useState<StepItem[]>([{ order: 1, text: "" }])

  const addTag = () => {
    const val = tagInput.trim()
    if (val && !tags.includes(val)) {
      setTags([...tags, val])
    }
    setTagInput("")
  }

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag))

  const addIngredient = () => setIngredients([...ingredients, { name: "", amount: "", unit: "" }])

  const updateIngredient = (index: number, field: keyof IngredientItem, value: string) => {
    setIngredients(ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)))
  }

  const removeIngredient = (index: number) =>
    setIngredients(ingredients.filter((_, i) => i !== index))

  const addStep = () => setSteps([...steps, { order: steps.length + 1, text: "" }])

  const updateStep = (index: number, text: string) =>
    setSteps(steps.map((s, i) => (i === index ? { ...s, text } : s)))

  const removeStep = (index: number) =>
    setSteps(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 })))

  const handleSubmit = () => {
    if (!title.trim()) return

    startTransition(async () => {
      await createRecipe({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
        difficulty: difficulty || undefined,
        servings: servings ? parseInt(servings) : undefined,
        prepTime: prepTime ? parseInt(prepTime) : undefined,
        cookTime: cookTime ? parseInt(cookTime) : undefined,
        notes: notes.trim() || undefined,
        tags,
        ingredients: ingredients.filter((i) => i.name.trim()),
        steps: steps.filter((s) => s.text.trim()),
      })
      router.push("/recipes")
    })
  }

  return (
    <div className="space-y-6 pb-10">
      {/* 基本信息 */}
      <section className="space-y-4">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          基本信息
        </h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="title">菜名 *</Label>
            <Input
              id="title"
              placeholder="例：红烧肉、番茄炒蛋"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">简介</Label>
            <Textarea
              id="description"
              placeholder="一两句话描述这道菜的特点或故事..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 resize-none"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>分类</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>难度</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="选择难度" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="servings">份量 (人)</Label>
              <Input
                id="servings"
                type="number"
                min={1}
                placeholder="2"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="prepTime">备料 (分钟)</Label>
              <Input
                id="prepTime"
                type="number"
                min={0}
                placeholder="10"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cookTime">烹饪 (分钟)</Label>
              <Input
                id="cookTime"
                type="number"
                min={0}
                placeholder="30"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* 原料 */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          食材
        </h2>
        <div className="space-y-2">
          {ingredients.map((ing, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="食材名"
                value={ing.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="用量"
                value={ing.amount}
                onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                className="w-20"
              />
              <Input
                placeholder="单位"
                value={ing.unit}
                onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                className="w-16"
              />
              {ingredients.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeIngredient(index)}
                >
                  <TrashIcon className="size-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addIngredient}
          className="w-full"
        >
          <PlusIcon className="size-4" />
          添加食材
        </Button>
      </section>

      <Separator />

      {/* 步骤 */}
      <section className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          步骤
        </h2>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="shrink-0 mt-2.5 size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {step.order}
              </span>
              <Textarea
                placeholder={`第 ${step.order} 步...`}
                value={step.text}
                onChange={(e) => updateStep(index, e.target.value)}
                className="flex-1 resize-none"
                rows={2}
              />
              {steps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="mt-1.5"
                  onClick={() => removeStep(index)}
                >
                  <TrashIcon className="size-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addStep} className="w-full">
          <PlusIcon className="size-4" />
          添加步骤
        </Button>
      </section>

      <Separator />

      {/* 标签 & 备注 */}
      <section className="space-y-4">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          标签 & 备注
        </h2>
        <div>
          <Label>标签</Label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="输入标签后按回车"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addTag()
                }
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={addTag}>
              添加
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-foreground">
                    <XIcon className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="notes">备注 / 小贴士</Label>
          <Textarea
            id="notes"
            placeholder="火候控制、食材替换方案、特别技巧..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 resize-none"
            rows={3}
          />
        </div>
      </section>

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        disabled={isPending || !title.trim()}
      >
        {isPending ? "保存中..." : "保存菜谱"}
      </Button>
    </div>
  )
}
