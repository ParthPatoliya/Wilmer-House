import { PackagePlus, RefreshCcw, MoreHorizontal, AlertTriangle, PackageOpen, Layers } from 'lucide-react';

const inventoryItems = [
    { id: 'SKU-001', name: 'Premium Bath Towels', category: 'Linen', inStock: 145, minStock: 100, status: 'Healthy', unit: 'pcs' },
    { id: 'SKU-002', name: 'Hand Soap Dispensers', category: 'Amenities', inStock: 12, minStock: 50, status: 'Low Stock', unit: 'btl' },
    { id: 'SKU-003', name: 'King Size Bed Sheets', category: 'Linen', inStock: 80, minStock: 100, status: 'Low Stock', unit: 'sets' },
    { id: 'SKU-004', name: 'Shampoo Mini (50ml)', category: 'Amenities', inStock: 450, minStock: 200, status: 'Healthy', unit: 'btl' },
    { id: 'SKU-005', name: 'Coffee Pods (Espresso)', category: 'Pantry', inStock: 8, minStock: 50, status: 'Critical', unit: 'box' },
];

const getStockColor = (status: string) => {
    if (status === 'Critical') return 'bg-rose-100 text-rose-700 border-rose-200';
    if (status === 'Low Stock') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
};

export default function InventoryPage() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventory & Linen</h1>
                    <p className="text-sm text-slate-500 mt-1">Track supplies, amenities, and linen stocks.</p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
                        <RefreshCcw className="w-4 h-4" />
                        Restock Log
                    </button>
                    <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-200">
                        <PackagePlus className="w-4 h-4" />
                        Receive Stock
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-2xl shadow-lg relative overflow-hidden text-white group cursor-pointer transition-transform hover:-translate-y-1">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm border border-white/10">
                            <PackageOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-indigo-100 text-sm font-medium mb-1">Total Items</p>
                            <h3 className="text-3xl font-bold tracking-tight">1,248</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:border-amber-200 transition-colors cursor-pointer group hover:-translate-y-1">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Low Stock Alerts</p>
                        <div className="flex items-center gap-3">
                            <h3 className="text-3xl font-bold text-slate-900">2</h3>
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">Needs Attention</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:border-rose-200 transition-colors cursor-pointer group hover:-translate-y-1">
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Critical Shortages</p>
                        <h3 className="text-3xl font-bold text-rose-600">1</h3>
                        <p className="text-xs text-slate-400 mt-1">Coffee Pods (Espresso) pending restock</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-100">
                    <button className="px-6 py-4 text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600">All Items</button>
                    <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-900">Linens</button>
                    <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-900">Amenities</button>
                    <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-900">Cleaning Supplies</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Item Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">In Stock</th>
                                <th className="px-6 py-4">Min. Level</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {inventoryItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                        <p className="text-xs text-slate-400 font-mono mt-0.5">{item.id}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                        <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-900">{item.inStock}</span>
                                        <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{item.minStock}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStockColor(item.status)}`}>
                                            {item.status === 'Critical' && <AlertTriangle className="w-3 h-3" />}
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 hover:bg-indigo-50">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
