"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { menuItems } from "@/data/menu-items"

export default function MenuItemPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Find the menu item based on the ID
  const menuItem = menuItems.find((item) => item.id === params.id)

  // Handle case when item is not found
  useEffect(() => {
    if (!menuItem && !isLoading) {
      toast({
        title: "Item not found",
        description: "The requested menu item could not be found.",
        variant: "destructive",
      })
      router.push("/menu")
    } else {
      setIsLoading(false)
    }
  }, [menuItem, router, toast, isLoading])

  // If still loading or item not found, show loading state
  if (isLoading || !menuItem) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <p>Loading menu item...</p>
        </div>
      </div>
    )
  }

  const handleAddOnToggle = (addOnId) => {
    setSelectedAddOns((current) => {
      if (current.includes(addOnId)) {
        return current.filter((id) => id !== addOnId)
      } else {
        return [...current, addOnId]
      }
    })
  }

  const calculateTotalPrice = () => {
    let total = menuItem.price * quantity

    // Add the price of selected add-ons
    if (menuItem.isCustomizable && menuItem.addOns) {
      menuItem.addOns.forEach((addOn) => {
        if (selectedAddOns.includes(addOn.id)) {
          total += addOn.price * quantity
        }
      })
    }

    return total
  }

  const handleAddToCart = () => {
    // Get the selected add-on objects with their details
    const selectedAddOnDetails =
      menuItem.isCustomizable && menuItem.addOns
        ? menuItem.addOns.filter((addOn) => selectedAddOns.includes(addOn.id))
        : []

    const customizations = menuItem.isCustomizable
      ? {
          addOns: selectedAddOnDetails,
          specialInstructions,
        }
      : null

    addItem({
      ...menuItem,
      quantity,
      customizations,
      totalPrice: calculateTotalPrice(),
    })

    toast({
      title: "Added to cart",
      description: `${quantity} x ${menuItem.name} added to your cart`,
    })
  }

  const incrementQuantity = () => setQuantity(quantity + 1)
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <Button variant="ghost" className="mb-6 gap-1" onClick={() => router.back()}>
        <ChevronLeft className="h-4 w-4" /> Back to Menu
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
          <Image src={menuItem.image || "/placeholder.svg"} alt={menuItem.name} fill className="object-cover" />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{menuItem.name}</h1>
          <p className="text-muted-foreground mt-2">{menuItem.description}</p>
          <p className="text-2xl font-bold mt-4">${menuItem.price.toFixed(2)}</p>

          <Separator className="my-6" />

          {menuItem.isCustomizable && (
            <div className="space-y-6">
              {menuItem.addOns && menuItem.addOns.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Add-ons</h3>
                  <div className="space-y-2">
                    {menuItem.addOns.map((addOn) => (
                      <div key={addOn.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={addOn.id}
                            checked={selectedAddOns.includes(addOn.id)}
                            onCheckedChange={() => handleAddOnToggle(addOn.id)}
                          />
                          <Label htmlFor={addOn.id}>{addOn.name}</Label>
                        </div>
                        <span className="text-sm text-muted-foreground">+${addOn.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Special instructions</h3>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Any special requests or allergies?"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>
          )}

          <Separator className="my-6" />

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button className="flex-1" onClick={handleAddToCart}>
              Add to Cart - ${calculateTotalPrice().toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
