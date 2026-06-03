import React, { useState, useRef, useEffect } from 'react';
import { ImagePlus, Trash2, Plus, RotateCcw, GripVertical, Edit3, X, Check, ArrowUp, ArrowDown, Upload, Eye, EyeOff } from 'lucide-react';
import { useHeroStore } from '@/store/useHeroStore';

const COLOR_SCHEMES = [
  { label: 'Slate Dark', bgColor: 'bg-slate-900', overlayFrom: 'from-slate-900/80', overlayTo: 'to-slate-950/60', color: '#0f172a' },
  { label: 'SDA Blue', bgColor: 'bg-sda-blue', overlayFrom: 'from-sda-blue/85', overlayTo: 'to-slate-950/70', color: '#003087' },
  { label: 'Slate Deep', bgColor: 'bg-slate-950', overlayFrom: 'from-slate-950/85', overlayTo: 'to-sda-blue/60', color: '#020617' },
  { label: 'Slate 800', bgColor: 'bg-slate-800', overlayFrom: 'from-slate-800/80', overlayTo: 'to-slate-950/70', color: '#1e293b' },
  { label: 'Emerald', bgColor: 'bg-emerald-900', overlayFrom: 'from-emerald-900/80', overlayTo: 'to-slate-950/70', color: '#064e3b' },
  { label: 'Indigo', bgColor: 'bg-indigo-900', overlayFrom: 'from-indigo-900/80', overlayTo: 'to-slate-950/70', color: '#312e81' },
];

const HeroManagement: React.FC = () => {
  const { slides, addSlide, updateSlide, removeSlide, setSlideImage, resetToDefaults } = useHeroStore();
  const fetchSlides = useHeroStore((s) => s.fetchSlides);
  const initialized = useHeroStore((s) => s.initialized);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) {
      fetchSlides();
    }
  }, [initialized, fetchSlides]);
  const [editForm, setEditForm] = useState({ title: '', description: '', ctaLabel: '', ctaHref: '', bgColor: '', overlayFrom: '', overlayTo: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageTargetId, setImageTargetId] = useState<string | null>(null);

  const startEdit = (slide: typeof slides[0]) => {
    setEditingId(slide.id);
    setEditForm({
      title: slide.title,
      description: slide.description,
      ctaLabel: slide.primaryCta.label,
      ctaHref: slide.primaryCta.href,
      bgColor: slide.bgColor,
      overlayFrom: slide.overlayFrom,
      overlayTo: slide.overlayTo,
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateSlide(editingId, {
      title: editForm.title,
      description: editForm.description,
      bgColor: editForm.bgColor,
      overlayFrom: editForm.overlayFrom,
      overlayTo: editForm.overlayTo,
      primaryCta: { label: editForm.ctaLabel, href: editForm.ctaHref },
    });
    setEditingId(null);
  };

  const handleImagePick = (slideId: string) => {
    setImageTargetId(slideId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !imageTargetId) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setSlideImage(imageTargetId, dataUrl);
      setImageTargetId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newSlides.length) return;
    [newSlides[index], newSlides[target]] = [newSlides[target], newSlides[index]];
    useHeroStore.getState().reorderSlides(newSlides);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
            <ImagePlus size={16} className="text-sda-blue dark:text-sda-gold" />
            Hero Section Management
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Manage landing page hero slides, content, and background images.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              addSlide({
                title: 'New Slide',
                description: 'Edit this slide description.',
                bgColor: 'bg-slate-900',
                overlayFrom: 'from-slate-900/80',
                overlayTo: 'to-slate-950/60',
                primaryCta: { label: 'Learn More', href: '/' },
                active: true,
              })
            }
            className="flex items-center gap-1.5 text-xs font-bold text-sda-blue dark:text-sda-gold hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Plus size={14} />
            Add Slide
          </button>
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Slide list */}
      <div className="space-y-3">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/50"
          >
            {/* Top row: drag hint + title + actions */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical size={14} className="text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-400 shrink-0">#{idx + 1}</span>
                <button
                  onClick={() => updateSlide(slide.id, { active: !slide.active })}
                  title={slide.active ? 'Active' : 'Inactive'}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    slide.active
                      ? 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                      : 'text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {slide.active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                {editingId === slide.id ? (
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="text-sm font-bold bg-transparent border-b border-sda-blue dark:border-sda-gold outline-none text-slate-800 dark:text-white px-1 py-0.5 min-w-0"
                    placeholder="Slide title"
                  />
                ) : (
                  <span className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {slide.title}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => moveSlide(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => moveSlide(idx, 'down')}
                  disabled={idx === slides.length - 1}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowDown size={14} />
                </button>
                {editingId === slide.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="p-1 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEdit(slide)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
                <button
                  onClick={() => removeSlide(slide.id)}
                  className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Description (editable) */}
            <div className="mb-3">
              {editingId === slide.id ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={2}
                  className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 outline-none resize-none"
                  placeholder="Slide description"
                />
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {slide.description}
                </p>
              )}
            </div>

            {/* CTA + Image row */}
            <div className="flex flex-wrap items-center gap-3">
              {editingId === slide.id ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    value={editForm.ctaLabel}
                    onChange={(e) => setEditForm({ ...editForm, ctaLabel: e.target.value })}
                    className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 outline-none w-24"
                    placeholder="Button text"
                  />
                  <input
                    value={editForm.ctaHref}
                    onChange={(e) => setEditForm({ ...editForm, ctaHref: e.target.value })}
                    className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 outline-none w-28"
                    placeholder="Link (e.g. /login)"
                  />
                </div>
              ) : (
                <span className="text-xs font-semibold text-sda-blue dark:text-sda-gold">
                  CTA: {slide.primaryCta.label} → {slide.primaryCta.href}
                </span>
              )}
              {editingId === slide.id && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {COLOR_SCHEMES.map((scheme) => (
                    <button
                      key={scheme.label}
                      onClick={() =>
                        setEditForm({
                          ...editForm,
                          bgColor: scheme.bgColor,
                          overlayFrom: scheme.overlayFrom,
                          overlayTo: scheme.overlayTo,
                        })
                      }
                      title={scheme.label}
                      className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                        editForm.bgColor === scheme.bgColor
                          ? 'border-sda-gold scale-110'
                          : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: scheme.color }}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {/* Image preview */}
                {slide.bgImage ? (
                  <div className="relative group">
                    <img
                      src={slide.bgImage}
                      alt="Slide background"
                      className="w-14 h-10 rounded-lg object-cover border border-slate-300 dark:border-slate-600"
                    />
                    <button
                      onClick={() => updateSlide(slide.id, { bgImage: undefined })}
                      className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleImagePick(slide.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-sda-blue dark:hover:text-sda-gold transition-colors cursor-pointer"
                  >
                    <Upload size={14} />
                    Upload BG
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-6">
          No slides. Click "Add Slide" to create one.
        </p>
      )}
    </div>
  );
};

export default HeroManagement;
