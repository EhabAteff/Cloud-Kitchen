export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: "mains" | "sides" | "desserts" | "drinks"
  isCustomizable: boolean
  addOns?: AddOn[] // Only present for customizable items
}

export type AddOn = {
  id: string
  name: string
  price: number
}

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Fool With Tahini",
    description: "Crushed beans with our delicous tahini sauce",
    price: 5.99,
    image: "/images/fool.jpg",
    category: "mains",
    isCustomizable: true,
    addOns: [
      { id: "extra-tahini", name: "Extra Tahini", price: 0.99 },
      { id: "olive-oil", name: "Olive Oil", price: 0.5 },
      { id: "lemon", name: "Fresh Lemon", price: 0.5 },
      { id: "hot-sauce", name: "Hot Sauce", price: 0.75 },
    ],
  },
  {
    id: "2",
    name: "Koshary",
    description:
      "Rice with pasta, onions and lentils mixed together with our special tomoto soup and our secret spices",
    price: 9.99,
    image: "/images/kosharii.jpg",
    category: "mains",
    isCustomizable: false,
    addOns: [
      { id: "extra-sauce", name: "Extra Tomato Sauce", price: 0.99 },
      { id: "extra-onions", name: "Extra Crispy Onions", price: 0.75 },
      { id: "extra-spicy", name: "Extra Spicy", price: 0.5 },
      { id: "garlic-sauce", name: "Garlic Sauce", price: 0.99 },
    ],
  },
  {
    id: "3",
    name: "Mashed Potatos",
    description: "Mashed potatos with butter and creamy cheese",
    price: 7.99,
    image: "/images/mpotato.webp",
    category: "sides",
    isCustomizable: true,
    addOns: [
      { id: "extra-cheese", name: "Extra Cheese", price: 1.5 },
      { id: "bacon-bits", name: "Bacon Bits", price: 1.99 },
      { id: "chives", name: "Fresh Chives", price: 0.5 },
      { id: "sour-cream", name: "Sour Cream", price: 0.99 },
    ],
  },
  {
    id: "4",
    name: "Rice Pudding",
    description: "Our famous rice pudding made with full cream milk and finest Egyptian rice",
    price: 8.99,
    image: "/images/rice-pudding.webp",
    category: "desserts",
    isCustomizable: true,
    addOns: [
      { id: "cinnamon", name: "Cinnamon", price: 0.5 },
      { id: "honey", name: "Honey", price: 0.99 },
      { id: "nuts", name: "Mixed Nuts", price: 1.5 },
      { id: "raisins", name: "Raisins", price: 0.99 },
    ],
  },
  {
    id: "5",
    name: "Garden Salad",
    description: "Fresh mixed greens with your choice of dressing",
    price: 3.99,
    image: "/images/green-salad.jpg",
    category: "sides",
    isCustomizable: false,
  },
  {
    id: "6",
    name: "Potato Fries",
    description: "Crispy potato fries with special seasoning",
    price: 4.99,
    image: "/images/fries.webp",
    category: "sides",
    isCustomizable: true,
    addOns: [
      { id: "cheese-sauce", name: "Cheese Sauce", price: 1.5 },
      { id: "truffle-oil", name: "Truffle Oil", price: 2.5 },
      { id: "garlic-aioli", name: "Garlic Aioli", price: 0.99 },
    ],
  },
  {
    id: "7",
    name: "Freshly Squeezed Orange Juice",
    description: "100% pure orange juice",
    price: 3.99,
    image: "/images/orange-juice.jpg",
    category: "drinks",
    isCustomizable: false,
  },
  {
    id: "8",
    name: "Lemon Iced Tea",
    description: "Cold lemon iced tea",
    price: 2.99,
    image: "/images/lemon-tea.webp",
    category: "drinks",
    isCustomizable: true,
    addOns: [
      { id: "extra-lemon", name: "Extra Lemon", price: 0.5 },
      { id: "mint", name: "Fresh Mint", price: 0.75 },
      { id: "honey", name: "Honey", price: 0.5 },
    ],
  },
]
