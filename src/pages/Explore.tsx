
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { fabricTypes } from '@/data/fabricData';
import FacetSidebar from '@/components/FacetSidebar';
import FabricCard from '@/components/FabricCard';
import PackDrawer from '@/components/PackDrawer';

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    construction: '',
    gsm: [0, 500] as [number, number],
    finishes: [] as string[],
    categories: [] as string[]
  });

  const filteredFabrics = fabricTypes.filter(fabric => {
    const matchesSearch = !searchQuery || 
      fabric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fabric.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fabric.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filters.categories.length === 0 || 
      filters.categories.includes(fabric.category);
    
    return matchesSearch && matchesCategory;
  });

  const openDrawer = (fabricId: string) => {
    setSelectedFabric(fabricId);
  };

  const closeDrawer = () => {
    setSelectedFabric(null);
  };

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <FacetSidebar filters={filters} onFiltersChange={setFilters} />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Search Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <Input
              placeholder="Search fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/60 backdrop-blur-sm border-stone-200"
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.p 
          className="text-stone-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Found {filteredFabrics.length} fabrics
        </motion.p>

        {/* Fabric Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {filteredFabrics.map((fabric, index) => (
            <motion.div
              key={fabric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <FabricCard fabric={fabric} onClick={() => openDrawer(fabric.id)} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pack Drawer */}
      <PackDrawer 
        fabricId={selectedFabric} 
        isOpen={!!selectedFabric} 
        onClose={closeDrawer} 
      />
    </div>
  );
};

export default Explore;
