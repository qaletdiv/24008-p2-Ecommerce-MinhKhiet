const IMAGE_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com' 
  : 'http://localhost:4000';

const productsData = [
  {
    id: 1,
    name: "Bose QuietComfort 45 Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
    price: 329.99,
    offerPrice: 299.99,
    category: "Headphones",
    categoryId: 1,
    image: [
      `${IMAGE_BASE_URL}/images/bose_headphone_image.png`,
      `${IMAGE_BASE_URL}/images/header_headphone_image.png`
    ],
    brand: "Bose",
    inStock: true,
    quantity: 50,
    ratings: 4.5,
    reviews: 128,
    tags: ["wireless", "bluetooth", "noise-cancellation", "premium"],
    specifications: {
      batteryLife: "24 hours",
      connectivity: "Bluetooth 5.1",
      weight: "240g",
      warranty: "2 years"
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z"
  },
  {
    id: 2,
    name: "ASUS Gaming Laptop",
    description: "High-performance gaming laptop with advanced graphics and fast processor. Ideal for gaming and professional work.",
    price: 1299.99,
    offerPrice: 1199.99,
    category: "Laptops",
    categoryId: 2,
    image: [
      `${IMAGE_BASE_URL}/images/asus_laptop_image.png`,
      `${IMAGE_BASE_URL}/images/macbook_image.png`
    ],
    brand: "ASUS",
    inStock: true,
    quantity: 25,
    ratings: 4.7,
    reviews: 89,
    tags: ["gaming", "laptop", "high-performance", "asus"],
    specifications: {
      processor: "Intel i7-12700H",
      ram: "16GB DDR4",
      storage: "512GB SSD",
      graphics: "RTX 3060",
      display: "15.6\" FHD 144Hz"
    },
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-25T16:45:00Z"
  },
  {
    id: 3,
    name: "PlayStation 5 Controller",
    description: "Professional wireless gaming controller with precision controls and long battery life. Compatible with PC and PlayStation 5.",
    price: 79.99,
    offerPrice: 59.99,
    category: "Gaming",
    categoryId: 3,
    image: [
      `${IMAGE_BASE_URL}/images/md_controller_image.png`,
      `${IMAGE_BASE_URL}/images/sm_controller_image.png`
    ],
    brand: "Sony",
    inStock: true,
    quantity: 100,
    ratings: 4.3,
    reviews: 256,
    tags: ["gaming", "controller", "wireless", "ps5", "sony"],
    specifications: {
      connectivity: "Bluetooth/USB-C",
      batteryLife: "12 hours",
      compatibility: "PC, PlayStation 5",
      weight: "280g"
    },
    createdAt: "2024-01-05T12:00:00Z",
    updatedAt: "2024-01-22T09:15:00Z"
  },
  {
    id: 4,
    name: "Canon Professional Camera",
    description: "Professional DSLR camera with high resolution and advanced features. Perfect for photography and videography.",
    price: 899.99,
    offerPrice: 799.99,
    category: "Cameras",
    categoryId: 4,
    image: [
      `${IMAGE_BASE_URL}/images/cannon_camera_image.png`
    ],
    brand: "Canon",
    inStock: true,
    quantity: 30,
    ratings: 4.8,
    reviews: 67,
    tags: ["camera", "dslr", "professional", "photography"],
    specifications: {
      resolution: "24.2 MP",
      videoRecording: "4K @ 30fps",
      lensMount: "EF/EF-S",
      batteryLife: "600 shots"
    },
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-18T11:20:00Z"
  },
  {
    id: 5,
    name: "Apple AirPods Pro",
    description: "Premium wireless earphones with active noise cancellation and spatial audio. Designed for superior sound experience.",
    price: 249.99,
    offerPrice: 199.99,
    category: "Earphones",
    categoryId: 5,
    image: [
      `${IMAGE_BASE_URL}/images/apple_earphone_image.png`,
      `${IMAGE_BASE_URL}/images/product_details_page_apple_earphone_image1.png`,
      `${IMAGE_BASE_URL}/images/product_details_page_apple_earphone_image2.png`
    ],
    brand: "Apple",
    inStock: true,
    quantity: 75,
    ratings: 4.6,
    reviews: 234,
    tags: ["apple", "airpods", "wireless", "noise-cancellation"],
    specifications: {
      batteryLife: "6 hours + 24 hours with case",
      connectivity: "Bluetooth 5.0",
      features: "Active Noise Cancellation",
      compatibility: "iPhone, iPad, Mac"
    },
    createdAt: "2024-01-08T16:45:00Z",
    updatedAt: "2024-01-24T13:10:00Z"
  },
  {
    id: 6,
    name: "Samsung Galaxy S23",
    description: "Latest flagship smartphone with advanced camera system and powerful performance for all your daily needs.",
    price: 899.99,
    offerPrice: 799.99,
    category: "Smartphones",
    categoryId: 6,
    image: [
      `${IMAGE_BASE_URL}/images/samsung_s23phone_image.png`
    ],
    brand: "Samsung",
    inStock: true,
    quantity: 45,
    ratings: 4.4,
    reviews: 156,
    tags: ["samsung", "smartphone", "flagship", "android"],
    specifications: {
      display: "6.1\" Dynamic AMOLED",
      processor: "Snapdragon 8 Gen 2",
      camera: "50MP Triple Camera",
      storage: "256GB"
    },
    createdAt: "2024-01-14T12:00:00Z",
    updatedAt: "2024-01-26T15:30:00Z"
  },
  {
    id: 7,
    name: "JBL Bluetooth Speaker",
    description: "Portable Bluetooth speaker with powerful sound and long battery life. Perfect for outdoor activities and parties.",
    price: 129.99,
    offerPrice: 99.99,
    category: "Audio",
    categoryId: 7,
    image: [
      `${IMAGE_BASE_URL}/images/jbl_soundbox_image.png`
    ],
    brand: "JBL",
    inStock: true,
    quantity: 60,
    ratings: 4.2,
    reviews: 98,
    tags: ["jbl", "speaker", "bluetooth", "portable"],
    specifications: {
      batteryLife: "20 hours",
      waterproof: "IPX7",
      connectivity: "Bluetooth 5.1",
      power: "40W"
    },
    createdAt: "2024-01-16T09:30:00Z",
    updatedAt: "2024-01-28T11:45:00Z"
  }
];

module.exports = { productsData };