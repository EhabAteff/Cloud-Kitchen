import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Clock, Star, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { menuItems } from "@/data/menu-items"

export default function Home() {
  // Get the first 4 items from the menu for the popular meals section
  const popularMeals = menuItems.slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/chef-cooking.png"
            alt="Chef preparing delicious food"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
            Delicious Meals, Delivered Fresh
          </h1>
          <p className="text-xl text-white/90 max-w-[700px]">
            Customize your perfect meal with fresh ingredients and have it delivered to your doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/menu">Order Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Customize Your Meal</h3>
              <p className="text-muted-foreground">
                Choose your ingredients and create your perfect meal exactly how you like it.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Get your food delivered quickly and track your order in real-time.
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Quality Ingredients</h3>
              <p className="text-muted-foreground">
                We use only the freshest ingredients to ensure the best quality meals.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Meals Section */}
      <section className="bg-muted py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Popular Meals</h2>
            <Button asChild variant="link" className="gap-1">
              <Link href="/menu">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularMeals.map((meal) => (
              <Link key={meal.id} href={`/menu/${meal.id}`} className="group">
                <Card className="overflow-hidden border-none shadow-md transition-all hover:shadow-lg">
                  <div className="relative h-48">
                    <Image
                      src={meal.image || "/placeholder.svg"}
                      alt={meal.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{meal.name}</h3>
                        <p className="text-sm text-muted-foreground">{meal.description}</p>
                      </div>
                      <p className="font-semibold">${meal.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container px-4 md:px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              1
            </div>
            <h3 className="text-xl font-semibold">Choose Your Meal</h3>
            <p className="text-muted-foreground">
              Browse our menu and select your favorite meals or create your own custom dish.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              2
            </div>
            <h3 className="text-xl font-semibold">Customize Ingredients</h3>
            <p className="text-muted-foreground">
              Add or remove ingredients to make your meal exactly how you like it.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              3
            </div>
            <h3 className="text-xl font-semibold">Track & Enjoy</h3>
            <p className="text-muted-foreground">
              Track your delivery in real-time and enjoy your freshly prepared meal.
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <Button asChild size="lg">
            <Link href="/menu">Start Ordering</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
