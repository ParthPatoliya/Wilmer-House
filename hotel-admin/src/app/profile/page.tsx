/* eslint-disable */
'use client';
import { User, Mail, Phone, MapPin, Camera, Save, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const [adminData, setAdminData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAdminSaving, setIsAdminSaving] = useState(false);

    useEffect(() => {
        Promise.all([fetchProfile(), fetchAdmin()]).then(() => setIsLoading(false));
    }, []);

    const fetchProfile = async () => {
        const res = await fetch('/api/profile');
        if (res.ok) {
            const data = await res.json();
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.address || ''
            });
        }
    };

    const fetchAdmin = async () => {
        const res = await fetch('/api/profile/credentials');
        if (res.ok) {
            const data = await res.json();
            setAdminData({ email: data.email || '', password: '' });
        }
    }

    const handleSave = async () => {
        setIsSaving(true);
        const res = await fetch('/api/profile', {
            method: 'PUT',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        });
        setIsSaving(false);
        if (res.ok) alert('Profile settings saved successfully.');
        else alert('Failed to save profile settings.');
    };

    const handleAdminSave = async () => {
        setIsAdminSaving(true);
        const res = await fetch('/api/profile/credentials', {
            method: 'PUT',
            body: JSON.stringify(adminData),
            headers: { 'Content-Type': 'application/json' }
        });
        setIsAdminSaving(false);
        if (res.ok) {
            alert('Admin credentials saved successfully.');
            setAdminData({ ...adminData, password: '' }); // Clear password after save
        }
        else alert('Failed to save admin credentials.');
    };

    if (isLoading) return <div className="p-8 text-center text-zinc-500 font-bold">Loading Profile...</div>;

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Settings & Profile</h1>
                <p className="text-sm font-medium text-zinc-500 mt-1.5 flex items-center gap-2">
                    Manage hotel information, contact details, and admin security.
                </p>
            </div>

            <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col pt-8">
                <div className="px-8 pb-4">
                    <h2 className="text-xl font-bold text-zinc-900 mb-1">Hotel Profile</h2>
                    <p className="text-sm text-zinc-500 mb-6">Public details shown on receipts or general profiles.</p>
                </div>
                <div className="px-8 pb-8 flex flex-col md:flex-row gap-10">
                    <div className="flex flex-col items-center gap-4 w-full md:w-64 shrink-0">
                        <div className="relative group cursor-pointer w-40 h-40">
                            <img
                                src="https://api.dicebear.com/7.x/notionists/svg?seed=Wilmer&backgroundColor=e2e8f0"
                                alt="Profile avatar"
                                className="w-40 h-40 rounded-full bg-zinc-200 object-cover ring-4 ring-white shadow-lg transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                <Camera className="w-8 h-8 mb-2" />
                                <span className="text-xs font-bold uppercase tracking-wider">Change Logo</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-xl text-zinc-900 tracking-tight">{formData.name || 'Hotel Name'}</h3>
                            <p className="text-sm text-zinc-500 font-medium mt-1 bg-zinc-100 py-1 px-3 rounded-full inline-block">Primary Contact</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-2 flex items-center gap-2"><User className="w-4 h-4 text-zinc-400" /> Property Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm font-medium" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-zinc-400" /> Email Address</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm font-medium" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-zinc-400" /> Contact Number</label>
                                <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm font-medium" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-zinc-400" /> Full Address</label>
                            <textarea rows={3} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm font-medium resize-none"></textarea>
                        </div>

                        <div className="pt-4 flex items-center gap-4 border-t border-zinc-100">
                            <button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_4px_14px_0_rgb(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] flex items-center gap-2 disabled:opacity-75">
                                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Hotel Info'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Details Section */}
            <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col pt-8 px-8 pb-8">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-zinc-900 mb-1 flex items-center gap-2"><Lock className="w-5 h-5 text-indigo-500" /> Admin Security</h2>
                    <p className="text-sm text-zinc-500">Update your administrator login details.</p>
                </div>

                <div className="space-y-6 max-w-2xl">
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-2">Admin Login Email</label>
                        <input type="email" value={adminData.email} onChange={e => setAdminData({ ...adminData, email: e.target.value })} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm font-medium" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-2">New Password (leave blank to keep current)</label>
                        <input type="password" placeholder="••••••••" value={adminData.password} onChange={e => setAdminData({ ...adminData, password: e.target.value })} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm font-medium" />
                    </div>

                    <div className="pt-4 flex items-center gap-4 border-t border-zinc-100">
                        <button onClick={handleAdminSave} disabled={isAdminSaving} className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_4px_14px_0_rgba(24,24,27,0.3)] hover:shadow-[0_6px_20px_rgba(24,24,27,0.4)] flex items-center gap-2 disabled:opacity-75">
                            <Save className="w-4 h-4" /> {isAdminSaving ? 'Saving...' : 'Update Security'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
