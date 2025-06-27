"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, MapPin, User, Clock, ShoppingBag, Truck } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useOrders } from "@/hooks/use-orders"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { items, totalAmount, clearCart, isHydrated } = useCart()
  const { placeOrder } = useOrders()
  const router = useRouter()
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show empty cart state
  if (items.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some delicious items to your cart before proceeding to checkout.
          </p>
          <Button asChild>
            <Link href="/menu">Browse Menu</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const orderData = {
        items,
        totalAmount,
        type: deliveryType,
        estimatedTime: deliveryType === "delivery" ? "35-45 minutes" : "20-30 minutes",
        customerInfo: {
          name: formData.get("name") as string,
          phone: formData.get("phone") as string,
          ...(deliveryType === "delivery" && {
            address: {
              street: formData.get("street") as string,
              apartment: formData.get("apartment") as string,
              city: formData.get("city") as string,
              zipCode: formData.get("zipCode") as string,
            },
          }),
        },
        ...(deliveryType === "pickup" && {
          pickupInfo: {
            location: "123 Kitchen Street, Cairo, Egypt",
            instructions: (formData.get("pickupInstructions") as string) || "Please ask for your order at the counter",
          },
        }),
      }

      const orderId = placeOrder(orderData)

      // Clear the cart
      clearCart()

      // Show success message
      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderId} has been confirmed.`,
      })

      // Redirect to tracking page
      router.push(`/track?order=${orderId}`)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePlaceOrder = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
    }
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <form ref={formRef} onSubmit={handleSubmit}>
              {/* Delivery Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={deliveryType}
                    onValueChange={(value: "delivery" | "pickup") => setDeliveryType(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Home Delivery</p>
                            <p className="text-sm text-muted-foreground">Delivered to your doorstep</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Free</p>
                            <p className="text-sm text-muted-foreground">35-45 min</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Pickup</p>
                            <p className="text-sm text-muted-foreground">Collect from our kitchen</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Free</p>
                            <p className="text-sm text-muted-foreground">20-30 min</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" placeholder="Enter your full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement
                          target.value = target.value.replace(/[^0-9]/g, "")
                        }}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address (only shown for delivery) */}
              {deliveryType === "delivery" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input id="street" name="street" placeholder="Enter your street address" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apartment">Apartment/Unit (Optional)</Label>
                      <Input id="apartment" name="apartment" placeholder="Apartment, suite, unit, etc." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" placeholder="Enter your city" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input id="zipCode" name="zipCode" placeholder="Enter zip code" required />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pickup Instructions (only shown for pickup) */}
              {deliveryType === "pickup" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Pickup Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-2">Pickup Location</h3>
                      <p className="text-sm">123 Kitchen Street, Cairo, Egypt</p>
                      <p className="text-sm text-muted-foreground">Open 10:00 AM - 10:00 PM</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupInstructions">Special Instructions (Optional)</Label>
                      <Textarea
                        id="pickupInstructions"
                        name="pickupInstructions"
                        placeholder="Any special instructions for pickup..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-medium">Cash on {deliveryType === "delivery" ? "Delivery" : "Pickup"}</p>
                    <p className="text-sm text-muted-foreground">
                      Pay with cash when your order {deliveryType === "delivery" ? "arrives" : "is ready for pickup"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary - Desktop */}
          <div className="hidden md:block">
            <OrderSummary
              items={items}
              totalAmount={totalAmount}
              deliveryType={deliveryType}
              isSubmitting={isSubmitting}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>

        {/* Order Summary - Mobile (Fixed at bottom) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <OrderSummary
            items={items}
            totalAmount={totalAmount}
            deliveryType={deliveryType}
            isSubmitting={isSubmitting}
            onPlaceOrder={handlePlaceOrder}
            isMobile={true}
          />
        </div>

        {/* Spacer for mobile fixed summary */}
        <div className="md:hidden h-32"></div>
      </div>
    </div>
  )
}

function OrderSummary({
  items,
  totalAmount,
  deliveryType,
  isSubmitting,
  onPlaceOrder,
  isMobile = false,
}: {
  items: any[]
  totalAmount: number
  deliveryType: "delivery" | "pickup"
  isSubmitting: boolean
  onPlaceOrder: () => void
  isMobile?: boolean
}) {
  const estimatedTime = deliveryType === "delivery" ? "35-45 minutes" : "20-30 minutes"

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total: ${totalAmount.toFixed(2)}</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {estimatedTime}
          </div>
        </div>
        <Button onClick={onPlaceOrder} disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </div>
    )
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-start text-sm">
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                {item.customizations?.addOns && item.customizations.addOns.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    + {item.customizations.addOns.map((addon) => addon.name).join(", ")}
                  </p>
                )}
              </div>
              <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>Free</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Estimated {deliveryType === "delivery" ? "delivery" : "pickup"}: {estimatedTime}
          </span>
        </div>

        <Button onClick={onPlaceOrder} disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </CardContent>
    </Card>
  )
}
