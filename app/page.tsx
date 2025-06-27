"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Clock, Star, ChefHat } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <div className="min-h-screen">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="container px-4 md:px-6 py-16 space-y-16">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/chef-cooking.png" alt="Chef cooking in kitchen" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Fresh Food, Fast Delivery</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Delicious meals prepared by expert chefs, delivered hot to your doorstep
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Cloud Kitchen?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering exceptional food experiences with speed, quality, and convenience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get your favorite meals delivered in 30 minutes or less. We value your time as much as you do.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ChefHat className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Expert Chefs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our experienced chefs use only the freshest ingredients to create delicious, restaurant-quality meals.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Quality Guaranteed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We maintain the highest standards of food safety and quality. Your satisfaction is our priority.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Menu Items</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">30min</div>
              <div className="text-muted-foreground">Average Delivery</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-muted-foreground">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Browse our extensive menu and discover your new favorite dish. Fresh, fast, and delivered with care.
          </p>
        </div>
      </section>
    </div>
  )
}
