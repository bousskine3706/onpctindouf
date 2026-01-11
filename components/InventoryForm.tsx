
import React, { useState, useRef } from 'react';
import { 
  Save, 
  Camera, 
  Info, 
  Ruler, 
  History, 
  Gavel, 
  MapPin, 
  Sparkles,
  Loader2,
  Box,
  Video,
  FileUp,
  X,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Play,
  Maximize2,
  Palette,
  ShieldCheck,
  Globe,
  Tag
} from 'lucide-react';
import { HeritageCategory, CulturalStyle, LocationType, InventoryItem } from '../types';
import { analyzeArtifactImage } from '../services/aiService';

interface InventoryFormProps {
  onSave: (item: InventoryItem) => void;
  onCancel: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFields, setAiFields] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    id: crypto.randomUUID(),
    inventoryNumber: `INV-${Date.now().toString().slice(-6)}`,
    category: HeritageCategory.MATERIAL,
    culturalStyle: CulturalStyle.SAHRAWI,
    isDisplayable: true,
    images: [],
    video: undefined,
    model3d: undefined,
    gps: { lat: 27.6761, lng: -8.1277, type: LocationType.DISCOVERY },
    physicalStatus: 'جيدة',
    ownership: 'الديوان الوطني للحظيرة الثقافية لتندوف',
    legalStatus: 'محمية وطنية',
    conservationState: 'مستقرة',
    acquisitionMethod: 'جمع ميداني',
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const triggerAIAnalysis = async () => {
    if (!formData.images || formData.images.length === 0) {
      alert("يرجى رفع صورة للقطعة أولاً في الخطوة رقم 5 ليتمكن المساعد الذكي من تحليلها.");
      setStep(5);
      return;
    }

    setIsAnalyzing(true);
    setAiFields([]);
    
    try {
      const base64Data = formData.images[0].split(',')[1];
      const result = await analyzeArtifactImage(base64Data);
      
      if (result) {
        setFormData(prev => ({
          ...prev,
          name: result.nameSuggestion,
          category: result.category.includes('لامادي') ? HeritageCategory.IMMATERIAL : HeritageCategory.MATERIAL,
          material: result.material,
          historicalPeriod: result.period,
          notes: result.description,
          socialUsage: result.description,
          function: result.nameSuggestion // Defaulting function to name for AI fill
        }));
        setAiFields(['name', 'category', 'material', 'historicalPeriod', 'notes', 'socialUsage']);
        setStep(1); 
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'model') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      if (type === 'image') {
        setFormData(prev => ({ ...prev, images: [base64, ...(prev.images || [])] }));
      } else if (type === 'video') {
        setFormData(prev => ({ ...prev, video: base64 }));
      } else if (type === 'model') {
        setFormData(prev => ({ ...prev, model3d: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const steps = [
    { id: 1, title: 'معلومات عامة', icon: Info },
    { id: 2, title: 'وصف تقني وقياسات', icon: Ruler },
    { id: 3, title: 'سياق ثقافي وتاريخي', icon: History },
    { id: 4, title: 'الوضع القانوني والحفظ', icon: Gavel },
    { id: 5, title: 'الوسائط والموقع', icon: MapPin },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-5xl mx-auto mb-12">
      {/* Header */}
      <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
        <div className="flex items-center space-x-6 space-x-reverse">
          <div className="bg-amber-600 p-3 rounded-2xl shadow-xl animate-pulse">
            <Sparkles size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black">جرد وتوثيق التراث الثقافي</h2>
            <p className="text-sm text-slate-400 font-medium">الديوان الوطني للحظيرة الثقافية لتندوف - نظام الحفظ الرقمي</p>
          </div>
        </div>
        <div className="flex space-x-3 space-x-reverse">
           <button 
            onClick={triggerAIAnalysis}
            disabled={isAnalyzing}
            className={`px-6 py-3 rounded-2xl text-sm font-black flex items-center space-x-2 space-x-reverse transition-all active:scale-95 ${isAnalyzing ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'}`}
           >
             {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
             <span>{isAnalyzing ? 'جاري التحليل...' : 'تحليل ذكي (AI)'}</span>
           </button>
           <button onClick={onCancel} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors"><X size={24}/></button>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto no-scrollbar scroll-smooth">
        {steps.map(s => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className={`flex-1 min-w-[160px] flex flex-col items-center py-6 px-4 space-y-2 transition-all relative ${
              step === s.id ? 'bg-white text-amber-700' : 'text-slate-400 hover:bg-slate-100/50'
            }`}
          >
            <s.icon size={22} className={step === s.id ? 'animate-bounce' : ''} />
            <span className="text-xs font-black tracking-wide">{s.title}</span>
            {step === s.id && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-amber-600 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      <div className="p-10 min-h-[550px]">
        {/* Step 1: General Info */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 mb-2 uppercase"><Tag size={14}/> اسم القطعة / العنصر</label>
                <input 
                  name="name" 
                  value={formData.name || ''} 
                  onChange={handleChange}
                  placeholder="مثال: لجام خيل تقليدي"
                  className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all ${aiFields.includes('name') ? 'border-green-400 bg-green-50/20' : 'border-slate-100 focus:border-amber-500 shadow-sm'}`}
                />
                {aiFields.includes('name') && <CheckCircle2 size={16} className="absolute left-4 top-11 text-green-500" />}
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-500 mb-2 uppercase"><Info size={14}/> رقم الجرد الرسمي</label>
                <input name="inventoryNumber" value={formData.inventoryNumber} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-amber-500 font-mono font-bold bg-slate-50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">التصنيف</label>
                <select name="category" value={formData.category} onChange={handleChange} className={`w-full px-5 py-4 rounded-2xl border-2 outline-none ${aiFields.includes('category') ? 'border-green-400 bg-green-50/20' : 'border-slate-100 font-bold'}`}>
                  <option value={HeritageCategory.MATERIAL}>{HeritageCategory.MATERIAL}</option>
                  <option value={HeritageCategory.IMMATERIAL}>{HeritageCategory.IMMATERIAL}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">المجال الثقافي</label>
                <input name="culturalField" value={formData.culturalField || ''} onChange={handleChange} placeholder="مثال: صناعة الجلود" className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">النمط الثقافي</label>
                <select name="culturalStyle" value={formData.culturalStyle} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold">
                  <option value={CulturalStyle.SAHRAWI}>{CulturalStyle.SAHRAWI}</option>
                  <option value={CulturalStyle.HASSANI}>{CulturalStyle.HASSANI}</option>
                  <option value={CulturalStyle.OTHER}>{CulturalStyle.OTHER}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Technical Description & Measurements */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">المادة</label>
                <input name="material" value={formData.material || ''} onChange={handleChange} placeholder="جلد، نحاس، صوف..." className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">التقنية المستخدمة</label>
                <input name="technique" value={formData.technique || ''} onChange={handleChange} placeholder="دباغة، نقش، طرق..." className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">الشكل الهندسي</label>
                <input name="shape" value={formData.shape || ''} onChange={handleChange} placeholder="مخروطي، مستطيل..." className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">الزخرفة</label>
                <input name="ornamentation" value={formData.ornamentation || ''} onChange={handleChange} placeholder="زخارف نباتية، هندسية..." className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">الألوان الغالبة</label>
                <input name="color" value={formData.color || ''} onChange={handleChange} placeholder="أحمر أجوري، نيلي..." className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">الحالة الفيزيائية</label>
                <select name="physicalStatus" value={formData.physicalStatus} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100">
                  <option value="ممتازة">ممتازة</option>
                  <option value="جيدة">جيدة</option>
                  <option value="متوسطة">متوسطة</option>
                  <option value="متدهورة">متدهورة</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <h4 className="text-xs font-black text-slate-400 mb-4 uppercase flex items-center gap-2"><Ruler size={14}/> القياسات (بالوحدة الدولية)</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">الوزن (غرام)</label>
                    <input type="number" name="weight" value={formData.weight || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-white focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">العرض (سم)</label>
                    <input type="number" name="width" value={formData.width || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-white focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">السمك (سم)</label>
                    <input type="number" name="thickness" value={formData.thickness || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-white focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-1">القطر (سم)</label>
                    <input type="number" name="diameter" value={formData.diameter || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-white focus:border-amber-500 outline-none" />
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Step 3: Cultural Context & History */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">الوظيفة الأصلية</label>
                <input name="function" value={formData.function || ''} onChange={handleChange} placeholder="ما هو الهدف من استخدامها؟" className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">المعنى الرمزي</label>
                <input name="symbolicMeaning" value={formData.symbolicMeaning || ''} onChange={handleChange} placeholder="هل لها دلالات اجتماعية أو دينية؟" className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">الاستخدام الاجتماعي</label>
                <textarea name="socialUsage" value={formData.socialUsage || ''} onChange={handleChange} rows={3} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-amber-500" placeholder="كيف كانت تستخدم في الحياة اليومية؟" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">ملاحظات تاريخية / الفترة</label>
                <textarea name="historicalPeriod" value={formData.historicalPeriod || ''} onChange={handleChange} rows={3} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-amber-500" placeholder="مثال: الحقبة الاستعمارية، القرن 18..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">طريقة التأريخ</label>
                <input name="datingMethod" value={formData.datingMethod || ''} onChange={handleChange} placeholder="كربون 14، مقارنة..." className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">مكان المنشأ</label>
                <input name="placeOfOrigin" value={formData.placeOfOrigin || ''} onChange={handleChange} placeholder="المنطقة أو القبيلة..." className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">الصانع / الفنان</label>
                <input name="maker" value={formData.maker || ''} onChange={handleChange} placeholder="اسم الحرفي إن وجد..." className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Legal & Conservation */}
        {step === 4 && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">جهة الملكية</label>
                <input name="ownership" value={formData.ownership || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">الوضع القانوني</label>
                <select name="legalStatus" value={formData.legalStatus} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold">
                  <option value="محمية وطنية">محمية وطنية</option>
                  <option value="ملك عام">ملك عام</option>
                  <option value="ملك خاص">ملك خاص</option>
                  <option value="قيد الدراسة">قيد الدراسة</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase">طريقة الاقتناء</label>
                <input name="acquisitionMethod" value={formData.acquisitionMethod || ''} onChange={handleChange} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100" />
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
               <h4 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2"><ShieldCheck size={14}/> إدارة الحفظ والتخزين</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">حالة الحفظ (الترميم)</label>
                    <input name="conservationState" value={formData.conservationState || ''} onChange={handleChange} placeholder="مستقرة، تحتاج لترميم فوري..." className="w-full px-5 py-4 rounded-2xl border-2 border-white outline-none focus:border-amber-500" />
                 </div>
                 <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">ظروف التخزين</label>
                    <input name="storageConditions" value={formData.storageConditions || ''} onChange={handleChange} placeholder="درجة حرارة 20، رطوبة منخفضة..." className="w-full px-5 py-4 rounded-2xl border-2 border-white outline-none focus:border-amber-500" />
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-black text-slate-500 mb-2">ملاحظات إضافية</label>
                  <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={2} className="w-full px-5 py-4 rounded-2xl border-2 border-white outline-none focus:border-amber-500" />
               </div>
            </div>

            <label className="flex items-center space-x-4 space-x-reverse cursor-pointer p-6 bg-amber-50/50 rounded-2xl border border-amber-100 transition-all hover:bg-amber-100/50">
               <input type="checkbox" name="isDisplayable" checked={formData.isDisplayable} onChange={handleChange} className="w-6 h-6 accent-amber-700" />
               <div>
                  <span className="block text-sm font-black text-amber-900">القطعة مؤهلة للعرض المتحفي</span>
                  <span className="block text-[10px] text-amber-700 font-bold opacity-70">يسمح هذا الخيار بظهور القطعة في تقارير العرض والمتحف الافتراضي</span>
               </div>
            </label>
          </div>
        )}

        {/* Step 5: Media & GIS */}
        {step === 5 && (
          <div className="space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                   <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                     <Camera size={18} /> توثيق بصري (صور)
                   </label>
                   {formData.images?.length! > 0 && (
                     <button onClick={triggerAIAnalysis} className="text-[10px] font-black text-blue-600 hover:text-blue-800 flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full transition-colors">
                       <Wand2 size={12} /> تحليل الصورة
                     </button>
                   )}
                </div>
                <div onClick={() => fileInputRef.current?.click()} className={`border-4 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group ${isAnalyzing ? 'border-blue-400 bg-blue-50' : 'border-slate-100 hover:bg-slate-50 hover:border-amber-300'}`}>
                   {isAnalyzing && <div className="absolute inset-0 bg-blue-600/5 animate-pulse flex items-center justify-center">
                      <div className="w-full h-1 bg-blue-500 absolute top-0 animate-[scan_3s_linear_infinite]"></div>
                   </div>}
                   <div className="p-4 bg-white rounded-full shadow-lg text-slate-300 group-hover:text-amber-500 transition-colors">
                    <FileUp size={48} />
                   </div>
                   <p className="mt-6 text-sm font-black text-slate-500">انقر هنا أو اسحب الصور للرفع</p>
                   <input ref={fileInputRef} type="file" hidden accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'image')} />
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                   {formData.images?.map((img, i) => (
                    <div key={i} className="relative group shrink-0 snap-start">
                      <img src={img} className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-xl transition-transform group-hover:scale-105" />
                      <button onClick={() => setFormData(p => ({...p, images: p.images?.filter((_, idx) => idx !== i)}))} className="absolute -top-3 -left-3 bg-red-600 text-white rounded-full p-2 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700">
                        <X size={16}/>
                      </button>
                    </div>
                   ))}
                </div>
              </div>

              <div className="space-y-8">
                <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                  <Video size={18} /> الوسائط المتعددة المتقدمة
                </label>
                <div className="grid grid-cols-2 gap-6">
                   <button onClick={() => videoInputRef.current?.click()} className={`p-8 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${formData.video ? 'border-green-500 bg-green-50 text-green-700 shadow-inner' : 'border-slate-100 hover:bg-slate-50 hover:border-amber-200'}`}>
                      <Video size={32} />
                      <span className="text-xs font-black">توثيق فيديو</span>
                      <input ref={videoInputRef} type="file" hidden accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} />
                   </button>
                   <button onClick={() => modelInputRef.current?.click()} className={`p-8 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${formData.model3d ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-inner' : 'border-slate-100 hover:bg-slate-50 hover:border-blue-200'}`}>
                      <Box size={32} />
                      <span className="text-xs font-black">نموذج 3D (GLB)</span>
                      <input ref={modelInputRef} type="file" hidden accept=".glb,.gltf" onChange={(e) => handleFileUpload(e, 'model')} />
                   </button>
                </div>

                {formData.video && (
                  <div className="bg-slate-900 rounded-[2rem] p-5 border border-slate-800 animate-fade-in shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3 text-white">
                        <Play size={18} className="text-amber-500" />
                        <span className="text-xs font-black uppercase tracking-widest">معاينة الفيديو</span>
                      </div>
                      <button onClick={() => setFormData(p => ({ ...p, video: undefined }))} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all"><X size={16} /></button>
                    </div>
                    <video src={formData.video} controls className="w-full rounded-2xl aspect-video bg-black" />
                  </div>
                )}

                {formData.model3d && (
                  <div className="bg-slate-900 rounded-[2rem] p-5 border border-slate-800 animate-fade-in shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3 text-white">
                        <Maximize2 size={18} className="text-blue-500" />
                        <span className="text-xs font-black uppercase tracking-widest">المتحف الافتراضي (3D)</span>
                      </div>
                      <button onClick={() => setFormData(p => ({ ...p, model3d: undefined }))} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all"><X size={16} /></button>
                    </div>
                    <div className="w-full aspect-video rounded-2xl bg-slate-800 overflow-hidden border border-white/5">
                       <model-viewer src={formData.model3d} auto-rotate camera-controls shadow-intensity="1" environment-image="neutral" style={{ width: '100%', height: '100%' }}></model-viewer>
                    </div>
                  </div>
                )}

                <div className="bg-amber-600 p-6 rounded-[2rem] shadow-xl text-white flex items-center gap-5 transform hover:scale-[1.02] transition-transform">
                   <div className="p-4 bg-white/20 rounded-2xl">
                    <MapPin size={32} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase opacity-70 tracking-tighter">إحداثيات الموقع (GPS)</p>
                      <p className="text-xl font-mono font-black">{formData.gps?.lat.toFixed(6)}° N, {formData.gps?.lng.toFixed(6)}° W</p>
                      <p className="text-[10px] font-bold mt-1">الموقع: {formData.gps?.type === LocationType.DISCOVERY ? 'موقع الاكتشاف' : 'موقع الحفظ'}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-10 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
           {isAnalyzing && (
             <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full text-blue-700 animate-pulse">
               <Loader2 size={18} className="animate-spin" />
               <span className="text-xs font-black">جاري تحليل البيانات عبر Gemini AI...</span>
             </div>
           )}
        </div>
        <div className="flex space-x-4 space-x-reverse">
          <button onClick={onCancel} className="px-10 py-5 font-black text-slate-500 hover:text-slate-800 transition-colors active:scale-95">إلغاء العملية</button>
          <button onClick={() => onSave(formData as InventoryItem)} className="bg-amber-700 hover:bg-amber-800 text-white px-16 py-5 rounded-[2rem] font-black shadow-2xl shadow-amber-900/30 flex items-center space-x-4 space-x-reverse transition-all transform hover:-translate-y-1 active:scale-95">
            <Save size={24} />
            <span>حفظ بطاقة الجرد الرقمية</span>
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default InventoryForm;
