
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowRight, Search, Filter, Phone, MessageCircle, Star, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FabricVisualizer from '@/components/FabricVisualizer';
import SupplierComparison from '@/components/SupplierComparison';
import PriceEstimator from '@/components/PriceEstimator';
import Navigation from '@/components/Navigation';
import { fabricTypes, getFabricData } from '@/data/fabricData';

const Index = () => {
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showEstimator, setShowEstimator] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('textile-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

  const fabricData = selectedFabric ? getFabricData(selectedFabric) : null;

  const toggleFavorite = (supplierId: string) => {
    const newFavorites = favorites.includes(supplierId)
      ? favorites.filter(id => id !== supplierId)
      : [...favorites, supplierId];
    
    setFavorites(newFavorites);
    localStorage.setItem('textile-favorites', JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(supplierId) ? "Removed from favorites" : "Added to favorites",
      description: "Supplier preference updated",
    });
  };

  const handleSupplierSelect = (supplierId: string) => {
    if (selectedSuppliers.includes(supplierId)) {
      setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplierId));
    } else if (selectedSuppliers.length < 2) {
      setSelectedSuppliers([...selectedSuppliers, supplierId]);
    } else {
      toast({
        title: "Maximum 2 suppliers",
        description: "You can only compare 2 suppliers at a time",
        variant: "destructive",
      });
    }
  };

  const filteredMaterials = fabricData?.materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.suppliers.some(supplier => 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      <Navigation 
        selectedFabric={selectedFabric} 
        onBack={() => setSelectedFabric(null)}
        showEstimator={() => setShowEstimator(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        {!selectedFabric ? (
          // Homepage
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-stone-800 mb-4">
              Find the right suppliers for your textile needs
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Discover premium fabrics, connect with trusted suppliers, and streamline your textile sourcing process
            </p>
          </div>
        ) : (
          // Fabric Selected View
          <div className="mb-8">
            <FabricVisualizer fabric={selectedFabric} />
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search materials or suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                {selectedSuppliers.length === 2 && (
                  <Button 
                    onClick={() => setShowComparison(true)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Compare Selected
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {!selectedFabric ? (
          // Fabric Type Cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {fabricTypes.map((fabric) => (
              <Card 
                key={fabric.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-stone-200 bg-white/80 backdrop-blur-sm"
                onClick={() => setSelectedFabric(fabric.id)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={fabric.image}
                      alt={fabric.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-stone-800 mb-2">{fabric.name}</h3>
                    <p className="text-stone-600 mb-4">{fabric.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {fabric.category}
                      </Badge>
                      <ArrowRight className="w-5 h-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Materials and Suppliers Grid
          <div className="space-y-8">
            {filteredMaterials.map((material) => (
              <div key={material.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-stone-200">
                <h3 className="text-2xl font-semibold text-stone-800 mb-4 flex items-center gap-2">
                  {material.name}
                  <Badge variant="outline" className="border-amber-600 text-amber-700">
                    {material.suppliers.length} suppliers
                  </Badge>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {material.suppliers.map((supplier) => (
                    <Card 
                      key={supplier.id}
                      className={`transition-all duration-200 cursor-pointer border-2 ${
                        selectedSuppliers.includes(supplier.id) 
                          ? 'border-amber-500 ring-2 ring-amber-200' 
                          : 'border-stone-200 hover:border-amber-300'
                      }`}
                      onClick={() => handleSupplierSelect(supplier.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-stone-800">{supplier.name}</h4>
                            <div className="flex items-center text-stone-500 text-sm mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {supplier.location}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(supplier.id);
                            }}
                            className="p-1 hover:bg-stone-100 rounded"
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                favorites.includes(supplier.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'text-stone-400'
                              }`}
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-3 h-3 ${
                                  i < supplier.rating ? 'text-yellow-500 fill-current' : 'text-stone-300'
                                }`}
                              />
                            ))}
                          </div>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {supplier.trustBadge}
                          </Badge>
                        </div>
                        
                        <p className="text-lg font-semibold text-amber-700 mb-3">
                          {supplier.pricing}
                        </p>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://wa.me/${supplier.contact.replace(/\D/g, '')}`, '_blank');
                            }}
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            WhatsApp
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`tel:${supplier.contact}`, '_blank');
                            }}
                          >
                            <Phone className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showComparison && selectedSuppliers.length === 2 && (
        <SupplierComparison 
          supplierIds={selectedSuppliers}
          onClose={() => setShowComparison(false)}
        />
      )}

      {showEstimator && selectedFabric && (
        <PriceEstimator 
          fabric={selectedFabric}
          onClose={() => setShowEstimator(false)}
        />
      )}
    </div>
  );
};

export default Index;
