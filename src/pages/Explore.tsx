
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
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
    category: filters.categories[0]
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
    const fabricForCollection: FabricType = {
      id: fabric.id,
      name: fabric.name,
      category: fabric.category,
      composition: fabric.composition,
      finish: fabric.finish,
      price: fabric.price,
      supplier: fabric.supplier,
      image: fabric.image,
      certifications: fabric.certifications,
      sustainability: fabric.sustainability,
      description: fabric.name,
      weight: `${fabric.gsm || 0}gsm`,
      blend: fabric.composition
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-amber-50">
        <motion.div 
          className="text-center bg-white p-8 rounded-xl shadow-lg border border-stone-200"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Search Error</h2>
          <p className="text-stone-600 mb-6">Failed to load fabrics. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="bg-amber-500 hover:bg-amber-600">
            Retry
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30">
      {/* Enhanced Search Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-3xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <Input
                placeholder="Search premium fabrics, materials, suppliers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-stone-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white/90 backdrop-blur-sm shadow-sm"
              />
              <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-400 w-5 h-5" />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-stone-200 hover:bg-stone-50"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Enhanced Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-80 flex-shrink-0`}>
            <FacetSidebar
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Enhanced Results */}
          <div className="flex-1">
            {/* Results Header */}
            <motion.div 
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-amber-700 bg-clip-text text-transparent">
                  {searchQuery ? `Search results for "${searchQuery}"` : 'Explore Premium Fabrics'}
                </h1>
                <p className="text-stone-600 mt-2 text-lg">
                  {isLoading ? 'Searching our premium collection...' : `${fabrics?.length || 0} high-quality fabrics found`}
                </p>
              </div>
            </motion.div>

            {/* Enhanced Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="bg-gradient-to-br from-stone-200 to-stone-300 aspect-square rounded-xl mb-4"></div>
                    <div className="bg-stone-200 h-6 rounded-lg mb-3"></div>
                    <div className="bg-stone-200 h-4 rounded-lg w-2/3"></div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Enhanced Empty State */}
            {!isLoading && fabrics?.length === 0 && (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-16 h-16 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-3">No fabrics found</h3>
                <p className="text-stone-600 mb-8 text-lg max-w-md mx-auto">
                  Try adjusting your search terms or filters to discover the perfect materials for your project.
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
                  className="border-amber-200 text-amber-600 hover:bg-amber-50"
                >
                  Clear all filters
                </Button>
              </motion.div>
            )}

            {/* Enhanced Results Grid */}
            {!isLoading && fabrics && fabrics.length > 0 && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {fabrics.map((fabric, index) => (
                  <motion.div
                    key={fabric.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <FabricCard
                      fabric={{
                        id: fabric.id,
                        name: fabric.name,
                        category: fabric.category,
                        composition: fabric.composition,
                        finish: fabric.finish,
                        price: fabric.price,
                        supplier: fabric.supplier,
                        image: fabric.image,
                        certifications: fabric.certifications,
                        sustainability: fabric.sustainability,
                        description: fabric.name,
                        weight: `${fabric.gsm || 0}gsm`,
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

      <PackDrawer
        fabricId={selectedFabric}
        isOpen={!!selectedFabric}
        onClose={() => setSelectedFabric(null)}
      />
    </div>
  );
};

export default Explore;
