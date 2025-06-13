
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fabricTypes } from '@/data/fabricData';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/explore${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`
    );
  };

  const trendingFabrics = fabricTypes.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <motion.section
        className="flex-1 flex items-center justify-center px-4 py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-6xl font-bold text-stone-800 mb-4">Weave</h1>
            <p className="text-xl text-stone-600 mb-8">
              Discover, compare, and source premium textiles for your next
              collection
            </p>
          </motion.div>
          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <Input
                placeholder="Search fabrics, construction, or suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-32 py-6 text-lg bg-white/80 backdrop-blur-sm border-stone-200 rounded-full shadow-lg"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6"
              >
                Search
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.form>
          {/* Start Exploring CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              onClick={() => navigate("/explore")}
              variant="outline"
              size="lg"
              className="bg-white/60 backdrop-blur-sm hover:bg-white/80"
            >
              Start Exploring
            </Button>
          </motion.div>{" "}
        </div>{" "}
      </motion.section>

      {/* Trending Fabrics */}
      <motion.section
        className="py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 text-center mb-12">
            Trending Fabrics
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {trendingFabrics.map((fabric, index) => (
              <motion.div
                key={fabric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02, rotate: 1 }}
                className="cursor-pointer"
                onClick={() => navigate("/explore")}
              >
                <Card className="bg-white/60 backdrop-blur-sm border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-stone-200 to-stone-300 rounded-t-lg"></div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-stone-800 mb-2">
                        {fabric.name}
                      </h3>
                      <p className="text-stone-600 text-sm mb-3">
                        {fabric.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-stone-500 bg-stone-100/80 px-2 py-1 rounded">
                          {fabric.weight}
                        </span>
                        <span className="text-xs text-amber-600 font-medium">
                          {fabric.category}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
