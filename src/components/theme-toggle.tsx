"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { SunIcon, MoonIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="size-9" aria-label="切换主题" disabled />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9"
      aria-label={isDark ? "切换到明亮模式" : "切换到暗黑模式"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </Button>
  )
}
