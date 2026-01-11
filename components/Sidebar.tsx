
import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Archive, 
  Map as MapIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  ScanQrCode,
  Box
} from 'lucide-react';
import { Logo, AGENCY_NAME } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'inventory-list', label: 'سجل الجرد', icon: Archive },
    { id: 'add-item', label: 'إضافة قطعة جديدة', icon: PlusCircle },
    { id: 'scan-qr', label: 'مسح QR', icon: ScanQrCode },
    { id: 'map', label: 'الخريطة التفاعلية', icon: MapIcon },
    { id: 'statistics', label: 'التحليلات والإحصاء', icon: BarChart3 },
    { id: 'ar-viewer', label: 'المتحف الافتراضي', icon: Box },
  ];

  return (
    <div className="w-72 bg-slate-900 h-screen sticky top-0 flex flex-col text-slate-300">
      <div className="p-6 border-b border-slate-800 flex flex-col items-center">
        <Logo className="w-16 h-16 mb-4" />
        <h2 className="text-xs text-center font-bold text-slate-100 leading-relaxed">
          {AGENCY_NAME}
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto mt-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-amber-700 text-white shadow-lg' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-amber-200' : ''} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center space-x-3 space-x-reverse mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-amber-500 font-bold">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{user?.username}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-2 space-x-reverse px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
