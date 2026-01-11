
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { HeritageCategory, InventoryItem } from '../types';
import { Package, Globe, Ruler, MapPin } from 'lucide-react';

interface DashboardProps {
  items: InventoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  const stats = [
    { title: 'إجمالي القطع', value: items.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'تراث مادي', value: items.filter(i => i.category === HeritageCategory.MATERIAL).length, icon: Ruler, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'تراث لامادي', value: items.filter(i => i.category === HeritageCategory.IMMATERIAL).length, icon: Globe, color: 'text-teal-600', bg: 'bg-teal-50' },
    { title: 'مواقع مسجلة', value: new Set(items.map(i => `${i.gps.lat}-${i.gps.lng}`)).size, icon: MapPin, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const categoryData = [
    { name: 'مادي', value: items.filter(i => i.category === HeritageCategory.MATERIAL).length },
    { name: 'لامادي', value: items.filter(i => i.category === HeritageCategory.IMMATERIAL).length },
  ];

  const COLORS = ['#b45309', '#0f766e'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 space-x-reverse">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 text-slate-800">توزيع التصنيفات</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 text-slate-800">الحالة الفيزيائية للقطع</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={items.slice(0, 5)}>
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="weight" name="الوزن (غ)" fill="#b45309" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4 text-slate-800">آخر الإضافات</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-slate-100">
                <th className="pb-3 px-4 font-medium">رقم الجرد</th>
                <th className="pb-3 px-4 font-medium">اسم القطعة</th>
                <th className="pb-3 px-4 font-medium">التصنيف</th>
                <th className="pb-3 px-4 font-medium">تاريخ الإضافة</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(-5).reverse().map((item) => (
                <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-mono text-sm">{item.inventoryNumber}</td>
                  <td className="py-4 px-4 font-bold">{item.name}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.category === HeritageCategory.MATERIAL ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700'
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400 text-sm">{new Date(item.createdAt).toLocaleDateString('ar-DZ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
