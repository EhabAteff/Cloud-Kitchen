"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Clock, Package, Truck, Phone, ShoppingBag, MapPin, Store } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useOrders, type OrderStatus, type Order, type OrderType } from "@/hooks/use-orders"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { orders, getOrderById, updateOrderStatus, isHydrated } = useOrders()
  const orderIdFromParams = searchParams.get("order")
  const { toast } = useToast()

  // State for selected order
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orderIdFromParams)

  // State for order status simulation
  const [simulatingOrders, setSimulatingOrders] = useState<Record<string, boolean>>({})
  const [orderSteps, setOrderSteps] = useState<Record<string, number>>({})

  // Memoize filtered orders to prevent re-renders
  const activeOrders = useMemo(() => orders.filter((order) => !order.completed), [orders])
  const completedOrders = useMemo(() => orders.filter((order) => order.completed), [orders])

  // Get the selected order
  const selectedOrder = selectedOrderId ? getOrderById(selectedOrderId) : null

  // Initialize selected order when component mounts or URL changes
  useEffect(() => {
    if (orderIdFromParams) {
      setSelectedOrderId(orderIdFromParams)
    } else if (activeOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(activeOrders[0].id)
    }
  }, [orderIdFromParams, activeOrders, selectedOrderId])

  // Initialize order steps based on their status - always call this hook
  useEffect(() => {
    if (!isHydrated) return

    const steps: Record<string, number> = {}

    orders.forEach((order) => {
      steps[order.id] = getStepFromStatus(order.status, order.type)
    })

    setOrderSteps(steps)
  }, [orders, isHydrated])

  // Simulate order progress - always call this hook
  useEffect(() => {
    if (!isHydrated) return

    // Create an object to store all timers so we can clean them up
    const timers: Record<string, NodeJS.Timeout> = {}

    // For each order that's being simulated
    Object.entries(simulatingOrders).forEach(([orderId, isSimulating]) => {
      if (!isSimulating) return

      const order = orders.find((o) => o.id === orderId)
      if (!order || order.completed) return

      const currentStep = orderSteps[orderId] || 1
      const maxStep = order.type === "delivery" ? 5 : 4

      if (currentStep >= maxStep) return

      timers[orderId] = setTimeout(() => {
        const nextStep = currentStep + 1

        // Update the step in our local state
        setOrderSteps((prev) => ({
          ...prev,
          [orderId]: nextStep,
        }))

        // Update the order status in the context
        updateOrderStatus(orderId, getStatusFromStep(nextStep, order.type))

        // If this is the final step, show a toast
        if (nextStep === maxStep) {
          const message = order.type === "delivery" ? "Order Delivered!" : "Order Picked Up!"

          toast({
            title: message,
            description: `Order #${orderId} has been ${order.type === "delivery" ? "delivered" : "picked up"}.`,
          })

          // Stop simulating this order
          setSimulatingOrders((prev) => ({
            ...prev,
            [orderId]: false,
          }))
        }
      }, 10000) // Update every 10 seconds for demo purposes
    })

    // Clean up all timers on unmount
    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer))
    }
  }, [simulatingOrders, orders, orderSteps, toast, updateOrderStatus, isHydrated])

  // Start simulation for a specific order
  const startSimulation = (orderId: string) => {
    setSimulatingOrders((prev) => ({
      ...prev,
      [orderId]: true,
    }))
  }

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // If no orders exist, show empty state
  if (orders.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <Alert>
          <AlertTitle>No orders</AlertTitle>
          <AlertDescription>
            You don't have any orders to track. Place an order to see tracking information.
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href="/menu">Browse Menu</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Track Your Orders</h1>

      <Tabs defaultValue={activeOrders.length > 0 ? "active" : "completed"} className="mb-8">
        <TabsList>
          <TabsTrigger value="active">Active Orders ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Orders ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrderId === order.id}
                  onSelect={() => {
                    setSelectedOrderId(order.id)
                    router.push(`/track?order=${order.id}`, { scroll: false })
                  }}
                  step={orderSteps[order.id] || getStepFromStatus(order.status, order.type)}
                  isSimulating={!!simulatingOrders[order.id]}
                  onStartSimulation={() => startSimulation(order.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't have any active orders at the moment.</p>
            </div>
          )}

          {selectedOrder && !selectedOrder.completed && (
            <OrderTrackingDetail
              order={selectedOrder}
              currentStep={orderSteps[selectedOrder.id] || getStepFromStatus(selectedOrder.status, selectedOrder.type)}
            />
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {completedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isSelected={selectedOrderId === order.id}
                  onSelect={() => {
                    setSelectedOrderId(order.id)
                    router.push(`/track?order=${order.id}`, { scroll: false })
                  }}
                  step={order.type === "delivery" ? 5 : 4}
                  isSimulating={false}
                  onStartSimulation={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't have any completed orders yet.</p>
            </div>
          )}

          {selectedOrder && selectedOrder.completed && (
            <OrderTrackingDetail order={selectedOrder} currentStep={selectedOrder.type === "delivery" ? 5 : 4} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OrderCard({
  order,
  isSelected,
  onSelect,
  step,
  isSimulating,
  onStartSimulation,
}: {
  order: Order
  isSelected: boolean
  onSelect: () => void
  step: number
  isSimulating: boolean
  onStartSimulation: () => void
}) {
  const maxSteps = order.type === "delivery" ? 4 : 3
  const progressPercentage = ((step - 1) / maxSteps) * 100

  return (
    <Card className={`overflow-hidden transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(order.placedAt).toLocaleDateString()} at {formatTime(order.placedAt)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusLabel(order.status)}</Badge>
            <Badge variant="outline">{order.type === "delivery" ? "Delivery" : "Pickup"}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-2">
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <p className="text-sm font-medium">Estimated time: {order.estimatedTime}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {order.items.length} items • ${order.totalAmount.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={onSelect}>
          Track Details
        </Button>
        {!isSimulating && !order.completed && step < (order.type === "delivery" ? 5 : 4) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onStartSimulation()
            }}
          >
            Simulate
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

function OrderTrackingDetail({ order, currentStep }: { order: Order; currentStep: number }) {
  const maxSteps = order.type === "delivery" ? 4 : 3
  const progressPercentage = ((currentStep - 1) / maxSteps) * 100
  const isCompleted = order.type === "delivery" ? currentStep === 5 : currentStep === 4

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Order #{order.id} Status</CardTitle>
            <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusLabel(order.status)}</Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">
                      {order.type === "delivery" ? "Order Delivered!" : "Order Picked Up!"}
                    </h3>
                    <p className="text-sm text-green-700">
                      {order.type === "delivery"
                        ? "Your order has been successfully delivered. Enjoy your meal!"
                        : "Your order has been successfully picked up. Enjoy your meal!"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <OrderStep
                icon={<CheckCircle2 className="h-6 w-6" />}
                title="Order Confirmed"
                description="Your order has been received"
                time={currentStep >= 1 ? formatTime(order.placedAt) : ""}
                isCompleted={currentStep >= 1}
                isActive={currentStep === 1}
              />

              <OrderStep
                icon={<Clock className="h-6 w-6" />}
                title="Preparing Your Food"
                description="Our chefs are preparing your meal"
                time={currentStep >= 2 ? getTimeFromNow(-15) : ""}
                isCompleted={currentStep >= 2}
                isActive={currentStep === 2}
              />

              {order.type === "delivery" ? (
                <>
                  <OrderStep
                    icon={<Package className="h-6 w-6" />}
                    title="Ready for Delivery"
                    description="Your order is packed and ready"
                    time={currentStep >= 3 ? getTimeFromNow(-10) : ""}
                    isCompleted={currentStep >= 3}
                    isActive={currentStep === 3}
                  />

                  <OrderStep
                    icon={<Truck className="h-6 w-6" />}
                    title="On the Way"
                    description="Your order is on the way to you"
                    time={currentStep >= 4 ? getTimeFromNow(-5) : ""}
                    isCompleted={currentStep >= 4}
                    isActive={currentStep === 4}
                  />
                </>
              ) : (
                <>
                  <OrderStep
                    icon={<Store className="h-6 w-6" />}
                    title="Ready for Pickup"
                    description="Your order is ready to be picked up"
                    time={currentStep >= 3 ? getTimeFromNow(-10) : ""}
                    isCompleted={currentStep >= 3}
                    isActive={currentStep === 3}
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">
                        {item.name} × {item.quantity}
                      </p>
                      {item.customizations && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {item.customizations.addOns && item.customizations.addOns.length > 0 && (
                            <p>Add-ons: {item.customizations.addOns.map((addOn) => addOn.name).join(", ")}</p>
                          )}
                          {item.customizations.specialInstructions && (
                            <p>Notes: {item.customizations.specialInstructions}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>{order.type === "delivery" ? "Delivery Information" : "Pickup Information"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Estimated Time</h3>
              <p>{order.estimatedTime}</p>
            </div>

            {order.type === "delivery" ? (
              <>
                <div>
                  <h3 className="font-semibold">Delivery Address</h3>
                  <p>{order.customerInfo.address?.street}</p>
                  {order.customerInfo.address?.apartment && <p>{order.customerInfo.address.apartment}</p>}
                  <p>
                    {order.customerInfo.address?.city}, {order.customerInfo.address?.zipCode}
                  </p>
                </div>

                {currentStep >= 4 && !order.completed && <ContactDriverButton />}
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold">Pickup Location</h3>
                  <p>{order.pickupInfo?.location}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Pickup Instructions</h3>
                  <p>{order.pickupInfo?.instructions}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Store Information</h3>
                  </div>
                  <p className="text-sm">Open 10:00 AM - 10:00 PM</p>
                  <p className="text-sm">Phone: (+20) 111-0011111</p>
                </div>
              </>
            )}

            <div>
              <h3 className="font-semibold">Contact</h3>
              <p>{order.customerInfo.name}</p>
              <p>{order.customerInfo.phone}</p>
            </div>
          </CardContent>
        </Card>
        {isCompleted && (
          <div className="mt-6">
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/menu">Order Again</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderStep({ icon, title, description, time, isCompleted, isActive }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`rounded-full p-2 ${
          isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className={`font-semibold ${isActive ? "text-primary" : ""}`}>{title}</h3>
          <span className="text-sm text-muted-foreground">{isCompleted ? time : ""}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ContactDriverButton() {
  const [showNumber, setShowNumber] = useState(false)

  return (
    <div className="space-y-2">
      {showNumber ? (
        <div className="p-3 bg-muted rounded-lg text-center">
          <p className="font-medium">Driver's Phone</p>
          <p className="text-primary">+20 1100011111</p>
        </div>
      ) : (
        <Button className="w-full flex items-center justify-center gap-2" onClick={() => setShowNumber(true)}>
          <Phone className="h-4 w-4" />
          Contact Driver
        </Button>
      )}
    </div>
  )
}

// Helper function to format the time
function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Helper function to get a time relative to now
function getTimeFromNow(minutesOffset: number): string {
  const date = new Date()
  date.setMinutes(date.getMinutes() + minutesOffset)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Helper function to get status badge variant
function getStatusBadgeVariant(status: OrderStatus): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "confirmed":
      return "secondary"
    case "preparing":
      return "secondary"
    case "ready":
    case "ready_for_pickup":
      return "outline"
    case "delivering":
      return "default"
    case "delivered":
    case "picked_up":
      return "default"
    default:
      return "outline"
  }
}

// Helper function to get status label
function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case "confirmed":
      return "Confirmed"
    case "preparing":
      return "Preparing"
    case "ready":
      return "Ready"
    case "ready_for_pickup":
      return "Ready for Pickup"
    case "delivering":
      return "On the Way"
    case "delivered":
      return "Delivered"
    case "picked_up":
      return "Picked Up"
    default:
      return "Processing"
  }
}

// Map order status to step number based on order type
function getStepFromStatus(status: OrderStatus, type: OrderType): number {
  if (type === "delivery") {
    switch (status) {
      case "confirmed":
        return 1
      case "preparing":
        return 2
      case "ready":
        return 3
      case "delivering":
        return 4
      case "delivered":
        return 5
      default:
        return 1
    }
  } else {
    // Pickup order
    switch (status) {
      case "confirmed":
        return 1
      case "preparing":
        return 2
      case "ready_for_pickup":
        return 3
      case "picked_up":
        return 4
      default:
        return 1
    }
  }
}

// Map step number to order status based on order type
function getStatusFromStep(step: number, type: OrderType): OrderStatus {
  if (type === "delivery") {
    switch (step) {
      case 1:
        return "confirmed"
      case 2:
        return "preparing"
      case 3:
        return "ready"
      case 4:
        return "delivering"
      case 5:
        return "delivered"
      default:
        return "confirmed"
    }
  } else {
    // Pickup order
    switch (step) {
      case 1:
        return "confirmed"
      case 2:
        return "preparing"
      case 3:
        return "ready_for_pickup"
      case 4:
        return "picked_up"
      default:
        return "confirmed"
    }
  }
}
