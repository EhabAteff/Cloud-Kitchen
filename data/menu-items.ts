export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: "mains" | "sides" | "desserts" | "drinks"
  isCustomizable: boolean
  addOns?: Array<{
    name: string
    price: number
  }>
}

export const menuItems: MenuItem[] = [
  {
    id: "fool",
    name: "Fool Medames",
    description: "Traditional Egyptian fava beans served with tahini, olive oil, and fresh vegetables",
    price: 270,
    image: "/images/fool.jpg",
    category: "mains",
    isCustomizable: true,
    addOns: [
      { name: "Extra Tahini", price: 45 },
      { name: "Boiled Egg", price: 60 },
      { name: "Extra Vegetables", price: 30 },
    ],
  },
  {
    id: "koshary",
    name: "Koshary",
    description: "Egypt's national dish with rice, lentils, pasta, and spicy tomato sauce",
    price: 390,
    image: "/images/kosharii.jpg",
    category: "mains",
    isCustomizable: true,
    addOns: [
      { name: "Extra Sauce", price: 30 },
      { name: "Extra Fried Onions", price: 45 },
      { name: "Spicy Level Up", price: 15 },
    ],
  },
  {
    id: "mashed-potato",
    name: "Creamy Mashed Potato",
    description: "Smooth and creamy mashed potatoes with butter and herbs",
    price: 210,
    image: "/images/mpotato.webp",
    category: "sides",
    isCustomizable: true,
    addOns: [
      { name: "Extra Butter", price: 23 },
      { name: "Cheese Topping", price: 60 },
      { name: "Bacon Bits", price: 75 },
    ],
  },
  {
    id: "green-salad",
    name: "Fresh Green Salad",
    description: "Mixed greens with cucumber, tomatoes, and house dressing",
    price: 240,
    image: "/images/green-salad.jpg",
    category: "sides",
    isCustomizable: true,
    addOns: [
      { name: "Grilled Chicken", price: 120 },
      { name: "Feta Cheese", price: 75 },
      { name: "Avocado", price: 90 },
      { name: "Extra Dressing", price: 15 },
    ],
  },
  {
    id: "french-fries",
    name: "Crispy French Fries",
    description: "Golden crispy fries seasoned with sea salt",
    price: 150,
    image: "/images/fries.webp",
    category: "sides",
    isCustomizable: true,
    addOns: [
      { name: "Cheese Sauce", price: 45 },
      { name: "Garlic Aioli", price: 30 },
      { name: "Truffle Oil", price: 60 },
    ],
  },
  {
    id: "orange-juice",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice, no added sugar",
    price: 120,
    image: "/images/orange-juice.jpg",
    category: "drinks",
    isCustomizable: false,
  },
  {
    id: "lemon-tea",
    name: "Lemon Iced Tea",
    description: "Refreshing iced tea with fresh lemon and mint",
    price: 90,
    image: "/images/lemon-tea.webp",
    category: "drinks",
    isCustomizable: true,
    addOns: [
      { name: "Extra Lemon", price: 15 },
      { name: "Extra Mint", price: 15 },
      { name: "Honey", price: 23 },
    ],
  },
  {
    id: "rice-pudding",
    name: "Rice Pudding",
    description: "Creamy rice pudding with cinnamon and vanilla",
    price: 180,
    image: "/images/rice-pudding.webp",
    category: "desserts",
    isCustomizable: true,
    addOns: [
      { name: "Extra Cinnamon", price: 8 },
      { name: "Raisins", price: 30 },
      { name: "Nuts", price: 45 },
    ],
  },
]
