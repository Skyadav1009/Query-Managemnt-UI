import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  trend?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, colorClass, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-start justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        {trend && <p className="text-xs text-emerald-600 mt-2 font-medium">{trend}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};