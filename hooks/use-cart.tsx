"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  totalPrice: number
  customizations?: {
    addOns?: Array<{ name: string; price: number }>
    specialInstructions?: string
  }
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  totalAmount: number
  totalItems: number
  isHydrated: boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save cart to localStorage when items change (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("cart", JSON.stringify(items))
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error)
      }
    }
  }, [items, isHydrated])

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === newItem.id && JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations),
      )

      if (existingItemIndex > -1) {
        // Item exists, update quantity and recalculate total price
        const updatedItems = [...prevItems]
        const existingItem = updatedItems[existingItemIndex]
        const newQuantity = existingItem.quantity + newItem.quantity

        // Calculate price per item (base price + add-ons)
        const basePrice = existingItem.price
        const addOnsPrice = existingItem.customizations?.addOns?.reduce((total, addOn) => total + addOn.price, 0) || 0
        const pricePerItem = basePrice + addOnsPrice

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: pricePerItem * newQuantity,
        }
        return updatedItems
      } else {
        // New item, add to cart
        return [...prevItems, newItem]
      }
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          // Calculate price per item (base price + add-ons)
          const basePrice = item.price
          const addOnsPrice = item.customizations?.addOns?.reduce((total, addOn) => total + addOn.price, 0) || 0
          const pricePerItem = basePrice + addOnsPrice

          return {
            ...item,
            quantity,
            totalPrice: pricePerItem * quantity,
          }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
