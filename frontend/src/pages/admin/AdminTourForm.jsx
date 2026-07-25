import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Plus, X, UploadCloud } from 'lucide-react';
import api from '../../api/axios';

const categories = ['Beach', 'Mountain', 'Historical', 'Adventure', 'City', 'Village', 'Other'];

const emptyForm = {
  title: '',
  description: '',
  location: '',
  price: '',
  duration: '',
  maxGroupSize: 10,
  category: 'Other',
  included: [''],
  excluded: [''],
  itinerary: [{ day: 1, title: '', description: '' }],
  featured: false,
};

const AdminTourForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]); // new files to upload
  const [existingImages, setExistingImages] = useState([]); // already-saved image URLs (edit mode)
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const fetchTour = async () => {
      try {
        const { data } = await api.get(`/tours/${id}`);
        setForm({
          title: data.title,
          description: data.description,
          location: data.location,
          price: data.price,
          duration: data.duration,
          maxGroupSize: data.maxGroupSize,
          category: data.category,
          included: data.included?.length ? data.included : [''],
          excluded: data.excluded?.length ? data.excluded : [''],
          itinerary: data.itinerary?.length ? data.itinerary : [{ day: 1, title: '', description: '' }],
          featured: data.featured,
        });
        setExistingImages(data.images || []);
      } catch {
        setError('ট্যুর তথ্য লোড করা যায়নি।');
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // --- Included/Excluded list helpers ---
  const updateListItem = (field, index, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };
  const addListItem = (field) => setForm({ ...form, [field]: [...form[field], ''] });
  const removeListItem = (field, index) =>
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });

  // --- Itinerary helpers ---
  const updateItinerary = (index, key, value) => {
    const updated = [...form.itinerary];
    updated[index] = { ...updated[index], [key]: value };
    setForm({ ...form, itinerary: updated });
  };
  const addItineraryDay = () =>
    setForm({
      ...form,
      itinerary: [...form.itinerary, { day: form.itinerary.length + 1, title: '', description: '' }],
    });
  const removeItineraryDay = (index) =>
    setForm({ ...form, itinerary: form.itinerary.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.location || !form.price || !form.duration) {
      setError('অনুগ্রহ করে সব প্রয়োজনীয় ঘর পূরণ করুন');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('location', form.location);
      formData.append('price', form.price);
      formData.append('duration', form.duration);
      formData.append('maxGroupSize', form.maxGroupSize);
      formData.append('category', form.category);
      formData.append('featured', form.featured);
      formData.append('included', JSON.stringify(form.included.filter(Boolean)));
      formData.append('excluded', JSON.stringify(form.excluded.filter(Boolean)));
      formData.append('itinerary', JSON.stringify(form.itinerary.filter((d) => d.title)));

      images.forEach((file) => formData.append('images', file));

      if (isEdit) {
        await api.put(`/tours/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/tours', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      navigate('/admin/tours');
    } catch (err) {
      setError(err.response?.data?.message || 'সেভ করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-jungle">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-jungle">{isEdit ? 'ট্যুর সম্পাদনা করুন' : 'নতুন ট্যুর যোগ করুন'}</h1>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink/70">শিরোনাম</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none" />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink/70">বিবরণ</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full resize-none rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">স্থান</label>
            <input name="location" value={form.location} onChange={handleChange} className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">সময়কাল</label>
            <input name="duration" value={form.duration} onChange={handleChange} placeholder="যেমন: ৩ দিন ২ রাত" className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">মূল্য (৳)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">সর্বোচ্চ গ্রুপ সাইজ</label>
            <input type="number" name="maxGroupSize" value={form.maxGroupSize} onChange={handleChange} className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink/70">ক্যাটেগরি</label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2.5 text-sm focus:border-sunset focus:outline-none">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} className="h-4 w-4 accent-sunset" />
            <label htmlFor="featured" className="text-sm text-ink/70">ফিচার্ড ট্যুর হিসেবে দেখান</label>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink/70">ছবি (সর্বোচ্চ ৫টি)</label>
          {existingImages.length > 0 && (
            <div className="mb-3 flex gap-2">
              {existingImages.map((img, i) => (
                <img key={i} src={img} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ))}
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-sand-dark px-4 py-6 text-sm text-ink/50 hover:border-sunset">
            <UploadCloud size={18} />
            {images.length > 0 ? `${images.length} টি ছবি নির্বাচিত` : 'ছবি আপলোড করতে ক্লিক করুন'}
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))} />
          </label>
        </div>

        {/* Included */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink/70">অন্তর্ভুক্ত সুবিধা</label>
          {form.included.map((item, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <input value={item} onChange={(e) => updateListItem('included', i, e.target.value)} placeholder="যেমন: হোটেল" className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2 text-sm focus:border-sunset focus:outline-none" />
              <button type="button" onClick={() => removeListItem('included', i)} className="rounded-xl border border-sand-dark px-3 text-ink/40 hover:text-sunset"><X size={15} /></button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem('included')} className="flex items-center gap-1 text-sm text-jungle hover:text-sunset"><Plus size={14} /> আরও যোগ করুন</button>
        </div>

        {/* Excluded */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink/70">অন্তর্ভুক্ত নয়</label>
          {form.excluded.map((item, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <input value={item} onChange={(e) => updateListItem('excluded', i, e.target.value)} placeholder="যেমন: দুপুরের খাবার" className="w-full rounded-xl border border-sand-dark bg-cream px-4 py-2 text-sm focus:border-sunset focus:outline-none" />
              <button type="button" onClick={() => removeListItem('excluded', i)} className="rounded-xl border border-sand-dark px-3 text-ink/40 hover:text-sunset"><X size={15} /></button>
            </div>
          ))}
          <button type="button" onClick={() => addListItem('excluded')} className="flex items-center gap-1 text-sm text-jungle hover:text-sunset"><Plus size={14} /> আরও যোগ করুন</button>
        </div>

        {/* Itinerary */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink/70">দিনভিত্তিক পরিকল্পনা</label>
          {form.itinerary.map((day, i) => (
            <div key={i} className="mb-3 rounded-xl border border-sand-dark p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-sunset">দিন {day.day}</span>
                <button type="button" onClick={() => removeItineraryDay(i)} className="text-ink/40 hover:text-sunset"><X size={15} /></button>
              </div>
              <input value={day.title} onChange={(e) => updateItinerary(i, 'title', e.target.value)} placeholder="দিনের শিরোনাম" className="mt-2 w-full rounded-lg border border-sand-dark bg-cream px-3 py-2 text-sm focus:border-sunset focus:outline-none" />
              <textarea value={day.description} onChange={(e) => updateItinerary(i, 'description', e.target.value)} placeholder="বিস্তারিত" rows={2} className="mt-2 w-full resize-none rounded-lg border border-sand-dark bg-cream px-3 py-2 text-sm focus:border-sunset focus:outline-none" />
            </div>
          ))}
          <button type="button" onClick={addItineraryDay} className="flex items-center gap-1 text-sm text-jungle hover:text-sunset"><Plus size={14} /> নতুন দিন যোগ করুন</button>
        </div>

        {error && <p className="text-sm text-sunset-dark">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-full bg-sunset px-8 py-3 font-semibold text-cream hover:bg-sunset-dark disabled:opacity-60">
            {saving ? <Loader2 size={18} className="animate-spin" /> : isEdit ? 'পরিবর্তন সেভ করুন' : 'ট্যুর যোগ করুন'}
          </button>
          <button type="button" onClick={() => navigate('/admin/tours')} className="rounded-full bg-sand px-8 py-3 font-semibold text-ink hover:bg-sand-dark">
            বাতিল
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTourForm;