"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { menuItems } from "@/data/menu-items"

export default function MenuItemPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const router = useRouter()
  const { addItem, isHydrated } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState<Array<{ name: string; price: number }>>([])
  const [specialInstructions, setSpecialInstructions] = useState("")

  // Handle both Promise and regular object params
  const resolvedParams = params instanceof Promise ? use(params) : params

  // Get the item using the resolved params
  const item = menuItems.find((item) => item.id === resolvedParams.id)

  useEffect(() => {
    if (!item && isHydrated) {
      router.push("/menu")
    }
  }, [item, router, isHydrated])

  if (!isHydrated) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!item) {
    return null
  }

  const handleAddOnChange = (addOn: { name: string; price: number }, checked: boolean) => {
    if (checked) {
      setSelectedAddOns([...selectedAddOns, addOn])
    } else {
      setSelectedAddOns(selectedAddOns.filter((a) => a.name !== addOn.name))
    }
  }

  const calculateTotalPrice = () => {
    const basePrice = item.price * quantity
    const addOnsPrice = selectedAddOns.reduce((total, addOn) => total + addOn.price, 0) * quantity
    return basePrice + addOnsPrice
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity,
      totalPrice: calculateTotalPrice(),
      customizations: {
        addOns: selectedAddOns.length > 0 ? selectedAddOns : undefined,
        specialInstructions: specialInstructions || undefined,
      },
    }

    addItem(cartItem)

    toast({
      title: "Added to cart!",
      description: `${quantity}x ${item.name} has been added to your cart.`,
    })

    // Reset form
    setQuantity(1)
    setSelectedAddOns([])
    setSpecialInstructions("")
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <Button variant="ghost" className="mb-6 gap-1" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Back to Menu
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          {item.isCustomizable && (
            <Badge className="absolute top-4 right-4" variant="secondary">
              Customizable
            </Badge>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <p className="text-xl font-semibold text-primary mt-2">{item.price} EGP</p>
            <p className="text-muted-foreground mt-4">{item.description}</p>
          </div>

          {item.isCustomizable && item.addOns && item.addOns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Customize Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Add-ons</h3>
                  <div className="space-y-3">
                    {item.addOns.map((addOn) => (
                      <div key={addOn.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={addOn.name}
                            checked={selectedAddOns.some((a) => a.name === addOn.name)}
                            onCheckedChange={(checked) => handleAddOnChange(addOn, checked as boolean)}
                          />
                          <Label htmlFor={addOn.name} className="cursor-pointer">
                            {addOn.name}
                          </Label>
                        </div>
                        <span className="text-sm font-medium">+{addOn.price} EGP</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructions" className="text-sm font-medium">
                    Special Instructions (Optional)
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special requests or dietary requirements..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Quantity</span>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Total Price</span>
                <span className="text-xl font-bold text-primary">{calculateTotalPrice()} EGP</span>
              </div>

              <Button onClick={handleAddToCart} className="w-full" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
