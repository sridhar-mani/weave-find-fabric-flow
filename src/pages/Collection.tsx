
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { fabricTypes } from '@/data/fabricData';

interface CollectionItem {
  id: string;
  type: 'fabric' | 'trim';
  fabricId?: string;
  name: string;
  category: string;
}

const Collection = () => {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const { trackEvent } = useAnalytics();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
    localStorage.setItem('collection', JSON.stringify(newItems));
  };

  const addFabric = (fabricId: string) => {
    const fabric = fabricTypes.find(f => f.id === fabricId);
    if (!fabric) return;

    const newItem: CollectionItem = {
      id: `fabric-${fabricId}-${Date.now()}`,
      type: 'fabric',
      fabricId,
      name: fabric.name,
      category: fabric.category
    };

    setItems([...items, newItem]);
    localStorage.setItem('collection', JSON.stringify([...items, newItem]));
    trackEvent('add_to_collection', { fabric_id: fabricId });
  };

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    localStorage.setItem('collection', JSON.stringify(newItems));
  };

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-stone-800">My Collection</h1>
          <Button
            onClick={() => addFabric(fabricTypes[0].id)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Sample
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-500 mb-4">Your collection is empty</p>
            <Button
              onClick={() => addFabric(fabricTypes[0].id)}
              variant="outline"
            >
              Add your first fabric
            </Button>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="collection">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${
                            snapshot.isDragging ? 'rotate-2 shadow-xl' : ''
                          }`}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                          >
                            <Card className="bg-white/60 backdrop-blur-sm border-stone-200 shadow-md hover:shadow-xl transition-all duration-300">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3 className="font-semibold text-stone-800 mb-1">
                                      {item.name}
                                    </h3>
                                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                                      {item.category}
                                    </Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(item.id)}
                                    className="text-stone-400 hover:text-red-500"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                
                                <div className="aspect-square bg-gradient-to-br from-stone-200 to-stone-300 rounded-lg mb-3"></div>
                                
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="flex-1">
                                    View Details
                                  </Button>
                                  <Button size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700">
                                    Request Swatch
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </motion.div>
    </div>
  );
};

export default Collection;
