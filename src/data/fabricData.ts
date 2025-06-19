
export interface Supplier {
  id: string;
  name: string;
  location: string;
  contact: string;
  pricing: string;
  trustBadge: string;
  rating: number;
}

export interface Material {
  id: string;
  name: string;
  suppliers: Supplier[];
}

export interface FabricType {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  weight: string;
  blend: string;
  composition: string;
  finish: string;
  price: number;
  supplier: string;
  certifications: string[];
  sustainability: string[];
}

export interface FabricData {
  materials: Material[];
}

export const fabricTypes: FabricType[] = [
  {
    id: "cotton",
    name: "Cotton",
    description:
      "Natural, breathable fiber ideal for apparel and home textiles.",
    category: "Natural Fiber",
    image:
      "https://images.unsplash.com/photo-1506629905607-0bb3ef005ac5?w=800&h=600&fit=crop",
    weight: "140-200 GSM",
    blend: "100% Cotton",
    composition: "100% Cotton",
    finish: "Standard",
    price: 12.50,
    supplier: "Cotton Mills International",
    certifications: ["OEKO-TEX"],
    sustainability: ["Organic"]
  },
  {
    id: "silk",
    name: "Silk",
    description:
      "Premium natural protein fiber with exceptional drape and luster.",
    category: "Luxury Fiber",
    image:
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&h=600&fit=crop",
    weight: "80-120 GSM",
    blend: "100% Silk",
    composition: "100% Silk",
    finish: "Degummed",
    price: 45.00,
    supplier: "Premium Silk Traders",
    certifications: ["OEKO-TEX"],
    sustainability: ["Biodegradable"]
  },
  {
    id: "linen",
    name: "Linen",
    description:
      "Natural flax fiber known for breathability and sustainability.",
    category: "Natural Fiber",
    image:
      "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&h=600&fit=crop",
    weight: "120-180 GSM",
    blend: "100% Linen",
    composition: "100% Linen",
    finish: "Stone Washed",
    price: 18.75,
    supplier: "European Linen Mills",
    certifications: ["OEKO-TEX"],
    sustainability: ["Biodegradable", "Sustainable"]
  },
  {
    id: "polyester",
    name: "Polyester",
    description:
      "Versatile synthetic fiber with durability and easy care properties.",
    category: "Synthetic Fiber",
    image:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop",
    weight: "100-300 GSM",
    blend: "100% Polyester",
    composition: "100% Polyester",
    finish: "Standard",
    price: 8.50,
    supplier: "Synthetic Solutions Inc",
    certifications: ["OEKO-TEX"],
    sustainability: ["Recyclable"]
  },
];

const fabricDataMap: Record<string, FabricData> = {
  cotton: {
    materials: [
      {
        id: "cotton-yarn",
        name: "Cotton Yarn",
        suppliers: [
          {
            id: "supplier-1",
            name: "Cotton Mills International",
            location: "Mumbai, India",
            contact: "contact@cottonmills.com",
            pricing: "$45-65/kg",
            trustBadge: "Certified Supplier",
            rating: 5,
          },
          {
            id: "supplier-2",
            name: "Organic Cotton Co.",
            location: "Gujarat, India",
            contact: "sales@organiccotton.com",
            pricing: "$55-75/kg",
            trustBadge: "Organic Certified",
            rating: 4,
          },
        ],
      },
      {
        id: "cotton-thread",
        name: "Cotton Thread",
        suppliers: [
          {
            id: "supplier-3",
            name: "Thread Solutions Ltd",
            location: "Karachi, Pakistan",
            contact: "sales@threadsolutions.com",
            pricing: "$12-18/spool",
            trustBadge: "ISO Certified",
            rating: 4,
          },
        ],
      },
    ],
  },
  silk: {
    materials: [
      {
        id: "silk-yarn",
        name: "Silk Yarn",
        suppliers: [
          {
            id: "supplier-4",
            name: "Premium Silk Traders",
            location: "Bangalore, India",
            contact: "info@premiumsilk.com",
            pricing: "$120-180/kg",
            trustBadge: "Premium Supplier",
            rating: 5,
          },
        ],
      },
    ],
  },
  linen: {
    materials: [
      {
        id: "linen-yarn",
        name: "Linen Yarn",
        suppliers: [
          {
            id: "supplier-5",
            name: "European Linen Mills",
            location: "Belfast, Ireland",
            contact: "orders@europeanlinen.com",
            pricing: "$85-120/kg",
            trustBadge: "Heritage Supplier",
            rating: 5,
          },
        ],
      },
    ],
  },
  polyester: {
    materials: [
      {
        id: "polyester-fiber",
        name: "Polyester Fiber",
        suppliers: [
          {
            id: "supplier-6",
            name: "Synthetic Solutions Inc",
            location: "Shanghai, China",
            contact: "sales@syntheticsolutions.com",
            pricing: "$1.20-1.80/kg",
            trustBadge: "Volume Supplier",
            rating: 4,
          },
        ],
      },
    ],
  },
};

export const getFabricData = (fabricId: string): FabricData | null => {
  return fabricDataMap[fabricId] || null;
};

export const getAllSuppliers = (): Supplier[] => {
  const allSuppliers: Supplier[] = [];
  Object.values(fabricDataMap).forEach(fabricData => {
    fabricData.materials.forEach(material => {
      allSuppliers.push(...material.suppliers);
    });
  });
  return allSuppliers;
};
