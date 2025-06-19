
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompareItem {
  id: string;
  name: string;
  category: string;
  gsm: number;
  width: string;
  composition: string;
  price: number;
  supplier: string;
  certifications: string[];
  sustainability: string[];
  image?: string;
  rating?: number;
  moq: number;
}

interface CompareModalProps {
  items: CompareItem[];
  open: boolean;
  onClose: () => void;
  onRemoveItem: (itemId: string) => void;
}

const CompareModal: React.FC<CompareModalProps> = ({
  items,
  open,
  onClose,
  onRemoveItem
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onClose]);

  const specs = [
    { key: 'gsm', label: 'GSM', unit: 'g/m²' },
    { key: 'width', label: 'Width', unit: '' },
    { key: 'composition', label: 'Composition', unit: '' },
    { key: 'price', label: 'Price', unit: '/yard', format: (v: any) => `$${v.toFixed(2)}` },
    { key: 'moq', label: 'MOQ', unit: ' yards' },
    { key: 'supplier', label: 'Supplier', unit: '' }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Compare Fabrics</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-auto max-h-[calc(90vh-120px)]">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-stone-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-stone-600">{item.category}</p>
                    {item.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-sm">{item.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {item.image && (
                  <div className="aspect-square bg-stone-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  {specs.map(spec => (
                    <div key={spec.key} className="flex justify-between">
                      <span className="text-stone-600">{spec.label}:</span>
                      <span className="font-medium">
                        {spec.format
                          ? spec.format(item[spec.key as keyof CompareItem])
                          : `${item[spec.key as keyof CompareItem]}${spec.unit}`}
                      </span>
                    </div>
                  ))}
                </div>

                {item.certifications.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-stone-700 mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.certifications.map(cert => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-6">
              {/* Headers */}
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute -top-2 -right-2 z-10 bg-white shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    
                    {item.image ? (
                      <div className="aspect-square bg-stone-100 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-4xl text-stone-400">📄</span>
                      </div>
                    )}

                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-stone-600 mb-2">{item.category}</p>
                    
                    {item.rating && (
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-sm">{item.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Comparison Rows */}
              {specs.map((spec, specIndex) => (
                <React.Fragment key={spec.key}>
                  <div className="col-span-3 grid grid-cols-3 gap-6 py-3 border-t border-stone-200">
                    {items.map((item, itemIndex) => (
                      <motion.div
                        key={`${item.id}-${spec.key}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: (specIndex * 0.1) + (itemIndex * 0.05) }}
                        className="text-center"
                      >
                        {itemIndex === 0 && (
                          <div className="text-sm font-medium text-stone-700 mb-2">
                            {spec.label}
                          </div>
                        )}
                        <div className="font-medium">
                          {spec.format
                            ? spec.format(item[spec.key as keyof CompareItem])
                            : `${item[spec.key as keyof CompareItem]}${spec.unit}`}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </React.Fragment>
              ))}

              {/* Certifications */}
              <div className="col-span-3 grid grid-cols-3 gap-6 py-4 border-t border-stone-200">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.id}-certs`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    className="text-center"
                  >
                    {index === 0 && (
                      <div className="text-sm font-medium text-stone-700 mb-2">
                        Certifications
                      </div>
                    )}
                    <div className="flex flex-wrap justify-center gap-1">
                      {item.certifications.map(cert => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-stone-200 p-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Contact All Suppliers
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompareModal;
