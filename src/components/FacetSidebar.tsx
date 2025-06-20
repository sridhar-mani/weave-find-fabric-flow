
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';

interface FacetSidebarProps {
  filters: {
    construction: string[];
    gsm: [number, number];
    finishes: string[];
    categories: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const FacetSidebar = ({ filters = { construction: [], gsm: [50, 500], finishes: [], categories: [] }, onFiltersChange }: FacetSidebarProps) => {
  const categories = ['Natural Fiber', 'Luxury Fiber', 'Workwear', 'Synthetic Fiber', 'Cotton', 'Linen', 'Silk', 'Wool'];
  const finishes = ['Waterproof', 'Wrinkle-resistant', 'Anti-microbial', 'UV Protection', 'Organic', 'Fair Trade'];

  const updateFilters = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories?.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...(filters.categories || []), category];
    updateFilters('categories', newCategories);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      construction: [],
      gsm: [50, 500],
      finishes: [],
      categories: []
    });
  };

  const hasActiveFilters = (filters.categories?.length || 0) > 0 || 
                          (filters.finishes?.length || 0) > 0 || 
                          (filters.gsm && (filters.gsm[0] !== 50 || filters.gsm[1] !== 500));

  return (
    <motion.div 
      className="w-80 bg-white/90 backdrop-blur-md border border-stone-200/60 rounded-xl shadow-xl p-6 overflow-y-auto sticky top-24"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-stone-800">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-stone-500 hover:text-red-500 h-8 px-2"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
          Category
          {(filters.categories?.length || 0) > 0 && (
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
              {filters.categories?.length || 0}
            </span>
          )}
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <motion.div 
              key={category} 
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-stone-50 transition-colors"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Checkbox
                id={category}
                checked={filters.categories?.includes(category) || false}
                onCheckedChange={() => toggleCategory(category)}
                className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <Label 
                htmlFor={category} 
                className="text-sm text-stone-700 font-medium cursor-pointer flex-1"
              >
                {category}
              </Label>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator className="mb-8 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      {/* GSM Range */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-stone-700 mb-4">
          Weight Range (GSM)
        </h3>
        <div className="px-3 py-4 bg-stone-50 rounded-lg">
          <div className="flex justify-between text-sm text-stone-600 mb-3">
            <span className="font-medium">{filters.gsm?.[0] || 50} GSM</span>
            <span className="font-medium">{filters.gsm?.[1] || 500} GSM</span>
          </div>
          <Slider
            value={filters.gsm || [50, 500]}
            onValueChange={(value) => updateFilters('gsm', value as [number, number])}
            max={500}
            min={50}
            step={10}
            className="w-full"
          />
        </div>
      </div>

      <Separator className="mb-8 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />

      {/* Finishes */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
          Finishes & Features
          {(filters.finishes?.length || 0) > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
              {filters.finishes?.length || 0}
            </span>
          )}
        </h3>
        <ToggleGroup 
          type="multiple" 
          value={filters.finishes || []}
          onValueChange={(value) => updateFilters('finishes', value)}
          className="flex-wrap gap-2"
        >
          {finishes.map((finish) => (
            <ToggleGroupItem 
              key={finish} 
              value={finish}
              variant="outline"
              size="sm"
              className="text-xs font-medium data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 data-[state=on]:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              {finish}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <motion.div 
          className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-amber-800 font-medium">
            {(filters.categories?.length || 0) + (filters.finishes?.length || 0)} filters active
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FacetSidebar;
