
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Heart, 
  ShoppingCart, 
  Star, 
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import MaterialDetails from '@/components/MaterialDetails';
import { useSampleRequest, useReserveYardage, useContactSupplier } from '@/hooks/useMutations';

interface Material {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  type: 'fabric' | 'trim' | 'accessory' | 'packaging' | 'hardware';
  composition: string;
  weight?: string;
  width?: string;
  color: string;
  finish: string;
  supplier: string;
  supplierContact: string;
  supplierEmail: string;
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
  const [showSampleRequest, setShowSampleRequest] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Sample request form state
  const [sampleData, setSampleData] = useState({
    quantity: 1,
    address: '',
    urgency: 'standard' as 'standard' | 'urgent' | 'rush',
    notes: ''
  });

  // Reservation form state
  const [reservationData, setReservationData] = useState({
    yards: 1,
    duration: 7,
    notes: ''
  });

  // Contact form state
  const [contactData, setContactData] = useState({
    subject: '',
    message: ''
  });
  
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
  const sampleRequestMutation = useSampleRequest();
  const reservationMutation = useReserveYardage();
  const contactMutation = useContactSupplier();

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
        supplierEmail: 'orders@ecotextiles.com',
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
      {
        id: '2',
        name: 'Recycled Polyester Jersey',
        category: 'Fabric',
        subcategory: 'Knits',
        type: 'fabric',
        composition: '95% Recycled Polyester, 5% Elastane',
        weight: '180gsm',
        width: '165cm',
        color: 'Heather Grey',
        finish: 'Moisture Wicking',
        supplier: 'GreenFiber Co',
        supplierContact: '+1-555-0456',
        supplierEmail: 'sales@greenfiber.com',
        supplierLocation: 'Portland, OR',
        unitPrice: 8.75,
        bulkPrice: 7.20,
        minimumOrder: 100,
        bulkOrderQuantity: 1000,
        currency: 'USD',
        leadTime: '1-2 weeks',
        availability: 'In Stock',
        certifications: ['GRS', 'OEKO-TEX'],
        sustainability: ['Recycled', 'Low Impact'],
        careInstructions: 'Machine wash warm, tumble dry medium',
        description: 'High-performance recycled polyester jersey ideal for activewear.',
        applications: ['Activewear', 'Sportswear', 'Loungewear'],
        season: 'All Season',
        tags: ['recycled', 'performance', 'jersey'],
        rating: 4.6,
        reviews: 89,
        dateAdded: '2023-02-10',
        lastUpdated: '2023-06-15'
      }
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

  const handleSampleRequest = async () => {
    if (!selectedMaterial) return;
    
    try {
      await sampleRequestMutation.mutateAsync({
        fabricId: selectedMaterial.id,
        fabricName: selectedMaterial.name,
        supplierName: selectedMaterial.supplier,
        supplierEmail: selectedMaterial.supplierEmail,
        quantity: sampleData.quantity,
        address: sampleData.address,
        urgency: sampleData.urgency,
        notes: sampleData.notes
      });
      setShowSampleRequest(false);
      setSampleData({ quantity: 1, address: '', urgency: 'standard', notes: '' });
    } catch (error) {
      console.error('Sample request failed:', error);
    }
  };

  const handleReservation = async () => {
    if (!selectedMaterial) return;
    
    try {
      await reservationMutation.mutateAsync({
        fabricId: selectedMaterial.id,
        fabricName: selectedMaterial.name,
        supplierName: selectedMaterial.supplier,
        supplierEmail: selectedMaterial.supplierEmail,
        yards: reservationData.yards,
        duration: reservationData.duration,
        notes: reservationData.notes
      });
      setShowReservation(false);
      setReservationData({ yards: 1, duration: 7, notes: '' });
    } catch (error) {
      console.error('Reservation failed:', error);
    }
  };

  const handleContact = async () => {
    if (!selectedMaterial) return;
    
    try {
      await contactMutation.mutateAsync({
        supplierName: selectedMaterial.supplier,
        supplierEmail: selectedMaterial.supplierEmail,
        subject: contactData.subject,
        message: contactData.message,
        fabricName: selectedMaterial.name,
        fabricId: selectedMaterial.id
      });
      setShowContact(false);
      setContactData({ subject: '', message: '' });
    } catch (error) {
      console.error('Contact failed:', error);
    }
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
                  <SelectItem value="all">All Categories</SelectItem>
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
                  <SelectItem value="all">All Types</SelectItem>
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
                  <SelectItem value="all">All Availability</SelectItem>
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
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

                <div className="flex gap-2 mb-2">
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

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedMaterial(material);
                      setShowSampleRequest(true);
                    }}
                  >
                    Sample
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedMaterial(material);
                      setShowReservation(true);
                    }}
                  >
                    Reserve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedMaterial(material);
                      setShowContact(true);
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
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

        {/* Sample Request Modal */}
        <Dialog open={showSampleRequest} onOpenChange={setShowSampleRequest}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Sample - {selectedMaterial?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={sampleData.quantity}
                  onChange={(e) => setSampleData({...sampleData, quantity: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="address">Shipping Address</Label>
                <Textarea
                  id="address"
                  value={sampleData.address}
                  onChange={(e) => setSampleData({...sampleData, address: e.target.value})}
                  placeholder="Enter your complete shipping address"
                />
              </div>
              <div>
                <Label htmlFor="urgency">Urgency</Label>
                <Select value={sampleData.urgency} onValueChange={(value: any) => setSampleData({...sampleData, urgency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="rush">Rush</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={sampleData.notes}
                  onChange={(e) => setSampleData({...sampleData, notes: e.target.value})}
                  placeholder="Any special requirements or notes"
                />
              </div>
              <Button 
                onClick={handleSampleRequest} 
                className="w-full"
                disabled={sampleRequestMutation.isPending}
              >
                {sampleRequestMutation.isPending ? 'Sending...' : 'Send Sample Request'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reservation Modal */}
        <Dialog open={showReservation} onOpenChange={setShowReservation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reserve Yardage - {selectedMaterial?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="yards">Yards to Reserve</Label>
                <Input
                  id="yards"
                  type="number"
                  value={reservationData.yards}
                  onChange={(e) => setReservationData({...reservationData, yards: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={reservationData.duration}
                  onChange={(e) => setReservationData({...reservationData, duration: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="reservationNotes">Notes</Label>
                <Textarea
                  id="reservationNotes"
                  value={reservationData.notes}
                  onChange={(e) => setReservationData({...reservationData, notes: e.target.value})}
                  placeholder="Any special requirements or notes"
                />
              </div>
              <Button 
                onClick={handleReservation} 
                className="w-full"
                disabled={reservationMutation.isPending}
              >
                {reservationMutation.isPending ? 'Reserving...' : 'Reserve Yardage'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Contact Modal */}
        <Dialog open={showContact} onOpenChange={setShowContact}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Supplier - {selectedMaterial?.supplier}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={contactData.subject}
                  onChange={(e) => setContactData({...contactData, subject: e.target.value})}
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={contactData.message}
                  onChange={(e) => setContactData({...contactData, message: e.target.value})}
                  placeholder="Enter your message"
                  rows={4}
                />
              </div>
              <Button 
                onClick={handleContact} 
                className="w-full"
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MaterialsMarketplace;
