
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fabricTypes } from '@/data/fabricData';

interface FabricVisualizerProps {
  fabric: string;
}

const FabricVisualizer = ({ fabric }: FabricVisualizerProps) => {
  const fabricInfo = fabricTypes.find(f => f.id === fabric);
  
  if (!fabricInfo) return null;

  return (
    <Card className="mb-8 overflow-hidden bg-white/90 backdrop-blur-sm border-stone-200">
      <CardContent className="p-0">
        <div className="relative">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-80">
              <img 
                src={fabricInfo.image}
                alt={fabricInfo.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>
            
            <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-stone-50 to-amber-50">
              <div className="mb-4">
                <Badge className="bg-amber-600 text-white mb-4">
                  {fabricInfo.category}
                </Badge>
                <h2 className="text-3xl font-bold text-stone-800 mb-3">
                  {fabricInfo.name}
                </h2>
                <p className="text-stone-600 text-lg leading-relaxed">
                  {fabricInfo.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <p className="text-sm text-stone-500">Weight</p>
                  <p className="font-semibold text-stone-800">{fabricInfo.weight}</p>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <p className="text-sm text-stone-500">Blend</p>
                  <p className="font-semibold text-stone-800">{fabricInfo.blend}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FabricVisualizer;
