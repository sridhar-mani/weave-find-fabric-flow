import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Plus, 
  Heart, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Package, 
  Truck, 
  Award,
  Leaf,
  Phone,
  Mail,
  Building2,
  Globe,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Info
} from 'lucide-react';
import MaterialDetails from '@/components/MaterialDetails';

interface Material {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  type: 'fabric' | 'trim' | 'accessory' | 'packaging' | 'hardware';
  composition: string;
  weight?: string;
  width?: string;
  thickness?: string;
  color: string;
  finish: string;
  supplier: string;
  supplierContact: string;
  supplierLocation: string;
  unitPrice: number;
  bulkPrice: number;
  minimumOrder: number;
  bulkOrderQuantity: number;
  currency: string;
  leadTime: string;
  availability: string;
  certifications: string[];
  sustainability: string[];
  careInstructions: string;
  description: string;
  applications: string[];
  season: string;
  tags: string[];
  image?: string;
  rating?: number;
  reviews?: number;
  dateAdded: string;
  lastUpdated: string;
}

interface MaterialFilters {
  category: string;
  subcategory: string;
  type: string;
  priceRange: [number, number];
  leadTime: string;
  availability: string;
  certifications: string[];
  sustainability: string[];
  supplier: string;
  location: string;
  season: string;
}

const MaterialsMarketplace: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showMaterialDetails, setShowMaterialDetails] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [filters, setFilters] = useState<MaterialFilters>({
    category: '',
    subcategory: '',
    type: '',
    priceRange: [0, 1000],
    leadTime: '',
    availability: '',
    certifications: [],
    sustainability: [],
    supplier: '',
    location: '',
    season: ''
  });

  const { toast } = useToast();

  // Mock data
  useEffect(() => {
    const mockMaterials: Material[] = [
      {
        id: '1',
        name: 'Organic Cotton Twill',
        category: 'Fabric',
        subcategory: 'Cotton',
        type: 'fabric',
        composition: '100% Organic Cotton',
        weight: '280gsm',
        width: '150cm',
        color: 'Natural',
        finish: 'Enzyme Washed',
        supplier: 'EcoTextiles Ltd',
        supplierContact: '+1-555-0123',
        supplierLocation: 'Los Angeles, CA',
        unitPrice: 12.50,
        bulkPrice: 10.00,
        minimumOrder: 50,
        bulkOrderQuantity: 500,
        currency: 'USD',
        leadTime: '2-3 weeks',
        availability: 'In Stock',
        certifications: ['GOTS', 'OEKO-TEX'],
        sustainability: ['Organic', 'Fair Trade'],
        careInstructions: 'Machine wash cold, tumble dry low',
        description: 'Premium organic cotton twill perfect for sustainable fashion projects.',
        applications: ['Clothing', 'Accessories', 'Home Textiles'],
        season: 'All Season',
        tags: ['sustainable', 'organic', 'cotton'],
        rating: 4.8,
        reviews: 124,
        dateAdded: '2023-01-15',
        lastUpdated: '2023-06-20'
      },
      // Add more mock materials here...
    ];
    
    setMaterials(mockMaterials);
    setFilteredMaterials(mockMaterials);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = materials.filter(material => {
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || material.category === filters.category;
      const matchesType = !filters.type || material.type === filters.type;
      const matchesPrice = material.unitPrice >= filters.priceRange[0] && material.unitPrice <= filters.priceRange[1];
      const matchesAvailability = !filters.availability || material.availability === filters.availability;
      
      return matchesSearch && matchesCategory && matchesType && matchesPrice && matchesAvailability;
    });

    // Sort materials
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.unitPrice - b.unitPrice;
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'date':
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, filters, sortBy, sortOrder]);

  const handleToggleFavorite = (materialId: string) => {
    setFavorites(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const handleAddToCart = (materialId: string) => {
    setCart(prev => [...prev, materialId]);
    toast({
      title: "Added to cart",
      description: "Material has been added to your cart.",
    });
  };

  const handleViewMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setShowMaterialDetails(true);
  };

  const categories = ['Fabric', 'Trim', 'Accessory', 'Packaging', 'Hardware'];
  const availabilityOptions = ['In Stock', 'Low Stock', 'Made to Order', 'Out of Stock'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Materials Marketplace</h1>
            <p className="text-gray-600 mt-2">Discover and source premium materials for your projects</p>
          </div>
          <Button onClick={() => setShowAddMaterial(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Material
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search materials, suppliers, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="fabric">Fabric</SelectItem>
                  <SelectItem value="trim">Trim</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="availability">Availability</Label>
              <Select value={filters.availability} onValueChange={(value) => setFilters({...filters, availability: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Availability</SelectItem>
                  {availabilityOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                placeholder="Filter by supplier"
                value={filters.supplier}
                onChange={(e) => setFilters({...filters, supplier: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredMaterials.length} of {materials.length} materials
          </p>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>

        {/* Materials Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{material.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{material.supplier}</p>
                    <div className="flex items-center gap-1 mb-2">
                      {material.rating && (
                        <>
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{material.rating}</span>
                          <span className="text-sm text-gray-500">({material.reviews})</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFavorite(material.id)}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(material.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">${material.unitPrice}/{material.type === 'fabric' ? 'yard' : 'unit'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">MOQ:</span>
                    <span>{material.minimumOrder} {material.type === 'fabric' ? 'yards' : 'units'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lead Time:</span>
                    <span>{material.leadTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge variant={material.availability === 'In Stock' ? 'default' : 'secondary'}>
                    {material.availability}
                  </Badge>
                  {material.certifications.slice(0, 2).map(cert => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleViewMaterial(material)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddToCart(material.id)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Material Details Modal */}
        <MaterialDetails
          material={selectedMaterial}
          open={showMaterialDetails}
          onOpenChange={setShowMaterialDetails}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={selectedMaterial ? favorites.includes(selectedMaterial.id) : false}
        />
      </div>
    </div>
  );
};

export default MaterialsMarketplace;
