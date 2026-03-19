// Mock data service for frontend development

// Object-based relation interfaces
export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Size {
  _id: string;
  name: string;
  slug: string;
}

export interface Color {
  _id: string;
  name: string;
  slug: string;
  hex: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string | Category; // Can be string (legacy) or Category object
  sizes: (string | Size)[]; // Can be array of strings or Size objects
  colors: (string | Color)[]; // Can be array of strings or Color objects
  stock: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  // Optional fields for popularity scoring
  views?: number;
  wishlistCount?: number;
  sales?: number;
  // Admin-controlled flags for bestseller/new arrival
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  orderItems: CartItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    pincode: string;
  };
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
}

// Mock Products Data
export const mockProducts: Product[] = [
  {
    _id: "1",
    name: "Elegant Silk Saree",
    description:
      "Beautiful silk saree with intricate embroidery work, perfect for special occasions.",
    price: 4999,
    category: "Sarees",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Blue", "Green", "Pink"],
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1594736797933-d0acc2401915?w=400",
      "https://images.unsplash.com/photo-1594736797933-d0acc2401915?w=400",
    ],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    name: "Designer Anarkali Suit",
    description:
      "Stunning Anarkali suit with heavy embroidery and mirror work.",
    price: 3499,
    category: "Salwar Suits",
    sizes: ["S", "M", "L"],
    colors: ["Maroon", "Navy Blue", "Black"],
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1594634311205-dc3e0ad6f5b0?w=400",
      "https://images.unsplash.com/photo-1594634311205-dc3e0ad6f5b0?w=400",
    ],
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:20:00Z",
  },
  {
    _id: "3",
    name: "Traditional Banarasi Saree",
    description: "Authentic Banarasi silk saree with traditional zari work.",
    price: 8999,
    category: "Sarees",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gold", "Orange", "Purple"],
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400",
    ],
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
  },
  {
    _id: "4",
    name: "Stylish Kurti",
    description: "Comfortable and stylish cotton kurti for daily wear.",
    price: 1299,
    category: "Kurtis",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Yellow", "White", "Light Blue", "Pink"],
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400",
    ],
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
  },
  {
    _id: "5",
    name: "Royal Blue Lehenga",
    description: "Elegant lehenga choli with detailed stone work.",
    price: 6999,
    category: "Lehengas",
    sizes: ["S", "M", "L"],
    colors: ["Royal Blue", "Red", "Green"],
    stock: 10,
    images: [
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400",
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400",
    ],
    createdAt: "2024-01-11T11:30:00Z",
    updatedAt: "2024-01-11T11:30:00Z",
  },
  {
    _id: "6",
    name: "Printed Dupatta",
    description: "Beautiful printed dupatta with traditional patterns.",
    price: 599,
    category: "Dupattas",
    sizes: ["One Size"],
    colors: ["Multi", "Black", "White"],
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
    ],
    createdAt: "2024-01-10T13:20:00Z",
    updatedAt: "2024-01-10T13:20:00Z",
  },
];

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    _id: "order1",
    user: {
      name: "Priya Sharma",
      email: "priya@example.com",
    },
    orderItems: [
      {
        ...mockProducts[0],
        quantity: 1,
      },
      {
        ...mockProducts[3],
        quantity: 2,
      },
    ],
    shippingAddress: {
      fullName: "Priya Sharma",
      address: "123 Fashion Street, Apt 4B",
      city: "Mumbai",
      pincode: "400001",
    },
    totalAmount: 7597,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    _id: "order2",
    user: {
      name: "Anita Patel",
      email: "anita@example.com",
    },
    orderItems: [
      {
        ...mockProducts[2],
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: "Anita Patel",
      address: "456 Heritage Road, House 12",
      city: "Jaipur",
      pincode: "302001",
    },
    totalAmount: 8999,
    paymentStatus: "Pending",
    orderStatus: "Processing",
    createdAt: "2024-01-12T15:30:00Z",
    updatedAt: "2024-01-12T15:30:00Z",
  },
  {
    _id: "order3",
    user: {
      name: "Kavita Reddy",
      email: "kavita@example.com",
    },
    orderItems: [
      {
        ...mockProducts[4],
        quantity: 1,
      },
      {
        ...mockProducts[5],
        quantity: 3,
      },
    ],
    shippingAddress: {
      fullName: "Kavita Reddy",
      address: "789 Traditional Lane, Flat 3A",
      city: "Bangalore",
      pincode: "560001",
    },
    totalAmount: 8796,
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-13T11:45:00Z",
  },
];

// Mock API functions (simulating async operations)
export const mockApi = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockProducts;
  },

  getProductById: async (id: string): Promise<Product | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockProducts.find((p) => p._id === id) || null;
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockOrders;
  },

  createOrder: async (orderData: any): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newOrder: Order = {
      _id: `order${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockOrders.push(newOrder);
    return newOrder;
  },
};
