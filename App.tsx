
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  History as HistoryIcon, 
  Settings, 
  LayoutGrid,
  Package,
  PieChart,
  Target
} from 'lucide-react';
import { CampaignLab } from './views/CampaignLab';
import { AutomationHub } from './views/AutomationHub';
import { CampaignHistoryView } from './views/CampaignHistoryView';
import { Overview } from './views/Overview';
import { BrandVoice, CampaignContent } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lab' | 'automation' | 'history' | 'settings'>('overview');
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [recalledCampaign, setRecalledCampaign] = useState<CampaignContent | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('campaign_brand_voices');
    if (saved) setBrandVoices(JSON.parse(saved));
  }, []);

  const saveBrandVoice = (voice: BrandVoice) => {
    setBrandVoices(prev => {
      const updated = [...prev, voice];
      localStorage.setItem('campaign_brand_voices', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteBrandVoice = (id: string) => {
    setBrandVoices(prev => {
      const updated = prev.filter(v => v.id !== id);
      localStorage.setItem('campaign_brand_voices', JSON.stringify(updated));
      return updated;
    });
  };

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 w-full px-5 py-4 rounded-2xl transition-all duration-300 group mb-2 ${
        activeTab === id 
          ? 'bg-teal-50 text-teal-700 shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={18} className={activeTab === id ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'} />
      <span className="font-bold text-xs tracking-tight uppercase">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col z-50 shrink-0">
        <div className="p-10 flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-100 rotate-3">
             <Package className="text-white" size={24} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-900 leading-none">STRATEGY<br/><span className="text-teal-600">CORE</span></span>
        </div>

        <nav className="flex-1 px-8 py-6">
          <NavItem id="overview" label="Overview" icon={PieChart} />
          <NavItem id="lab" label="Studio" icon={LayoutGrid} />
          <NavItem id="automation" label="Automation" icon={Zap} />
          <NavItem id="history" label="Archive" icon={HistoryIcon} />
        </nav>

        <div className="px-8 py-10 mt-auto">
          <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 mb-8 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AGENCY SCALE</span>
                <span className="text-[10px] font-black text-teal-600">84%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                <div className="bg-teal-500 h-full w-[84%] transition-all duration-1000"></div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 mt-4 tracking-tighter uppercase">Operational Capacity Reached</p>
            </div>
            <Target className="absolute -right-4 -bottom-4 text-teal-100/30 w-20 h-20 rotate-12" />
          </div>
          
          <button className="flex items-center space-x-3 w-full px-5 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-teal-600 transition-all font-bold text-xs tracking-tight uppercase">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar">
          {activeTab === 'overview' && <Overview onNavigate={setActiveTab} />}
          {activeTab === 'lab' && (
            <CampaignLab 
              voices={brandVoices} 
              onSaveVoice={saveBrandVoice} 
              onDeleteVoice={deleteBrandVoice}
              recalledCampaign={recalledCampaign}
              onClearRecall={() => setRecalledCampaign(null)}
            />
          )}
          {activeTab === 'automation' && <AutomationHub />}
          {activeTab === 'history' && <CampaignHistoryView onRecall={(c) => { setRecalledCampaign(c); setActiveTab('lab'); }} />}
          {activeTab === 'settings' && <div className="p-8 flex items-center justify-center h-full text-slate-300 font-bold uppercase tracking-widest text-[10px]">Syncing Governance Protocols...</div>}
        </div>
      </main>
    </div>
  );
};

export default App;