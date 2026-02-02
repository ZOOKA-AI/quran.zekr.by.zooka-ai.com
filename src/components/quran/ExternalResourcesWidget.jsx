import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export default function ExternalResourcesWidget() {
  const { data: resources = [] } = useQuery({
    queryKey: ['external-resources'],
    queryFn: () => base44.entities.ExternalResource.filter({ is_featured: true })
  });

  return (
    <Card className="bg-slate-900/60 backdrop-blur-xl border-amber-500/20 p-6">
      <h3 className="text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
        <ExternalLink className="w-5 h-5" />
        روابط مفيدة
      </h3>
      <div className="space-y-3">
        {resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10 hover:border-amber-500/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{resource.icon}</span>
              <div>
                <p className="text-white font-bold text-sm">{resource.name}</p>
                <p className="text-emerald-300 text-xs">{resource.description}</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </a>
        ))}
      </div>
    </Card>
  );
}