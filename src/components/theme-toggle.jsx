'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const root = document.documentElement
    const initial = localStorage.getItem('theme') || 'light'
    setTheme(initial)
    root.classList.toggle('dark', initial === 'dark')
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    root.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl border border-border hover:bg-muted transition"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
