
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FacetSidebar from '@/components/FacetSidebar';
import { supabase } from '@/integrations/supabase/client';
import { useCollection } from '@/hooks/useCollection';
import { useToast } from '@/hooks/use-toast';

interface Fabric {
  id: string;
  name: string;
  description?: string;
  material?: string;
  color?: string;
  pattern?: string;
  price_per_yard?: number;
  supplier?: string;
  image_url?: string;
  tags?: string[];
  stock_quantity?: number;
  width?: number;
  weight?: number;
  care_instructions?: string;
}

interface Filters {
  construction: string[];
  gsm: [number, number];
  finishes: string[];
  categories: string[];
}

const Explore: React.FC = () => {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [filteredFabrics, setFilteredFabrics] = useState<Fabric[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    construction: [],
    gsm: [50, 500],
    finishes: [],
    categories: []
  });

  const { addItem, isInCollection } = useCollection();
  const { toast } = useToast();

  useEffect(() => {
    const loadFabrics = async () => {
      try {
        const { data, error } = await supabase
          .from('fabrics')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFabrics(data || []);
        setFilteredFabrics(data || []);
      } catch (error) {
        console.error('Error loading fabrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFabrics();
  }, []);

  useEffect(() => {
    let filtered = fabrics;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(fabric =>
        fabric.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fabric.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fabric.material?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filters (map to material)
    if (filters.categories.length > 0) {
      filtered = filtered.filter(fabric => 
        fabric.material && filters.categories.includes(fabric.material)
      );
    }

    // Apply finishes filters (map to tags if available)
    if (filters.finishes.length > 0) {
      filtered = filtered.filter(fabric => 
        fabric.tags && fabric.tags.some(tag => filters.finishes.includes(tag))
      );
    }

    // Apply GSM filter (map to weight)
    filtered = filtered.filter(fabric => {
      const weight = fabric.weight || 0;
      return weight >= filters.gsm[0] && weight <= filters.gsm[1];
    });

    setFilteredFabrics(filtered);
  }, [fabrics, searchTerm, filters]);

  const handleAddToCollection = async (fabric: Fabric) => {
    try {
      await addItem({
        id: fabric.id,
        name: fabric.name,
        image: fabric.image_url,
        price: fabric.price_per_yard,
        supplier: fabric.supplier,
        material: fabric.material
      });
      toast({
        title: 'Added to Collection',
        description: `${fabric.name} has been added to your collection.`,
      });
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast({
        title: 'Error',
        description: 'Failed to add fabric to collection.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading fabrics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <FacetSidebar
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search fabrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredFabrics.length} of {fabrics.length} fabrics
            </p>
          </div>

          {/* Fabric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFabrics.map((fabric) => (
              <Card key={fabric.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {fabric.image_url && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={fabric.image_url}
                      alt={fabric.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{fabric.name}</CardTitle>
                  {fabric.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {fabric.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {fabric.material && (
                      <Badge variant="secondary">{fabric.material}</Badge>
                    )}
                    {fabric.color && (
                      <Badge variant="outline">{fabric.color}</Badge>
                    )}
                    {fabric.pattern && (
                      <Badge variant="outline">{fabric.pattern}</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {fabric.supplier && (
                      <p><span className="font-medium">Supplier:</span> {fabric.supplier}</p>
                    )}
                    {fabric.price_per_yard && (
                      <p><span className="font-medium">Price:</span> ${fabric.price_per_yard}/yard</p>
                    )}
                    {fabric.width && (
                      <p><span className="font-medium">Width:</span> {fabric.width}"</p>
                    )}
                    {fabric.stock_quantity !== undefined && (
                      <p><span className="font-medium">Stock:</span> {fabric.stock_quantity} yards</p>
                    )}
                  </div>

                  <Button
                    onClick={() => handleAddToCollection(fabric)}
                    disabled={isInCollection(fabric.id)}
                    className="w-full"
                    variant={isInCollection(fabric.id) ? "secondary" : "default"}
                  >
                    {isInCollection(fabric.id) ? 'In Collection' : 'Add to Collection'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFabrics.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No fabrics found matching your criteria.</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
