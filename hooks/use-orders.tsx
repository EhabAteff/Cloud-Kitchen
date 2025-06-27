"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type DeliveryOrderStatus = "confirmed" | "preparing" | "ready" | "delivering" | "delivered"
export type PickupOrderStatus = "confirmed" | "preparing" | "ready_for_pickup" | "picked_up"
export type OrderStatus = DeliveryOrderStatus | PickupOrderStatus

export type OrderType = "delivery" | "pickup"

export type Order = {
  id: string
  items: any[]
  totalAmount: number
  status: OrderStatus
  type: OrderType
  estimatedTime: string
  placedAt: string
  completed: boolean
  customerInfo: {
    name: string
    phone: string
    address?: {
      street: string
      apartment?: string
      city: string
      zipCode: string
    }
  }
  pickupInfo?: {
    location: string
    instructions: string
  }
}

type OrderContextType = {
  orders: Order[]
  placeOrder: (orderData: Omit<Order, "id" | "status" | "placedAt" | "completed">) => string
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  getOrderById: (orderId: string) => Order | undefined
  isHydrated: boolean
}

const OrderContext = createContext<OrderContextType | null>(null)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load orders from localStorage on mount
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("orders")

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      }
    } catch (error) {
      console.error("Failed to load orders from localStorage:", error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save orders to localStorage when they change (but only after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("orders", JSON.stringify(orders))
      } catch (error) {
        console.error("Failed to save orders to localStorage:", error)
      }
    }
  }, [orders, isHydrated])

  const placeOrder = (orderData: Omit<Order, "id" | "status" | "placedAt" | "completed">) => {
    // Generate a random order ID (in a real app, this would come from the backend)
    const orderId = Math.floor(100000 + Math.random() * 900000).toString()

    // Set initial status based on order type
    const initialStatus: OrderStatus = "confirmed"

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: initialStatus,
      placedAt: new Date().toISOString(),
      completed: false,
    }

    setOrders((prev) => [...prev, newOrder])

    return orderId
  }

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    // Check if the order is being marked as completed
    const isCompleted = status === "delivered" || status === "picked_up"

    // Update orders
    setOrders((prev) => {
      return prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status,
            completed: isCompleted,
            estimatedTime: getEstimatedTimeByStatus(status, order.type),
          }
        }
        return order
      })
    })
  }

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId)
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        getOrderById,
        isHydrated,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}

// Helper function to get estimated time based on status and order type
function getEstimatedTimeByStatus(status: OrderStatus, type: OrderType): string {
  if (type === "delivery") {
    switch (status) {
      case "confirmed":
        return "35-45 minutes"
      case "preparing":
        return "25-35 minutes"
      case "ready":
        return "15-20 minutes"
      case "delivering":
        return "5-10 minutes"
      case "delivered":
        return "Delivered"
      default:
        return "35-45 minutes"
    }
  } else {
    // Pickup times are generally shorter
    switch (status) {
      case "confirmed":
        return "20-30 minutes"
      case "preparing":
        return "10-20 minutes"
      case "ready_for_pickup":
        return "Ready for pickup"
      case "picked_up":
        return "Picked up"
      default:
        return "20-30 minutes"
    }
  }
}
