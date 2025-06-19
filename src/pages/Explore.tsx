
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import FacetSidebar from '@/components/FacetSidebar';
import FabricCard from '@/components/FabricCard';
import PackDrawer from '@/components/PackDrawer';
import { useFabricSearch } from '@/hooks/useFabricSearch';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCollection } from '@/hooks/useCollection';

interface FabricType {
  id: string;
  name: string;
  category: string;
  gsm: number;
  width: string;
  composition: string;
  finish: string;
  price: number;
  supplier: string;
  image?: string;
  certifications: string[];
  sustainability: string[];
  description: string;
  weight: string;
  blend: string;
}

const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    construction: [] as string[],
    gsm: [50, 500] as [number, number],
    finishes: [] as string[],
    categories: [] as string[]
  });

  const { data: fabrics, isLoading, error } = useFabricSearch({
    query: searchQuery,
    construction: filters.construction,
    gsmRange: filters.gsm,
    finishes: filters.finishes,
    categories: filters.categories
  });

  const { logFabricView } = useAnalytics();
  const { addItem } = useCollection();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const handleFabricClick = (fabricId: string) => {
    logFabricView(fabricId);
    setSelectedFabric(fabricId);
  };

  const handleAddToCollection = (fabric: any) => {
    // Convert FabricSearchResult to FabricType
    const fabricForCollection: FabricType = {
      id: fabric.id,
      name: fabric.name,
      category: fabric.category,
      gsm: fabric.gsm,
      width: fabric.width,
      composition: fabric.composition,
      finish: fabric.finish,
      price: fabric.price,
      supplier: fabric.supplier,
      image: fabric.image,
      certifications: fabric.certifications,
      sustainability: fabric.sustainability,
      description: fabric.name, // Use name as fallback for description
      weight: `${fabric.gsm}gsm`, // Convert gsm to weight string
      blend: fabric.composition // Use composition as blend
    };

    addItem({
      id: fabricForCollection.id,
      name: fabricForCollection.name,
      type: 'fabric',
      image: fabricForCollection.image,
      supplier: fabricForCollection.supplier,
      price: fabricForCollection.price
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Search Error</h2>
          <p className="text-stone-600">Failed to load fabrics. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Search Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <Input
                placeholder="Search fabrics, materials, suppliers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-80 flex-shrink-0`}>
            <FacetSidebar
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-stone-800">
                  {searchQuery ? `Search results for "${searchQuery}"` : 'Explore Fabrics'}
                </h1>
                <p className="text-stone-600 mt-1">
                  {isLoading ? 'Searching...' : `${fabrics?.length || 0} fabrics found`}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-stone-200 aspect-square rounded-lg mb-4"></div>
                    <div className="bg-stone-200 h-4 rounded mb-2"></div>
                    <div className="bg-stone-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && fabrics?.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-stone-400" />
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">No fabrics found</h3>
                <p className="text-stone-600 mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      construction: [],
                      gsm: [50, 500],
                      finishes: [],
                      categories: []
                    });
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && fabrics && fabrics.length > 0 && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {fabrics.map((fabric, index) => (
                  <motion.div
                    key={fabric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <FabricCard
                      fabric={{
                        id: fabric.id,
                        name: fabric.name,
                        category: fabric.category,
                        gsm: fabric.gsm,
                        width: fabric.width,
                        composition: fabric.composition,
                        finish: fabric.finish,
                        price: fabric.price,
                        supplier: fabric.supplier,
                        image: fabric.image,
                        certifications: fabric.certifications,
                        sustainability: fabric.sustainability,
                        description: fabric.name,
                        weight: `${fabric.gsm}gsm`,
                        blend: fabric.composition
                      }}
                      onClick={() => handleFabricClick(fabric.id)}
                      onAddToCollection={() => handleAddToCollection(fabric)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Pack Drawer */}
      <PackDrawer
        fabricId={selectedFabric}
        isOpen={!!selectedFabric}
        onClose={() => setSelectedFabric(null)}
      />
    </div>
  );
};

export default Explore;
