import type { HtmlEscapedString } from 'hono/utils/html'
import { cn } from '../lib/utils'

export type TechName = 'cloudflare' | 'hono' | 'typescript' | 'nodejs' | 'bun' | 'react' | 'nextjs' | 'golang' | 'rust' | 'cloudflare-workers' | 'docker'


export const TechIcon = ({ name, size = 20, className = "" }: { name: TechName, size?: number, className?: string }) => {
  const path = `/src/assets/common/tech/${name}.svg`

  // Visual weight balancing
  const scales: Record<string, string> = {
    nextjs: "scale-110",
    typescript: "scale-105",
    golang: "scale-125",
    rust: "scale-110",
    docker: "scale-110"
  }

  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <img
        src={path}
        alt={name}
        className={cn(
          "max-w-full max-h-full object-contain transition-all duration-300",
          "grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:cursor-pointer",
          "dark:grayscale-0 dark:opacity-60 dark:hover:opacity-100 dark:brightness-125",


          name === 'nextjs' && "dark:invert",
          scales[name] || "scale-100",
          className
        )}
      />
    </div>
  )
}


