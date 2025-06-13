
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FabricType } from '@/data/fabricData';

interface FabricCardProps {
  fabric: FabricType;
  onClick: () => void;
}

const FabricCard = ({ fabric, onClick }: FabricCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, rotate: 1 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="bg-white/60 backdrop-blur-sm border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          {/* Image Placeholder */}
          <div className="aspect-square bg-gradient-to-br from-stone-200 to-stone-300 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-stone-200/20"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-stone-800 text-sm line-clamp-1">
                {fabric.name}
              </h3>
              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                {fabric.category}
              </Badge>
            </div>
            
            <p className="text-stone-600 text-xs mb-3 line-clamp-2">
              {fabric.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500 bg-stone-100/80 px-2 py-1 rounded">
                {fabric.weight}
              </span>
              <span className="text-xs text-stone-700 font-medium">
                {fabric.blend}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FabricCard;
