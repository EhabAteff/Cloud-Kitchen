"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { menuItems } from "@/data/menu-items"

export default function MenuPage() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Our Menu</h1>
          <p className="text-muted-foreground">Browse our selection of delicious meals or customize your own</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8 flex flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mains">Main Dishes</TabsTrigger>
          <TabsTrigger value="sides">Side Dishes</TabsTrigger>
          <TabsTrigger value="desserts">Desserts</TabsTrigger>
          <TabsTrigger value="drinks">Drinks</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="mains" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems
              .filter((item) => item.category === "mains")
              .map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="sides" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems
              .filter((item) => item.category === "sides")
              .map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="desserts" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems
              .filter((item) => item.category === "desserts")
              .map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="drinks" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems
              .filter((item) => item.category === "drinks")
              .map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MenuItemCard({ item }) {
  return (
    <Card className="overflow-hidden border-none shadow-md h-full">
      <Link href={`/menu/${item.id}`} className="block h-full">
        <div className="relative h-48">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          {item.isCustomizable && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              Customizable
            </div>
          )}
        </div>
        <CardContent className="p-4 flex flex-col h-[calc(100%-192px)]">
          <div className="flex-1">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="font-semibold">{item.price} EGP</p>
            <Button size="sm">Add to Cart</Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
