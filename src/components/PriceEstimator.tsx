
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, X } from 'lucide-react';
import { getFabricData } from '@/data/fabricData';

interface PriceEstimatorProps {
  fabric: string;
  onClose: () => void;
}

const PriceEstimator = ({ fabric, onClose }: PriceEstimatorProps) => {
  const [quantity, setQuantity] = useState<number>(100);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  
  const fabricData = getFabricData(fabric);
  const material = fabricData?.materials.find(m => m.id === selectedMaterial);
  const supplier = material?.suppliers.find(s => s.id === selectedSupplier);
  
  const calculateEstimate = () => {
    if (!supplier || !quantity) return 0;
    
    // Extract base price from pricing string (simplified)
    const priceMatch = supplier.pricing.match(/\$(\d+)/);
    const basePrice = priceMatch ? parseInt(priceMatch[1]) : 50;
    
    // Simple calculation with quantity discounts
    let unitPrice = basePrice;
    if (quantity >= 1000) unitPrice *= 0.8; // 20% discount
    else if (quantity >= 500) unitPrice *= 0.9; // 10% discount
    
    return Math.round(unitPrice * quantity);
  };

  const estimate = calculateEstimate();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Price Estimator
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="material">Material/Trim</Label>
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {fabricData?.materials.map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedMaterial && (
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {material?.suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.pricing}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="quantity">Quantity (meters/units)</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              min="1"
              placeholder="Enter quantity"
            />
          </div>
          
          {selectedSupplier && quantity > 0 && (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-stone-600 mb-2">Estimated Total</p>
                  <p className="text-3xl font-bold text-amber-700">
                    ${estimate.toLocaleString()}
                  </p>
                  <p className="text-xs text-stone-500 mt-2">
                    *Estimate based on supplier pricing and quantity discounts
                  </p>
                  {quantity >= 500 && (
                    <p className="text-xs text-green-600 mt-1">
                      Bulk discount applied!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {selectedSupplier && (
              <Button 
                className="flex-1 bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  const supplier = material?.suppliers.find(s => s.id === selectedSupplier);
                  if (supplier) {
                    window.open(`https://wa.me/${supplier.contact.replace(/\D/g, '')}?text=Hi, I'm interested in ${material.name} for ${quantity} units. My estimated budget is $${estimate.toLocaleString()}.`, '_blank');
                  }
                }}
              >
                Contact Supplier
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceEstimator;
