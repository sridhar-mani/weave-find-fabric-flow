
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Heart } from 'lucide-react';
import { FabricType } from '@/data/fabricData';

interface FabricCardProps {
  fabric: FabricType;
  onClick: () => void;
  onAddToCollection?: () => void;
}

const FabricCard = ({ fabric, onClick, onAddToCollection }: FabricCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer group"
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border border-stone-200/60 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
        <CardContent className="p-0">
          {/* Image Placeholder with Gradient Overlay */}
          <div className="aspect-square bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 relative overflow-hidden" onClick={onClick}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-amber-100/30 via-transparent to-stone-300/20"
              whileHover={{ scale: 1.1, rotate: 1 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Fabric Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.1),transparent_70%)]" />
            
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/95 hover:bg-white text-stone-600 hover:text-red-500 shadow-lg backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Heart className="w-4 h-4" />
              </Button>
              {onAddToCollection && (
                <Button
                  size="sm"
                  className="h-8 w-8 p-0 bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCollection();
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Price Tag */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-3 py-1 shadow-md">
                ${fabric.price}
              </Badge>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-5" onClick={onClick}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-stone-800 text-base line-clamp-1 group-hover:text-amber-600 transition-colors">
                {fabric.name}
              </h3>
              <Badge 
                variant="secondary" 
                className="text-xs bg-gradient-to-r from-stone-100 to-stone-200 text-stone-700 border border-stone-300/50"
              >
                {fabric.category}
              </Badge>
            </div>
            
            <p className="text-stone-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {fabric.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full font-medium">
                  {fabric.weight}
                </span>
                <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full font-medium">
                  {fabric.blend}
                </span>
              </div>
            </div>

            {/* Certifications */}
            {fabric.certifications.length > 0 && (
              <div className="mt-3 pt-3 border-t border-stone-100">
                <div className="flex flex-wrap gap-1">
                  {fabric.certifications.slice(0, 2).map((cert) => (
                    <Badge 
                      key={cert} 
                      variant="outline" 
                      className="text-xs text-green-700 border-green-200 bg-green-50"
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FabricCard;
