
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, Info, Phone } from 'lucide-react';

interface NavigationProps {
  selectedFabric: string | null;
  onBack: () => void;
  showEstimator: () => void;
}

const Navigation = ({ selectedFabric, onBack, showEstimator }: NavigationProps) => {
  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedFabric && (
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-stone-600 hover:text-stone-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Fabrics
              </Button>
            )}
            <h1 className="text-xl font-bold text-stone-800">
              Textile Supplier Hub
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedFabric && (
              <Button
                variant="outline"
                size="sm"
                onClick={showEstimator}
                className="hidden sm:flex"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Price Estimator
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Info className="w-4 h-4 mr-2" />
              About
            </Button>
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
