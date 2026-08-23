import { DashboardTab } from '../types';
import { CalendarDays, Waves, Flower2, Bot, Clock, Crown, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  completedDaysCount: number;
  isDay7Completed: boolean;
}

export function BottomNav({
  activeTab,
  onSelectTab,
  completedDaysCount,
  isDay7Completed,
}: BottomNavProps) {
  const tabs = [
    {
      id: 'roadmap' as DashboardTab,
      label: '7 Días',
      icon: CalendarDays,
      badge: `${completedDaysCount}/7`,
    },
    {
      id: 'sounds' as DashboardTab,
      label: 'Frecuencias',
      icon: Waves,
    },
    {
      id: 'garden' as DashboardTab,
      label: 'Jardín',
      icon: Flower2,
    },
    {
      id: 'leonardo_ai' as DashboardTab,
      label: 'Leonardo IA',
      icon: Bot,
      badge: 'IA',
    },
    {
      id: 'calculator' as DashboardTab,
      label: 'Ciclos 90m',
      icon: Clock,
    },
    {
      id: 'premium' as DashboardTab,
      label: isDay7Completed ? 'VIP' : 'Ajustes',
      icon: isDay7Completed ? Crown : Settings,
      highlight: isDay7Completed,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-indigo-950/80 px-2 py-1.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isSelected
                  ? 'text-cyan-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isSelected ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 text-[9px] font-extrabold px-1 rounded-full ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-indigo-900 text-indigo-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {tab.highlight && !isSelected && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>

              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>

              {isSelected && (
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
