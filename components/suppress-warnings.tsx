"use client"

import { useEffect } from "react"

export function SuppressWarnings() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const originalWarn = console.warn
      console.warn = (...args) => {
        const message = args.join(" ")
        // Skip params-related warnings
        if (message.includes("param property was accessed directly") || message.includes("params is now a Promise")) {
          return
        }
        originalWarn.apply(console, args)
      }

      // Cleanup function to restore original console.warn
      return () => {
        console.warn = originalWarn
      }
    }
  }, [])

  return null
}
