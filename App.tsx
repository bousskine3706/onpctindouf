
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryForm from './components/InventoryForm';
import InventoryList from './components/InventoryList';
import { InventoryItem, User, UserRole } from './types';
import { getAllItems, saveInventoryItem, deleteItem } from './services/dbService';
import { APP_NAME, Logo } from './constants';
import { Bell, Search, Settings, Box, Maximize2, ScanQrCode, Camera, Download, Menu } from 'lucide-react';

const ARViewer: React.FC<{ items: InventoryItem[] }> = ({ items }) => {
  const itemsWith3D = items.filter(i => i.model3d);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(itemsWith3D[0] || null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in pb-20 lg:pb-0">
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[400px]">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-800">{selectedItem?.name || 'اختر قطعة'}</h3>
            <p className="text-[10px] text-slate-500">معاينة تفاعلية 360°</p>
          </div>
          <button className="bg-amber-700 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg flex items-center space-x-2 space-x-reverse">
            <Maximize2 size={12} />
            <span>AR</span>
          </button>
        </div>
        <div className="flex-1 relative bg-[#f1f5f9]">
          {selectedItem?.model3d ? (
            <model-viewer 
              src={selectedItem.model3d} 
              auto-rotate 
              camera-controls 
              shadow-intensity="1" 
              ar 
              environment-image="neutral"
              style={{ width: '100%', height: '100%' }}
            ></model-viewer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-10 text-center">
               <Box size={60} className="mb-4 opacity-20" />
               <p className="font-bold text-sm">لا يوجد نموذج 3D متاح حالياً لهذه القطعة</p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 overflow-y-auto max-h-[400px] lg:max-h-full">
        <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-tighter">المكتبة الافتراضية</h3>
        <div className="space-y-3">
          {itemsWith3D.map(item => (
            <button 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-2xl transition-all border ${selectedItem?.id === item.id ? 'border-amber-500 bg-amber-50' : 'border-slate-50'}`}
            >
              <img src={item.images[0]} className="w-12 h-12 rounded-xl object-cover shrink-0" />
              <div className="text-right">
                <p className="font-bold text-slate-800 text-xs">{item.name}</p>
                <p className="text-[9px] text-slate-400">{item.inventoryNumber}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user] = useState<User>({ username: 'باحث ميداني', role: UserRole.RESEARCHER });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllItems();
        setItems(data);
      } catch (error) { console.error(error); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleSaveItem = async (item: InventoryItem) => {
    await saveInventoryItem(item);
    setItems(await getAllItems());
    setActiveTab('inventory-list');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Tajawal'] text-slate-900 overflow-hidden" dir="rtl">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed lg:static inset-0 z-50 transition-transform duration-300`}>
        <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        <div className="relative w-72 h-full">
           <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} user={user} onLogout={() => {}} />
        </div>
      </div>
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center space-x-3 lg:space-x-6 space-x-reverse">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-xl">
              <Menu size={24} />
            </button>
            <h1 className="text-sm lg:text-xl font-black text-slate-900 truncate max-w-[150px] lg:max-w-none">{APP_NAME}</h1>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4 space-x-reverse">
            <div className="hidden sm:flex bg-green-500/10 text-green-700 px-3 py-1 rounded-full items-center space-x-1.5 space-x-reverse border border-green-200">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[9px] font-black uppercase">Offline Mode</span>
            </div>
            <button className="p-2 bg-slate-50 text-slate-500 rounded-xl border border-slate-200"><Bell size={18} /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 mobile-safe-area">
          <div className="max-w-7xl mx-auto h-full">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center h-full">
                  <Logo className="w-16 h-16 mb-4 animate-bounce" />
                  <p className="font-black text-slate-400 text-sm">جاري مزامنة قاعدة البيانات المحلية...</p>
               </div>
            ) : (
              <>
                {activeTab === 'dashboard' && <Dashboard items={items} />}
                {activeTab === 'add-item' && <InventoryForm onSave={handleSaveItem} onCancel={() => setActiveTab('dashboard')} />}
                {activeTab === 'inventory-list' && <InventoryList items={items} onDeleteItem={async (id) => { if(confirm("حذف؟")) { await deleteItem(id); setItems(await getAllItems()); } }} onSelectItem={() => {}} />}
                {activeTab === 'ar-viewer' && <ARViewer items={items} />}
                {activeTab === 'scan-qr' && (
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-full text-center">
                    <div className="w-48 h-48 border-4 border-amber-200 border-dashed rounded-[2rem] flex items-center justify-center bg-slate-50 mb-6 relative overflow-hidden">
                       <ScanQrCode size={80} className="text-amber-200" />
                       <div className="absolute inset-0 bg-amber-500/10 animate-[scan_2s_linear_infinite] h-1 w-full top-0"></div>
                    </div>
                    <h2 className="text-xl font-black mb-2">ماسح الباركود الميداني</h2>
                    <p className="text-xs text-slate-400 mb-6">قم بتوجيه الكاميرا نحو ملصق القطعة</p>
                    <button className="bg-amber-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-3">
                      <Camera size={20} /> تشغيل الماسح
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom Nav for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around p-3 z-40 mobile-safe-area shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
           <button onClick={() => setActiveTab('dashboard')} className={`p-2 flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-amber-700' : 'text-slate-400'}`}>
              <Box size={20} /><span className="text-[9px] font-bold">الرئيسية</span>
           </button>
           <button onClick={() => setActiveTab('inventory-list')} className={`p-2 flex flex-col items-center gap-1 ${activeTab === 'inventory-list' ? 'text-amber-700' : 'text-slate-400'}`}>
              <Search size={20} /><span className="text-[9px] font-bold">السجل</span>
           </button>
           <button onClick={() => setActiveTab('add-item')} className="bg-amber-700 text-white p-4 rounded-2xl -mt-8 shadow-xl border-4 border-white">
              <Maximize2 size={24} />
           </button>
           <button onClick={() => setActiveTab('scan-qr')} className={`p-2 flex flex-col items-center gap-1 ${activeTab === 'scan-qr' ? 'text-amber-700' : 'text-slate-400'}`}>
              <ScanQrCode size={20} /><span className="text-[9px] font-bold">QR</span>
           </button>
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 flex flex-col items-center gap-1 text-slate-400">
              <Menu size={20} /><span className="text-[9px] font-bold">المزيد</span>
           </button>
        </div>
      </main>
      
      <style>{`
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
};

export default App;
