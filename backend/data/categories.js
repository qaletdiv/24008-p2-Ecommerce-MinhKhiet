const categoriesData = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and gadgets including headphones, webcams, keyboards and accessories",
    slug: "electronics",
    image: "/images/category-electronics.jpg",
    parentId: null,
    isActive: true,
    sortOrder: 1,
    productCount: 15,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z"
  },
  {
    id: 2,
    name: "Computers",
    description: "Laptops, desktops, and computer accessories for gaming and professional use",
    slug: "computers",
    image: "/images/category-computers.jpg",
    parentId: null,
    isActive: true,
    sortOrder: 2,
    productCount: 8,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-18T14:15:00Z"
  },
  {
    id: 3,
    name: "Gaming",
    description: "Gaming controllers, accessories, and gaming-related products",
    slug: "gaming",
    image: "/images/category-gaming.jpg",
    parentId: null,
    isActive: true,
    sortOrder: 3,
    productCount: 12,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-22T16:45:00Z"
  },
  {
    id: 4,
    name: "Audio & Video",
    description: "Audio equipment, video devices, and multimedia accessories",
    slug: "audio-video",
    image: "/images/category-audio-video.jpg",
    parentId: 1, 
    isActive: true,
    sortOrder: 1,
    productCount: 6,
    createdAt: "2024-01-02T08:30:00Z",
    updatedAt: "2024-01-19T11:20:00Z"
  },
  {
    id: 5,
    name: "Input Devices",
    description: "Keyboards, mice, and other computer input devices",
    slug: "input-devices",
    image: "/images/category-input-devices.jpg",
    parentId: 2, 
    isActive: true,
    sortOrder: 1,
    productCount: 4,
    createdAt: "2024-01-02T09:00:00Z",
    updatedAt: "2024-01-21T13:10:00Z"
  },
  {
    id: 6,
    name: "Gaming Controllers",
    description: "Wireless and wired gaming controllers for various platforms",
    slug: "gaming-controllers",
    image: "/images/category-controllers.jpg",
    parentId: 3,
    isActive: true,
    sortOrder: 1,
    productCount: 3,
    createdAt: "2024-01-02T10:15:00Z",
    updatedAt: "2024-01-23T15:25:00Z"
  }
];

module.exports = { categoriesData };