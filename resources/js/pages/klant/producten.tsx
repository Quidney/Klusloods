import React, { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import RoleToolbar from '@/components/role-toolbar';

interface ToolPrice {
    dayprice: string | number;
}

interface Barcode {
    id: number;
    tool_id: number;
    status: string;
}

interface Category {
    id: number;
    name: string;
}

interface Tool {
    id: number;
    name: string;
    description?: string;
    images?: string;
    category?: Category;
    price?: ToolPrice | ToolPrice[];
    barcode?: Barcode[]; 
}

interface Props {
    tools: Tool[];
}

export default function Producten({ tools }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Alle');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const categories = ['Alle', ...new Set(tools.map(tool => tool.category?.name).filter(Boolean))];

    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Alle' || tool.category?.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleReserve = (toolId: number) => {
        router.visit(`/klant/product/${toolId}`);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title="Producten - Klusloods" />

            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-orange-500 text-3xl">🛠️</span>
                        <span className="text-3xl font-extrabold text-gray-950 tracking-tight">Klusloods</span>
                    </div>
                </div>
            </nav>

            <RoleToolbar role="klant" />

            <main className="flex-grow max-w-[1600px] mx-auto w-full px-6 py-10">
                
                {/* --- SEARCH & FILTERS --- */}
                <div className="flex flex-col md:flex-row md:justify-center items-center my-8 gap-4 max-w-7xl mx-auto border-b-2 border-orange-200 pb-12 mb-12">
                    
                    <div className="relative w-full md:w-2/3">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Zoek op naam..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3.5 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition text-lg bg-white shadow-sm text-gray-950 placeholder-gray-400 font-medium"
                        />
                    </div>

                    <div className="relative w-full md:w-auto" ref={dropdownRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center justify-center gap-2 px-6 py-3.5 border-2 rounded-xl transition-all text-lg font-semibold shadow-sm w-full md:w-auto
                                ${selectedCategory !== 'Alle' 
                                    ? 'border-orange-500 bg-orange-50 text-orange-600' 
                                    : 'border-orange-200 bg-white text-gray-700 hover:border-orange-400'
                                }`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span>{selectedCategory === 'Alle' ? 'Filter' : selectedCategory}</span>
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-full md:w-64 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                                <div className="py-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setIsFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-3 text-sm transition-colors hover:bg-orange-50 
                                                ${selectedCategory === cat ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- PRODUCT GRID --- */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredTools.map((tool) => {
                            
                            const isAvailable = tool.barcode?.some(
                                (b) => b.status?.toLowerCase().trim() === 'beschikbaar'
                            ) ?? false;

                            return (
                                <div key={tool.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
                                    {/* Image Section */}
                                    <div className="aspect-video w-full max-h-[220px] bg-gray-100 overflow-hidden flex items-center justify-center border-b border-gray-50 relative">
                                        {tool.images ? (
                                            <img 
                                                src={`${tool.images.replace('public/', '')}`} 
                                                alt={tool.name} 
                                                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!isAvailable ? 'grayscale opacity-60' : ''}`}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400 italic text-sm text-center px-6">
                                                <p>Geen afbeelding beschikbaar</p>
                                            </div>
                                        )}
                                        {/* Stock Badge */}
                                        <div className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-md transition-colors ${isAvailable ? 'bg-green-500' : 'bg-red-600'}`}>
                                            {isAvailable ? 'Op Voorraad' : 'Niet op voorraad'}
                                        </div>

                                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-gray-600 shadow-sm border border-gray-100">
                                            {tool.category?.name || 'Overig'}
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-gray-950 mb-2 line-clamp-1">{tool.name}</h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{tool.description || 'Professioneel gereedschap voor elke klus.'}</p>
                                        
                                    <button 
                                        onClick={() => handleReserve(tool.id)}
                                        className={`w-full font-bold mt-auto px-8 py-4 rounded-xl shadow-lg transition-all transform active:scale-95 
                                            ${isAvailable 
                                                ? 'bg-slate-900 hover:bg-slate-950 text-white' 
                                                : 'bg-orange-500 hover:bg-orange-600 text-white'
                                            }`}
                                    >
                                        {isAvailable ? 'Reserveren' : 'Bekijk details'}
                                    </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredTools.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 text-xl font-medium">Geen gereedschap gevonden.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}