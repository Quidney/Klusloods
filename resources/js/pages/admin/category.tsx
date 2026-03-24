import React, { useEffect, useState, useRef } from 'react';
import {
    Search,
    Plus,
    Wrench,
    Menu,
    User,
    Save,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Transition } from '@headlessui/react';
import { router, useForm } from '@inertiajs/react';
import AddCategory from './modals/addCategory';

const CategoriePage = ({ categories, max_page }) => {
    const searchparm = Object.fromEntries(
        new URLSearchParams(window.location.search),
    );
    const [searchTerm, setSearchTerm] = useState(searchparm.search);
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategories] = useState(categories);
    const tortheling = useRef();
    const searchInput = useRef();

    useEffect(() => {
        setCategories(categories);
        if (searchparm) searchInput.current.focus();
    }, []);

    useEffect(() => {
            tortheling.current = setTimeout(() => {
                if (searchparm.search !== searchTerm) {
                    router.visit('?search=' + searchTerm);
                }
            }, 1000);
        return () => {
            if (tortheling.current) clearTimeout(tortheling.current);
        };
    }, [searchTerm]);

    function handlePage(pageNumber) {
        router.visit('?'+new URLSearchParams({...Object.fromEntries(new URLSearchParams(window.location.search)),page_number:pageNumber}))
    }

    return (
        <>
            <AddCategory
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                setCategory={setCategories}
            />
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
                <nav className="sticky top-0 z-50 bg-slate-900 text-white">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
                        <div className="flex cursor-pointer items-center gap-2">
                            <div className="rounded-lg bg-orange-500 p-2">
                                <Wrench className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">
                                Build
                                <span className="text-orange-500">Rent</span>
                            </span>
                            <span className="ml-4 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-bold text-orange-400">
                                ADMIN
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <button className="transition-colors hover:text-orange-500">
                                <User className="h-5 w-5" />
                            </button>
                            <button className="md:hidden">
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </nav>

                <div className="mx-auto max-w-7xl px-4 py-8">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        <main className="flex-1">
                            {/* Search and Add Header */}
                            <div className="mb-8 flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        ref={searchInput}
                                        placeholder="Zoeken naar producten..."
                                        className="w-full rounded-xl border border-slate-200 bg-white py-4 pr-4 pl-12 shadow-sm transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        value={searchTerm}
                                    />
                                </div>
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="rounded-xl bg-orange-500 p-4 text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-105 hover:bg-orange-600 active:scale-95"
                                >
                                    <Plus className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Product Grid */}
                            <div className="mb-6">
                                <h2 className="mb-4 text-lg font-bold text-slate-800">
                                    Categorieën
                                </h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                    {category.map((item) => (
                                        <CategorieComp
                                            key={item.id}
                                            item={item}
                                            setCategory={setCategories}
                                        />
                                    ))}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="flex items-center justify-center space-x-2 py-10">
                    <button
                        // onClick={() => handlePage(urlParams.page_number - 1)}
                        // disabled={urlParams.page_number === 1}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {[...Array(max_page)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isActive =
                            Number(searchparm.page_number) === pageNumber;

                        return (
                            <button
                                key={pageNumber}
                                onClick={() => handlePage(pageNumber)}
                                className={`h-10 w-10 rounded-lg border text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? 'border-orange-600 bg-orange-600 text-white shadow-md shadow-orange-200'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-orange-500 hover:text-orange-500'
                                }`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        onClick={() =>
                            handlePage(Number(searchparm.page_number) + 1)
                        }
                        disabled={Number(searchparm.page_number) === max_page}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8 text-slate-300">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <div className="mb-6 flex items-center gap-2">
                                    <div className="rounded-lg bg-orange-500 p-1.5">
                                        <Wrench className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight text-white">
                                        Build
                                        <span className="text-orange-500">
                                            Rent
                                        </span>
                                    </span>
                                </div>
                                <p className="mb-6 leading-relaxed text-slate-400">
                                    Your trusted partner for professional-grade
                                    building tools and materials. Quality
                                    equipment, exactly when you need it.
                                </p>
                                <div className="flex space-x-4">
                                    <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:text-white">
                                        <span className="font-bold">fb</span>
                                    </div>
                                    <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:text-white">
                                        <span className="font-bold">ig</span>
                                    </div>
                                    <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-orange-500 hover:text-white">
                                        <span className="font-bold">x</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
                                    Equipment
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Power Tools
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Heavy Machinery
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Scaffolding & Ladders
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Landscaping
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Raw Materials
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
                                    Company
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            How It Works
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Pro Accounts
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Locations
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Careers
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
                                    Support
                                </h4>
                                <ul className="space-y-3">
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Contact Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            FAQ
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Rental Policies
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Report an Issue
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 md:flex-row">
                            <p>
                                © {new Date().getFullYear()} BuildRent Services.
                                All rights reserved.
                            </p>
                            <div className="flex gap-6">
                                <a
                                    href="#"
                                    className="transition-colors hover:text-white"
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-white"
                                >
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

function CategorieComp({ item, setCategory }) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        id: item.id,
        name: item.name,
        description: item.description,
    });

    function submit() {
        put('category');
    }

    async function deleteCat(id) {
        if (!confirm('Ben je zeker om deze category te verwijderen')) return;
        const req = await fetch('category/' + id, {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': window.csrfToken,
            },
        });
        const res = await req.text();
        if (req.status === 200) {
            setCategory((prev) => prev.filter((e) => e.id !== id));
        }
        // TODO style the error
        alert(res);
    }
    return (
        <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
            <div className="p-5">
                <h3 className="mb-1 truncate text-lg font-bold text-slate-900">
                    <input
                        type="text"
                        className="w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                </h3>
                <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                    <textarea
                        className="w-full"
                        onChange={(e) => setData('description', e.target.value)}
                        value={data.description}
                    ></textarea>
                </div>
                <div className="flex items-center justify-end border-t border-slate-50 pt-4">
                    {/* Action Buttons (v and e) */}
                    <div className="flex gap-2">
                        <button
                            className="rounded-lg bg-red-500 p-2.5 text-white transition-colors hover:bg-red-700"
                            title="Edit"
                            onClick={() => deleteCat(item.id)}
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                        <button
                            className="rounded-lg bg-slate-900 p-2.5 text-white transition-colors hover:bg-orange-500"
                            title="Edit"
                            onClick={() => submit()}
                        >
                            {!recentlySuccessful && (
                                <Save className="h-5 w-5" />
                            )}
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="flex gap-3">
                                    <Save className="h-5 w-5" /> Saved
                                </p>
                            </Transition>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoriePage;
