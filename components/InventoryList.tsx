
import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, FileJson, FileText, Archive } from 'lucide-react';
import { InventoryItem, HeritageCategory } from '../types';

interface InventoryListProps {
  items: InventoryItem[];
  onDeleteItem: (id: string) => void;
  onSelectItem: (item: InventoryItem) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onDeleteItem, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | HeritageCategory>('all');

  const filteredItems = items.filter(item => {
    // Safety check for potential undefined fields
    const itemName = item?.name || '';
    const itemInv = item?.inventoryNumber || '';
    const search = searchTerm?.toLowerCase() || '';
    
    const matchesSearch = itemName.toLowerCase().includes(search) || 
                          itemInv.toLowerCase().includes(search);
    const matchesFilter = filter === 'all' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="بحث برقم الجرد أو الاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
          />
        </div>
        
        <div className="flex items-center space-x-3 space-x-reverse">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none"
          >
            <option value="all">جميع التصنيفات</option>
            <option value={HeritageCategory.MATERIAL}>تراث مادي</option>
            <option value={HeritageCategory.IMMATERIAL}>تراث لامادي</option>
          </select>
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-amber-700 hover:border-amber-700 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">صورة</th>
                <th className="px-6 py-4">رقم الجرد</th>
                <th className="px-6 py-4">الاسم</th>
                <th className="px-6 py-4">التصنيف</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.length > 0 ? filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={item.images?.[0] || 'https://picsum.photos/100/100?grayscale'} 
                      alt="" 
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-slate-700">
                    {item.inventoryNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-black text-slate-800">
                    {item.name || 'بدون اسم'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      item.category === HeritageCategory.MATERIAL ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700'
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-slate-500 font-medium">{item.physicalStatus}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button 
                        onClick={() => onSelectItem(item)}
                        className="p-2 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Archive size={48} className="text-slate-200 mb-4" />
                      <p className="text-slate-400 font-bold">لا توجد سجلات مطابقة</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-bold">إجمالي السجلات: {filteredItems.length}</p>
          <div className="flex space-x-2 space-x-reverse">
            <button className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <FileJson size={14} />
              <span>تصدير JSON</span>
            </button>
            <button className="flex items-center space-x-1 space-x-reverse px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all">
              <FileText size={14} />
              <span>تصدير Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
