
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Phone, MessageCircle, X } from 'lucide-react';
import { getAllSuppliers } from '@/data/fabricData';

interface SupplierComparisonProps {
  supplierIds: string[];
  onClose: () => void;
}

const SupplierComparison = ({ supplierIds, onClose }: SupplierComparisonProps) => {
  const allSuppliers = getAllSuppliers();
  const suppliers = supplierIds.map(id => allSuppliers.find(s => s.id === id)).filter(Boolean);

  if (suppliers.length !== 2) return null;

  const [supplier1, supplier2] = suppliers;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Supplier Comparison
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {[supplier1, supplier2].map((supplier, index) => (
            <Card key={supplier.id} className="border-2 border-stone-200">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-stone-800 mb-2">
                    {supplier.name}
                  </h3>
                  <div className="flex items-center justify-center text-stone-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {supplier.location}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-4 h-4 ${
                          i < supplier.rating ? 'text-yellow-500 fill-current' : 'text-stone-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-stone-600">
                      ({supplier.rating}/5)
                    </span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {supplier.trustBadge}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-stone-500 mb-1">Pricing</p>
                    <p className="text-2xl font-bold text-amber-700">
                      {supplier.pricing}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-stone-500 mb-1">Contact</p>
                    <p className="font-medium text-stone-800">{supplier.contact}</p>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => window.open(`https://wa.me/${supplier.contact.replace(/\D/g, '')}`, '_blank')}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open(`tel:${supplier.contact}`, '_blank')}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-stone-50 rounded-lg">
          <h4 className="font-semibold text-stone-800 mb-2">Quick Comparison</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-stone-600">Criteria</div>
            <div className="text-center font-medium text-stone-600">{supplier1.name}</div>
            <div className="text-center font-medium text-stone-600">{supplier2.name}</div>
            
            <div className="text-stone-600">Rating</div>
            <div className="text-center">{supplier1.rating}/5</div>
            <div className="text-center">{supplier2.rating}/5</div>
            
            <div className="text-stone-600">Trust Badge</div>
            <div className="text-center text-xs">{supplier1.trustBadge}</div>
            <div className="text-center text-xs">{supplier2.trustBadge}</div>
            
            <div className="text-stone-600">Pricing</div>
            <div className="text-center">{supplier1.pricing}</div>
            <div className="text-center">{supplier2.pricing}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierComparison;
