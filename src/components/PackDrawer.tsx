
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { fabricTypes, getFabricData } from '@/data/fabricData';
import { useAnalytics } from '@/hooks/useAnalytics';

interface PackDrawerProps {
  fabricId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const PackDrawer = ({ fabricId, isOpen, onClose }: PackDrawerProps) => {
  const { trackEvent } = useAnalytics();
  
  const fabric = fabricId ? fabricTypes.find(f => f.id === fabricId) : null;
  const fabricData = fabricId ? getFabricData(fabricId) : null;

  const handleAddToMoodboard = () => {
    if (fabricId) {
      // Add to localStorage moodboard
      const moodboard = JSON.parse(localStorage.getItem('moodboard') || '[]');
      if (!moodboard.includes(fabricId)) {
        moodboard.push(fabricId);
        localStorage.setItem('moodboard', JSON.stringify(moodboard));
        trackEvent('add_to_moodboard', { fabric_id: fabricId });
      }
    }
  };

  const handleRequestSwatch = () => {
    if (fabricId) {
      trackEvent('request_swatch', { fabric_id: fabricId });
      // Handle swatch request logic
    }
  };

  if (!fabric) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-[480px] bg-white border-l border-stone-200 z-50 overflow-y-auto"
            initial={{ x: 480 }}
            animate={{ x: 0 }}
            exit={{ x: 480 }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-stone-800">{fabric.name}</h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Image */}
              <div className="aspect-square bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg"></div>
              
              {/* Quick Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{fabric.category}</Badge>
                  <Badge variant="secondary">{fabric.weight}</Badge>
                </div>
                <p className="text-stone-600 text-sm">{fabric.description}</p>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="specs" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="specs">Specs</TabsTrigger>
                  <TabsTrigger value="trims">Trims</TabsTrigger>
                  <TabsTrigger value="price">Price</TabsTrigger>
                </TabsList>
                
                <TabsContent value="specs" className="space-y-4">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="composition">
                      <AccordionTrigger>Composition</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-stone-600">{fabric.blend}</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="care">
                      <AccordionTrigger>Care Instructions</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-stone-600">Machine wash cold, tumble dry low</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="sustainability">
                      <AccordionTrigger>Sustainability</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Eco-Friendly
                          </Badge>
                          <p className="text-sm text-stone-600">
                            This fabric meets environmental standards for sustainable production.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="trims" className="space-y-4">
                  {fabricData?.materials.slice(0, 3).map((material) => (
                    <div key={material.id} className="border border-stone-200 rounded-lg p-4">
                      <h4 className="font-medium text-stone-800 mb-2">{material.name}</h4>
                      <p className="text-sm text-stone-600 mb-2">
                        {material.suppliers.length} suppliers available
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        From ${material.suppliers[0]?.pricing || 'N/A'}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    Show All Trims
                  </Button>
                </TabsContent>
                
                <TabsContent value="price" className="space-y-4">
                  <div className="bg-stone-50 p-4 rounded-lg">
                    <h4 className="font-medium text-stone-800 mb-2">Base Price</h4>
                    <p className="text-2xl font-bold text-stone-900">$45-65/meter</p>
                    <p className="text-sm text-stone-600">Minimum order: 50 meters</p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button 
                  onClick={handleAddToMoodboard}
                  variant="secondary" 
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Moodboard
                </Button>
                <Button 
                  onClick={handleRequestSwatch}
                  className="w-full"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Request Swatch
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PackDrawer;
