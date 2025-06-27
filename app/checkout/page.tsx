"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, CreditCard, MapPin } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useOrders } from "@/hooks/use-orders"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const { placeOrder } = useOrders()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deliveryType, setDeliveryType] = useState("delivery")
  const formRef = useRef<HTMLFormElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
    instructions: "",
  })

  const subtotal = items.reduce((total, item) => total + item.totalPrice, 0)
  const deliveryFee = deliveryType === "delivery" ? 3.99 : 0
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + deliveryFee + tax

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create order data based on delivery type
      let orderData

      if (deliveryType === "delivery") {
        orderData = {
          items: items,
          totalAmount: total,
          type: "delivery",
          estimatedTime: "35-45 minutes",
          customerInfo: {
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            address: {
              street: formData.address,
              city: formData.city,
              zipCode: formData.zipCode,
            },
          },
        }
      } else {
        orderData = {
          items: items,
          totalAmount: total,
          type: "pickup",
          estimatedTime: "20-30 minutes",
          customerInfo: {
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
          },
          pickupInfo: {
            location: "123 Kitchen Street, Foodville, FD 12345",
            instructions: "Please come to the pickup counter and show your order number.",
          },
        }
      }

      // Place the order
      const orderId = placeOrder(orderData)

      // Clear the cart
      clearCart()

      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderId} has been placed.`,
      })

      // Redirect to track page
      router.push(`/track?order=${orderId}`)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error placing order",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handlePlaceOrder = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
    }
  }

  if (items.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some items to your cart before checking out</p>
        <Button asChild>
          <Link href="/menu">Browse Menu</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <Button variant="ghost" className="mb-6 gap-1" onClick={() => router.back()}>
        <ChevronLeft className="h-4 w-4" /> Back to Cart
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          <form ref={formRef} onSubmit={handleSubmit}>
            <Tabs defaultValue="delivery" value={deliveryType} onValueChange={setDeliveryType} className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
                <TabsTrigger value="pickup">Pickup</TabsTrigger>
              </TabsList>
              <TabsContent value="delivery" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={formData.firstName} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={formData.lastName} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" value={formData.address} onChange={handleInputChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={formData.city} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input id="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                      <Input id="instructions" value={formData.instructions} onChange={handleInputChange} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pickup" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pickup Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={formData.firstName} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={formData.lastName} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-2">Pickup Location</h3>
                      <p>123 Kitchen Street, Foodville, FD 12345</p>
                      <p className="text-sm text-muted-foreground mt-1">Open 10:00 AM - 10:00 PM</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1">
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1">
                      PayPal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1">
                      {deliveryType === "delivery" ? "Cash on Delivery" : "Cash on Pickup"}
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input id="nameOnCard" required />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="lg:hidden">
              <OrderSummary
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                tax={tax}
                total={total}
                isSubmitting={isSubmitting}
                deliveryType={deliveryType}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </form>
        </div>

        <div className="hidden lg:block">
          <OrderSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            tax={tax}
            total={total}
            isSubmitting={isSubmitting}
            deliveryType={deliveryType}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  )
}

function OrderSummary({ subtotal, deliveryFee, tax, total, isSubmitting, deliveryType, onPlaceOrder }) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {deliveryType === "delivery" && (
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onPlaceOrder} disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </CardFooter>
    </Card>
  )
}
