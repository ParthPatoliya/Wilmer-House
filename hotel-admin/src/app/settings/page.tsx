/* eslint-disable */
'use client';
import { Settings2, Palette, Users, Mail, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState('Reservation');
    const [editorData, setEditorData] = useState({ subject: '', body: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setIsLoading(true);
        const res = await fetch('/api/emails');
        if (res.ok) {
            const data = await res.json();
            setTemplates(data);
            const active = data.find((d: any) => d.type === selectedType) || data[0];
            if (active) setEditorData({ subject: active.subject, body: active.body });
        }
        setIsLoading(false);
    };

    const handleTypeChange = (type: string) => {
        setSelectedType(type);
        const active = templates.find((d: any) => d.type === type);
        if (active) setEditorData({ subject: active.subject, body: active.body });
    };

    const saveTemplate = async () => {
        const res = await fetch('/api/emails', {
            method: 'PUT',
            body: JSON.stringify({ type: selectedType, ...editorData }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            alert('Email template saved successfully. This will be automatically sent when reservations are created!');
            fetchTemplates();
        } else alert('Failed to save.');
    };

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">System Settings</h1>
                <p className="text-sm font-medium text-zinc-500 mt-1.5 flex items-center gap-2">
                    Configure automated notifications and app preferences.
                </p>
            </div>

            <div className="bg-white border border-zinc-200/60 rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-64 bg-zinc-50 border-r border-zinc-100 p-6 flex flex-col gap-2">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50">
                        <Mail className="w-5 h-5" /> Automated Emails
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                        <Palette className="w-5 h-5" /> Appearance
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
                        <Users className="w-5 h-5" /> Team Invites
                    </button>
                </div>

                <div className="flex-1 p-8">
                    <h2 className="text-xl font-bold text-zinc-900 mb-6">Customize Email Templates</h2>

                    {isLoading ? <div className="text-sm text-zinc-500 font-bold p-8">Loading Templates...</div> : (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-2">Template Type</label>
                                <select
                                    value={selectedType}
                                    onChange={e => handleTypeChange(e.target.value)}
                                    className="w-full md:max-w-xs bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm font-medium"
                                >
                                    <option value="Reservation">Reservation Confirmation</option>
                                    <option value="Payment">Payment Receipt</option>
                                </select>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-100">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-2">Email Subject Line</label>
                                    <input
                                        type="text"
                                        value={editorData.subject}
                                        onChange={e => setEditorData({ ...editorData, subject: e.target.value })}
                                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-2 flex items-center justify-between">
                                        Email Body Content
                                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md font-mono">Available Tags: {'{{name}}, {{room}}, {{checkIn}}, {{checkOut}}'}</span>
                                    </label>
                                    <textarea
                                        rows={10}
                                        value={editorData.body}
                                        onChange={e => setEditorData({ ...editorData, body: e.target.value })}
                                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm font-medium resize-none leading-relaxed"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button onClick={saveTemplate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Save Template
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
