"use client"

import { useRef, useState } from "react"
import { ImageIcon, ImagePlusIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Compress & resize to stay well under 1 MB
// Max edge: 1200px, JPEG quality: 0.82
const MAX_EDGE = 1200
const QUALITY = 0.82

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)

      const { naturalWidth: w, naturalHeight: h } = img
      const scale = Math.min(1, MAX_EDGE / Math.max(w, h))
      const cw = Math.round(w * scale)
      const ch = Math.round(h * scale)

      const canvas = document.createElement("canvas")
      canvas.width = cw
      canvas.height = ch
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Canvas not supported"))
      ctx.drawImage(img, 0, 0, cw, ch)
      resolve(canvas.toDataURL("image/jpeg", QUALITY))
    }
    img.onerror = reject
    img.src = url
  })
}

type ImageUploadProps = {
  value: string        // current base64 or empty string
  onChange: (base64: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return
    setLoading(true)
    try {
      const base64 = await compressImage(file)
      onChange(base64)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        /* Preview with replace / clear */
        <div className="relative group rounded-xl overflow-hidden bg-muted h-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="菜谱图片" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs bg-white/90 hover:bg-white text-gray-800 rounded-full px-3 py-1.5 font-medium transition-colors disabled:opacity-50"
            >
              <ImagePlusIcon className="size-3.5" />
              {loading ? "处理中...": "更换图片"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={loading}
              className="flex items-center gap-1 text-xs bg-white/90 hover:bg-white text-rose-600 rounded-full px-2.5 py-1.5 font-medium transition-colors disabled:opacity-50"
            >
              <XIcon className="size-3.5" />
              移除
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          disabled={loading}
          className={cn(
            "w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors text-muted-foreground disabled:opacity-60",
            dragging
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <ImageIcon className="size-7 opacity-50" />
          <div className="text-center">
            {loading ? (
              <p className="text-sm font-medium">压缩中...</p>
            ) : (
              <>
                <p className="text-sm font-medium">点击上传图片</p>
                <p className="text-xs opacity-60 mt-0.5">或将图片拖放至此处</p>
              </>
            )}
          </div>
        </button>
      )}
    </div>
  )
}
