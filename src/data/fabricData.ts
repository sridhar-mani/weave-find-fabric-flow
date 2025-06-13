
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
}

export interface FabricData {
  materials: Material[];
}

export const fabricTypes: FabricType[] = [
  {
    id: 'cotton',
    name: 'Cotton',
    description: 'Natural, breathable, and versatile fabric perfect for everyday wear and home textiles.',
    category: 'Natural Fiber',
    image: 'https://images.unsplash.com/photo-1506629905607-0bb3ef005ac5?w=800&h=600&fit=crop',
    weight: '140-200 GSM',
    blend: '100% Cotton'
  },
  {
    id: 'silk',
    name: 'Silk',
    description: 'Luxurious natural protein fiber with exceptional drape and lustrous finish.',
    category: 'Luxury Fiber',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&h=600&fit=crop',
    weight: '80-120 GSM',
    blend: '100% Silk'
  },
  {
    id: 'denim',
    name: 'Denim',
    description: 'Durable cotton twill weave fabric, perfect for jeans and casual wear.',
    category: 'Workwear',
    image: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=800&h=600&fit=crop',
    weight: '280-350 GSM',
    blend: '98% Cotton, 2% Elastane'
  },
  {
    id: 'linen',
    name: 'Linen',
    description: 'Natural flax fiber known for its coolness and freshness in hot weather.',
    category: 'Natural Fiber',
    image: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800&h=600&fit=crop',
    weight: '120-180 GSM',
    blend: '100% Linen'
  },
  {
    id: 'polyester',
    name: 'Polyester',
    description: 'Synthetic fiber offering durability, wrinkle resistance, and easy care.',
    category: 'Synthetic Fiber',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    weight: '100-300 GSM',
    blend: '100% Polyester'
  }
];

const fabricDataMap: Record<string, FabricData> = {
  cotton: {
    materials: [
      {
        id: 'cotton-yarn',
        name: 'Cotton Yarn',
        suppliers: [
          {
            id: 'supplier-1',
            name: 'Premium Cotton Mills',
            location: 'Mumbai, India',
            contact: '+91-98765-43210',
            pricing: '$45-65/kg',
            trustBadge: 'Verified Supplier',
            rating: 5
          },
          {
            id: 'supplier-2',
            name: 'Organic Cotton Co.',
            location: 'Ahmedabad, India',
            contact: '+91-98765-43211',
            pricing: '$55-75/kg',
            trustBadge: 'Organic Certified',
            rating: 4
          }
        ]
      },
      {
        id: 'cotton-thread',
        name: 'Cotton Thread',
        suppliers: [
          {
            id: 'supplier-3',
            name: 'Global Thread Solutions',
            location: 'Karachi, Pakistan',
            contact: '+92-300-1234567',
            pricing: '$12-18/spool',
            trustBadge: 'ISO Certified',
            rating: 4
          },
          {
            id: 'supplier-4',
            name: 'Quality Threads Ltd',
            location: 'Dhaka, Bangladesh',
            contact: '+880-171-2345678',
            pricing: '$10-15/spool',
            trustBadge: 'Verified Supplier',
            rating: 5
          }
        ]
      },
      {
        id: 'buttons',
        name: 'Buttons & Fasteners',
        suppliers: [
          {
            id: 'supplier-5',
            name: 'Button Craft Industries',
            location: 'Guangzhou, China',
            contact: '+86-138-0013-8000',
            pricing: '$0.05-0.25/piece',
            trustBadge: 'Trade Assured',
            rating: 4
          }
        ]
      }
    ]
  },
  silk: {
    materials: [
      {
        id: 'silk-yarn',
        name: 'Silk Yarn',
        suppliers: [
          {
            id: 'supplier-6',
            name: 'Royal Silk Traders',
            location: 'Bangalore, India',
            contact: '+91-98765-43212',
            pricing: '$120-180/kg',
            trustBadge: 'Premium Supplier',
            rating: 5
          },
          {
            id: 'supplier-7',
            name: 'Mulberry Silk Co.',
            location: 'Suzhou, China',
            contact: '+86-138-0013-8001',
            pricing: '$100-150/kg',
            trustBadge: 'Verified Supplier',
            rating: 4
          }
        ]
      },
      {
        id: 'silk-lining',
        name: 'Silk Lining',
        suppliers: [
          {
            id: 'supplier-8',
            name: 'Luxury Linings Ltd',
            location: 'Milan, Italy',
            contact: '+39-02-1234-5678',
            pricing: '$25-40/meter',
            trustBadge: 'European Quality',
            rating: 5
          }
        ]
      }
    ]
  },
  denim: {
    materials: [
      {
        id: 'denim-rivets',
        name: 'Denim Rivets',
        suppliers: [
          {
            id: 'supplier-9',
            name: 'Heavy Duty Hardware',
            location: 'Los Angeles, USA',
            contact: '+1-555-0123',
            pricing: '$0.15-0.30/piece',
            trustBadge: 'American Made',
            rating: 5
          },
          {
            id: 'supplier-10',
            name: 'Metal Works Co.',
            location: 'Istanbul, Turkey',
            contact: '+90-212-555-0123',
            pricing: '$0.10-0.20/piece',
            trustBadge: 'Verified Supplier',
            rating: 4
          }
        ]
      },
      {
        id: 'denim-zippers',
        name: 'Heavy Duty Zippers',
        suppliers: [
          {
            id: 'supplier-11',
            name: 'YKK Fastening Solutions',
            location: 'Tokyo, Japan',
            contact: '+81-3-1234-5678',
            pricing: '$2.50-5.00/piece',
            trustBadge: 'World Leader',
            rating: 5
          }
        ]
      }
    ]
  },
  linen: {
    materials: [
      {
        id: 'linen-yarn',
        name: 'Linen Yarn',
        suppliers: [
          {
            id: 'supplier-12',
            name: 'European Linen Mills',
            location: 'Belfast, Ireland',
            contact: '+353-28-1234-567',
            pricing: '$85-120/kg',
            trustBadge: 'Heritage Supplier',
            rating: 5
          },
          {
            id: 'supplier-13',
            name: 'Baltic Linen Co.',
            location: 'Riga, Latvia',
            contact: '+371-67-123-456',
            pricing: '$70-95/kg',
            trustBadge: 'Eco-Certified',
            rating: 4
          }
        ]
      },
      {
        id: 'lace-trim',
        name: 'Lace Trim',
        suppliers: [
          {
            id: 'supplier-14',
            name: 'Delicate Lace Atelier',
            location: 'Calais, France',
            contact: '+33-3-21-12-34-56',
            pricing: '$8-25/meter',
            trustBadge: 'Artisan Quality',
            rating: 5
          }
        ]
      }
    ]
  },
  polyester: {
    materials: [
      {
        id: 'polyester-fiber',
        name: 'Polyester Fiber',
        suppliers: [
          {
            id: 'supplier-15',
            name: 'Synthetic Solutions Inc',
            location: 'Shanghai, China',
            contact: '+86-21-1234-5678',
            pricing: '$1.20-1.80/kg',
            trustBadge: 'Volume Supplier',
            rating: 4
          },
          {
            id: 'supplier-16',
            name: 'EcoPolyester Mills',
            location: 'Seoul, South Korea',
            contact: '+82-2-1234-5678',
            pricing: '$1.50-2.20/kg',
            trustBadge: 'Recycled Materials',
            rating: 4
          }
        ]
      },
      {
        id: 'elastic-bands',
        name: 'Elastic Bands',
        suppliers: [
          {
            id: 'supplier-17',
            name: 'Stretch Solutions Ltd',
            location: 'Hong Kong',
            contact: '+852-2345-6789',
            pricing: '$3-8/meter',
            trustBadge: 'Quality Assured',
            rating: 4
          }
        ]
      }
    ]
  }
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
