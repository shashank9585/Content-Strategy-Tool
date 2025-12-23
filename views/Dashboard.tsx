
import React from 'react';
import { Zap, Search, Palette, ChevronRight, TrendingUp, Users, Target } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const stats = [
    { label: 'Active Campaigns', value: '12', icon: Target, color: 'text-blue-600' },
    { label: 'Total Reach', value: '4.2M', icon: Users, color: 'text-teal-600' },
    { label: 'Avg CPC Savings', value: '18%', icon: TrendingUp, color: 'text-emerald-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div 
          onClick={() => setActiveTab('lab')}
          className="group cursor-pointer bg-teal-900 p-8 rounded-3xl text-white overflow-hidden relative shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 bg-teal-400/20 rounded-xl flex items-center justify-center mb-6">
              <Zap className="text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Launch New Campaign</h3>
            <p className="text-teal-100/80 mb-6 max-w-sm">Create high-impact visuals, strategy and PPC insights using our master prompt engine.</p>
            <div className="flex items-center text-teal-400 font-semibold group-hover:translate-x-2 transition-transform">
              Enter Studio <ChevronRight size={20} className="ml-1" />
            </div>
          </div>
          <Zap className="absolute -right-8 -bottom-8 text-teal-800 w-48 h-48 opacity-20" />
        </div>

        <div 
          onClick={() => setActiveTab('competitor')}
          className="group cursor-pointer bg-white border border-slate-200 p-8 rounded-3xl text-slate-900 overflow-hidden relative shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Search className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Competitor Intel</h3>
            <p className="text-slate-500 mb-6 max-w-sm">Analyze URLs to uncover content strategies, engagement patterns, and spend estimates.</p>
            <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
              Run Analysis <ChevronRight size={20} className="ml-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h4 className="text-lg font-bold mb-6 text-slate-800">Recent Activity</h4>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Target size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">TechSaaS Growth Q4</p>
                  <p className="text-xs text-slate-500">Campaign Lab • 2 hours ago</p>
                </div>
              </div>
              <button className="text-teal-600 text-sm font-medium hover:underline">View Results</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
