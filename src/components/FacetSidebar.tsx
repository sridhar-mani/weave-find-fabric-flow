
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface FacetSidebarProps {
  filters: {
    construction: string[];
    gsm: [number, number];
    finishes: string[];
    categories: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const FacetSidebar = ({ filters, onFiltersChange }: FacetSidebarProps) => {
  const categories = ['Natural Fiber', 'Luxury Fiber', 'Workwear', 'Synthetic Fiber'];
  const finishes = ['Waterproof', 'Wrinkle-resistant', 'Anti-microbial', 'UV Protection'];

  const updateFilters = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories?.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...(filters.categories || []), category];
    updateFilters('categories', newCategories);
  };

  return (
    <motion.div 
      className="w-80 bg-white/60 backdrop-blur-sm border-r border-stone-200 p-6 overflow-y-auto sticky top-24"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold text-stone-800 mb-6">Filters</h2>
      
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-stone-700 mb-4">Category</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.categories?.includes(category) || false}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={category} className="text-sm text-stone-600">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* GSM Range */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-stone-700 mb-4">
          GSM Range: {filters.gsm[0]} - {filters.gsm[1]}
        </h3>
        <Slider
          value={filters.gsm}
          onValueChange={(value) => updateFilters('gsm', value as [number, number])}
          max={500}
          min={0}
          step={10}
          className="w-full"
        />
      </div>

      <Separator className="mb-8" />

      {/* Finishes */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-stone-700 mb-4">Finishes</h3>
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
              className="text-xs"
            >
              {finish}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </motion.div>
  );
};

export default FacetSidebar;
