import { useEffect, useState, type ReactNode } from 'react';
import { MapPin, Heart, Plane, Calendar } from 'lucide-react';
import { memoriesService } from '../../services/memories.service';
import { MemoryItem } from '../../types/memories.types';

const typeIcons: Record<string, ReactNode> = {
  event: <MapPin className="w-4 h-4 text-blue-500" />,
  timeline: <Heart className="w-4 h-4 text-pink-500" />,
  vacation: <Plane className="w-4 h-4 text-emerald-500" />,
};

export const OnThisDay = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);

  useEffect(() => {
    memoriesService.getOnThisDay().then(setMemories).catch(() => {});
  }, []);

  if (memories.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5 text-amber-600" />
        <h2 className="text-lg font-bold text-amber-800">On This Day</h2>
      </div>
      <div className="space-y-3">
        {memories.map((memory) => (
          <div key={`${memory.type}-${memory.id}`} className="flex items-start gap-3">
            <span className="flex-shrink-0 mt-0.5">{typeIcons[memory.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium">{memory.title}</p>
            </div>
            <span className="text-xs font-semibold bg-amber-200 text-amber-800 px-2 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
              {memory.yearsAgo}y ago
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
