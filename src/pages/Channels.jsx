import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Youtube, Radio, Globe, CheckCircle2, Play, ChevronLeft, Filter, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const platformIcons = {
  'YouTube': Youtube,
  'Radio': Radio,
  'Website': Globe,
  'Facebook': Globe,
  'Instagram': Globe,
  'TikTok': Globe
};

const filterTabs = [
  { id: 'all', label: 'الكل', icon: null },
  { id: 'podcast', label: 'بودكاست', icon: null },
  { id: 'قرآن', label: 'قرآن', icon: null },
  { id: 'دروس', label: 'دروس', icon: null },
  { id: 'برامج إسلامية', label: 'برامج', icon: null },
];

export default function ChannelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: channels = [], isLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      return await base44.entities.Channel.list();
    }
  });

  const { data: featuredChannels = [] } = useQuery({
    queryKey: ['featured-channels'],
    queryFn: async () => {
      return await base44.entities.Channel.filter({ is_featured: true });
    }
  });

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = !searchQuery || 
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === 'all' || channel.channel_type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const liveChannels = channels.filter(c => c.is_live);
  const topChannels = [...channels].sort((a, b) => (b.subscribers_count || 0) - (a.subscribers_count || 0)).slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black pb-32" dir="rtl">
      {/* Header with search */}
      <div className="sticky top-0 z-20 backdrop-blur-2xl bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button size="icon" className="rounded-full bg-slate-800 hover:bg-slate-700">
              <Plus className="w-5 h-5" />
            </Button>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="ابحث عن القنوات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:bg-slate-800"
              />
            </div>

            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Pills */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {filterTabs.map(tab => (
            <Button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`rounded-full px-6 flex-shrink-0 transition-all ${
                activeFilter === tab.id
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {!searchQuery && (
          <>
            {/* Start Listening Section */}
            {liveChannels.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <h2 className="text-3xl font-bold text-white mb-6">بدء الاستماع</h2>
                <div className="grid grid-cols-1 gap-4">
                  {liveChannels.slice(0, 3).map((channel, index) => {
                    const PlatformIcon = platformIcons[channel.platform] || Globe;
                    return (
                      <motion.div
                        key={channel.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-700/50 transition-all p-4 cursor-pointer group">
                          <div className="flex items-center gap-4">
                            {channel.logo_url ? (
                              <img 
                                src={channel.logo_url} 
                                alt={channel.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                                <PlatformIcon className="w-8 h-8 text-white" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-bold text-lg">{channel.name}</h3>
                                {channel.is_verified && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                              </div>
                              <p className="text-slate-400 text-sm truncate mb-2">{channel.description}</p>
                              <Badge className="bg-red-600 text-white animate-pulse">
                                <Play className="w-3 h-3 ml-1" />
                                بث مباشر
                              </Badge>
                            </div>
                            <Button
                              size="icon"
                              className="rounded-full bg-emerald-600 hover:bg-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => window.open(channel.url, '_blank')}
                            >
                              <Play className="w-5 h-5" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Start with these */}
            {featuredChannels.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">ابدأ مع تلك القنوات</h2>
                  <Button variant="ghost" className="text-slate-400 hover:text-white">
                    المزيد
                    <ChevronLeft className="w-4 h-4 mr-2" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {featuredChannels.slice(0, 8).map((channel, index) => {
                    const PlatformIcon = platformIcons[channel.platform] || Globe;
                    return (
                      <motion.a
                        key={channel.id}
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="bg-slate-800/40 hover:bg-slate-700/50 border-slate-700/50 transition-all p-4 group">
                          <div className="relative mb-3">
                            {channel.cover_image_url ? (
                              <img 
                                src={channel.cover_image_url} 
                                alt={channel.name}
                                className="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full aspect-square bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                                <PlatformIcon className="w-12 h-12 text-white/60" />
                              </div>
                            )}
                            <Button
                              size="icon"
                              className="absolute bottom-2 left-2 rounded-full bg-emerald-600 hover:bg-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-bold text-sm truncate flex-1">{channel.name}</h3>
                            {channel.is_verified && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <Badge className="bg-emerald-600/80 text-white text-xs">
                              {channel.channel_type}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-xs line-clamp-2">{channel.description}</p>
                        </Card>
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Today's recommendations */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">توصيتنا لك اليوم</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {topChannels.slice(0, 4).map((channel, index) => {
                  const PlatformIcon = platformIcons[channel.platform] || Globe;
                  return (
                    <motion.a
                      key={channel.id}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 hover:from-slate-700/60 hover:to-slate-800/60 border-slate-700/50 transition-all overflow-hidden group">
                        <div className="aspect-square relative">
                          {channel.cover_image_url ? (
                            <img 
                              src={channel.cover_image_url} 
                              alt={channel.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                              <PlatformIcon className="w-16 h-16 text-white/40" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-slate-400 text-xs mb-1">{channel.channel_type}</p>
                            <h3 className="text-white font-bold text-lg mb-1">{channel.name}</h3>
                            <p className="text-slate-300 text-xs line-clamp-1">{channel.country}</p>
                          </div>
                        </div>
                      </Card>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* More like this */}
            {topChannels.length > 4 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">المزيد مثل</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {topChannels.slice(4).map((channel, index) => {
                    const PlatformIcon = platformIcons[channel.platform] || Globe;
                    return (
                      <motion.a
                        key={channel.id}
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex-shrink-0 w-48"
                      >
                        <div className="text-center group">
                          {channel.logo_url ? (
                            <img 
                              src={channel.logo_url} 
                              alt={channel.name}
                              className="w-48 h-48 rounded-full object-cover mx-auto mb-3 group-hover:scale-105 transition-transform shadow-2xl"
                            />
                          ) : (
                            <div className="w-48 h-48 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform shadow-2xl">
                              <PlatformIcon className="w-20 h-20 text-white/60" />
                            </div>
                          )}
                          <div className="bg-slate-800/80 rounded-lg p-3">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <h3 className="text-white font-bold text-sm truncate">{channel.name}</h3>
                              {channel.is_verified && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                            </div>
                            <p className="text-slate-400 text-xs">{channel.channel_type}</p>
                          </div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Search Results */}
        {searchQuery && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              نتائج البحث ({filteredChannels.length})
            </h2>
            {filteredChannels.length > 0 ? (
              <div className="space-y-2">
                {filteredChannels.map((channel, index) => {
                  const PlatformIcon = platformIcons[channel.platform] || Globe;
                  return (
                    <motion.a
                      key={channel.id}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-slate-800/30 hover:bg-slate-700/50 border-slate-700/50 transition-all p-4 group">
                        <div className="flex items-center gap-4">
                          {channel.logo_url ? (
                            <img 
                              src={channel.logo_url} 
                              alt={channel.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                              <PlatformIcon className="w-8 h-8 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-bold">{channel.name}</h3>
                              {channel.is_verified && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                            </div>
                            <p className="text-slate-400 text-sm line-clamp-1 mb-2">{channel.description}</p>
                            <div className="flex gap-2 flex-wrap">
                              <Badge className="bg-slate-700 text-slate-300 text-xs">
                                {channel.channel_type}
                              </Badge>
                              {channel.subscribers_count > 0 && (
                                <Badge className="bg-emerald-600/80 text-white text-xs">
                                  {(channel.subscribers_count / 1000000).toFixed(1)}M مشترك
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="icon"
                            className="rounded-full bg-emerald-600 hover:bg-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Play className="w-5 h-5" />
                          </Button>
                        </div>
                      </Card>
                    </motion.a>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-slate-800/30 border-slate-700/50 p-12 text-center">
                <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">لم يتم العثور على نتائج</p>
              </Card>
            )}
          </motion.div>
        )}

        {/* All Channels Library View */}
        {!searchQuery && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">مكتبتك الموسيقية</h2>
            <div className="space-y-2">
              {channels.map((channel, index) => {
                const PlatformIcon = platformIcons[channel.platform] || Globe;
                return (
                  <motion.a
                    key={channel.id}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-all cursor-pointer group">
                      {channel.logo_url ? (
                        <img 
                          src={channel.logo_url} 
                          alt={channel.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                          <PlatformIcon className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="text-white font-medium truncate">{channel.name}</h3>
                          {channel.is_verified && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                        </div>
                        <p className="text-slate-400 text-sm">{channel.channel_type}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                      >
                        <Play className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}