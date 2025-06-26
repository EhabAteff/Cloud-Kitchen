"use client"

import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [items])

  const addItem = (item) => {
    setItems((prevItems) => {
      // Check if item already exists with same customizations
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && JSON.stringify(i.customizations) === JSON.stringify(item.customizations),
      )

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        const existingItem = updatedItems[existingItemIndex]
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
          totalPrice: (existingItem.quantity + item.quantity) * existingItem.price,
        }
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, item]
      }
    })
  }

  const updateItemQuantity = (item, quantity) => {
    if (quantity < 1) {
      removeItem(item)
      return
    }

    setItems((prevItems) =>
      prevItems.map((i) => {
        if (i.id === item.id && JSON.stringify(i.customizations) === JSON.stringify(item.customizations)) {
          return {
            ...i,
            quantity,
            totalPrice: quantity * i.price,
          }
        }
        return i
      }),
    )
  }

  const removeItem = (item) => {
    setItems((prevItems) =>
      prevItems.filter(
        (i) => !(i.id === item.id && JSON.stringify(i.customizations) === JSON.stringify(item.customizations)),
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
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
