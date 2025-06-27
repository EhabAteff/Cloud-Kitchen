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
    price: 8.99,
    image: "/images/fool.jpg",
    category: "mains",
    isCustomizable: true,
    addOns: [
      { name: "Extra Tahini", price: 1.5 },
      { name: "Boiled Egg", price: 2.0 },
      { name: "Extra Vegetables", price: 1.0 },
    ],
  },
  {
    id: "koshary",
    name: "Koshary",
    description: "Egypt's national dish with rice, lentils, pasta, and spicy tomato sauce",
    price: 12.99,
    image: "/images/kosharii.jpg",
    category: "mains",
    isCustomizable: true,
    addOns: [
      { name: "Extra Sauce", price: 1.0 },
      { name: "Extra Fried Onions", price: 1.5 },
      { name: "Spicy Level Up", price: 0.5 },
    ],
  },
  {
    id: "mashed-potato",
    name: "Creamy Mashed Potato",
    description: "Smooth and creamy mashed potatoes with butter and herbs",
    price: 6.99,
    image: "/images/mpotato.webp",
    category: "sides",
    isCustomizable: true,
    addOns: [
      { name: "Extra Butter", price: 0.75 },
      { name: "Cheese Topping", price: 2.0 },
      { name: "Bacon Bits", price: 2.5 },
    ],
  },
  {
    id: "green-salad",
    name: "Fresh Green Salad",
    description: "Mixed greens with cucumber, tomatoes, and house dressing",
    price: 7.99,
    image: "/images/green-salad.jpg",
    category: "sides",
    isCustomizable: true,
    addOns: [
      { name: "Grilled Chicken", price: 4.0 },
      { name: "Feta Cheese", price: 2.5 },
      { name: "Avocado", price: 3.0 },
      { name: "Extra Dressing", price: 0.5 },
    ],
  },
  {
    id: "french-fries",
    name: "Crispy French Fries",
    description: "Golden crispy fries seasoned with sea salt",
    price: 4.99,
    image: "/images/fries.webp",
    category: "sides",
    isCustomizable: true,
    addOns: [
      { name: "Cheese Sauce", price: 1.5 },
      { name: "Garlic Aioli", price: 1.0 },
      { name: "Truffle Oil", price: 2.0 },
    ],
  },
  {
    id: "orange-juice",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice, no added sugar",
    price: 3.99,
    image: "/images/orange-juice.jpg",
    category: "drinks",
    isCustomizable: false,
  },
  {
    id: "lemon-tea",
    name: "Lemon Iced Tea",
    description: "Refreshing iced tea with fresh lemon and mint",
    price: 2.99,
    image: "/images/lemon-tea.webp",
    category: "drinks",
    isCustomizable: true,
    addOns: [
      { name: "Extra Lemon", price: 0.5 },
      { name: "Extra Mint", price: 0.5 },
      { name: "Honey", price: 0.75 },
    ],
  },
  {
    id: "rice-pudding",
    name: "Rice Pudding",
    description: "Creamy rice pudding with cinnamon and vanilla",
    price: 5.99,
    image: "/images/rice-pudding.webp",
    category: "desserts",
    isCustomizable: true,
    addOns: [
      { name: "Extra Cinnamon", price: 0.25 },
      { name: "Raisins", price: 1.0 },
      { name: "Nuts", price: 1.5 },
    ],
  },
]
