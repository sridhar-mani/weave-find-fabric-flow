
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fabricTypes } from '@/data/fabricData';
import PackDrawer from '@/components/PackDrawer';

const Moodboard = () => {
  const [moodboardItems, setMoodboardItems] = useState<string[]>([]);
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('moodboard');
    if (saved) {
      setMoodboardItems(JSON.parse(saved));
    }
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(moodboardItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMoodboardItems(items);
    localStorage.setItem('moodboard', JSON.stringify(items));
  };

  const removeFabric = (fabricId: string) => {
    const updated = moodboardItems.filter(id => id !== fabricId);
    setMoodboardItems(updated);
    localStorage.setItem('moodboard', JSON.stringify(updated));
  };

  const openDrawer = (fabricId: string) => {
    setSelectedFabric(fabricId);
  };

  const closeDrawer = () => {
    setSelectedFabric(null);
  };

  return (
    <div className="min-h-screen pt-16 p-6">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">My Moodboard</h1>
          <p className="text-stone-600">
            Drag and drop to reorder your fabric selections. Double-click to view details.
          </p>
        </div>

        {moodboardItems.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-stone-600 mb-4">Your moodboard is empty</p>
            <Button onClick={() => window.location.href = '/explore'}>
              Start Exploring Fabrics
            </Button>
          </motion.div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="moodboard">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {moodboardItems.map((fabricId, index) => {
                    const fabric = fabricTypes.find(f => f.id === fabricId);
                    if (!fabric) return null;

                    return (
                      <Draggable key={fabricId} draggableId={fabricId} index={index}>
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDra gging ? 'rotate-3 scale-105' : ''}`}
                            whileHover={{ scale: 1.02 }}
                            onDoubleClick={() => openDrawer(fabricId)}
                          >
                            <Card className="bg-white/60 backdrop-blur-sm border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
                              <CardContent className="p-0">
                                <div className="aspect-square bg-gradient-to-br from-stone-200 to-stone-300 relative">
                                  <div className="absolute top-2 right-2 flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDrawer(fabricId);
                                      }}
                                    >
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="w-8 h-8 p-0 bg-red-500/80 hover:bg-red-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeFabric(fabricId);
                                      }}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="p-4">
                                  <h3 className="font-semibold text-stone-800 text-sm mb-1">
                                    {fabric.name}
                                  </h3>
                                  <p className="text-stone-600 text-xs line-clamp-2">
                                    {fabric.description}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </motion.div>

      <PackDrawer 
        fabricId={selectedFabric} 
        isOpen={!!selectedFabric} 
        onClose={closeDrawer} 
      />
    </div>
  );
};

export default Moodboard;
