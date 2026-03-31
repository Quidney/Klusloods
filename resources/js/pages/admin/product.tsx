import { useState,useEffect,useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    Search,
    Plus,
    Edit,
    Cog,
    Filter,
    Wrench,
    Menu,
    ListFilter,
    User,
    ChevronRight,
    Package,
    Tag,
    ChevronLeft,
    Trash2,
} from 'lucide-react';
import EditProductModal from './modals/editProduct';
import AddProductModal from './modals/addProduct';
import formatCurrency from '@/hooks/formatCurrency';
import SubProducts from './modals/subProducts';

/**
 * the product edit page
 * @param products all the products stored in db
 * @param categories all the categories in db
 * @param max_page the max amount of page possible to fill 
 * @returns a jsx element to crud products including filtering and searching
 */
const Product = ({ products, categories,max_page}) => {
    const [showProduct, setShowProduct] = useState(false);
    const [showAddProduct, setshowAddProduct] = useState(false);
    const [modalProduct, setModalProduct] = useState({});
    const [showSubProduct, setShowSubProduct] = useState(false);
    const [urlParams, setUrlParams] = useState({
        categorie:[],
        dayprice_min:0,
        dayprice_max:0,
        page_size:12,
        page_number:1,
        search:''
    });
    const tortheling=  useRef();
    const searchBar=useRef();

    useEffect(()=>{
        const params=getUrlParams();
        setUrlParams(params);
        // Put focus after the search on the searchbar
        if(params.search&&searchBar)searchBar.current.focus(); 
    },[])

    /**
     * Show the productmodal
     * @param item the product to edit
     */
    function showProductModal(item) {
        setShowProduct(true);
        setModalProduct(item);
    }

    /**
     * This is to show the modal to edit the examplars
     * @param item The product to edit
     */
    function showSubProductModal(item) {
        setShowSubProduct(true);
        setModalProduct(item);
    }
    
    /**
     * This is to handle the search input and apply a tortheling to prevent spamming
     * @param value the searchvalue
     */
    function handleSearch(value)
    {
        if(tortheling.current)
        {
            clearTimeout(tortheling.current);
        }

        tortheling.current=setTimeout(()=>{
            changeUrl({...urlParams,page_number:1,search:value});
        },1000)
        setUrlParams(prev=>({...prev,search:value}));
    }

    /**
     * Show the addproduct modal
     */
    function showAddProductModal() {
        setshowAddProduct(true);
    }
    
    /**
     * Go to other page
     * @param pageNumber the number to go to
     */
    function handlePage(pageNumber)
    {
        changeUrl({...urlParams,page_number:pageNumber});
    }

    
    async function deleteItem(id)
    {
        if(!confirm('Ben je zeker om de tool te proberen te verwijderen?'))return;

        const req=await fetch(window.location.origin+'/admin/tools/'+id,{
            method:'delete',
            headers:{
                'X-CSRF-TOKEN':window.csrfToken
            }
        });

        const res=await req.text();
        if(req.status===200)
        {
            router.reload();
        }
        alert(res);
    }
    return (
        <>
            <EditProductModal
                onClose={() => setShowProduct(false)}
                isOpen={showProduct}
                product={modalProduct}
                categories={categories}
            />
            <SubProducts
                onClose={() => setShowSubProduct(false)}
                isOpen={showSubProduct}
                product={modalProduct}
            />
            <AddProductModal
                onClose={() => setshowAddProduct(false)}
                isOpen={showAddProduct}
                categories={categories}
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
                        <FilterContent categories={categories} />

                        <main className="flex-1">
                            <div className="mb-8 flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                    <input
                                        ref={searchBar}
                                        type="text"
                                        value={urlParams.search||''}
                                        placeholder="Zoeken naar producten..."
                                        className="w-full rounded-xl border border-slate-200 bg-white py-4 pr-4 pl-12 shadow-sm transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                    />
                                </div>
                                <button
                                    onClick={() => showAddProductModal()}
                                    className="rounded-xl bg-orange-500 p-4 text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-105 hover:bg-orange-600 active:scale-95"
                                >
                                    <Plus className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <h2 className="mb-4 text-lg font-bold text-slate-800">
                                    Producten
                                </h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                    {products.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
                                        >
                                            <div className="relative flex h-32 items-center justify-center overflow-hidden border-b border-slate-100 bg-slate-100">
                                                {item.images ? (
                                                    <img
                                                        src={
                                                            window.location
                                                                .origin +
                                                            '/storage/' +
                                                            item.images
                                                        }
                                                    />
                                                ) : (
                                                    <Package className="h-10 w-10 text-slate-300" />
                                                )}
                                                <span className="absolute top-3 right-3 rounded-full border border-slate-200 bg-white/80 px-2 py-1 text-[10px] font-bold text-slate-500 backdrop-blur-sm">
                                                    ID: #{item.id}
                                                </span>
                                            </div>

                                            <div className="p-5">
                                                <h3 className="mb-1 truncate text-lg font-bold text-slate-900">
                                                    {item.name}
                                                </h3>
                                                <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                                                    <Tag className="h-3.5 w-3.5 text-orange-500" />
                                                    <span>
                                                        {item.category.name}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium text-slate-400 uppercase">
                                                            Day Rate
                                                        </span>
                                                        <span className="text-xl font-bold text-slate-900">
                                                            {formatCurrency({
                                                                price: item
                                                                    .price[
                                                                    item.price
                                                                        .length -
                                                                        1
                                                                ].dayprice,
                                                            })}
                                                        </span>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition-colors hover:bg-slate-50"
                                                            title="Delete"
                                                            onClick={() =>
                                                                deleteItem(item.id)
                                                            }
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                        <div className="relative inline-block">
                                                            <button
                                                                className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition-colors hover:bg-slate-50"
                                                                title="View"
                                                                onClick={() =>
                                                                    showSubProductModal(
                                                                        item,
                                                                    )
                                                                }
                                                            >
                                                                <Cog className="h-5 w-5" />
                                                            </button>

                                                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                                                                {
                                                                    item.barcode
                                                                        .length
                                                                }
                                                            </span>
                                                        </div>
                                                        <button
                                                            className="rounded-lg bg-slate-900 p-2.5 text-white transition-colors hover:bg-orange-500"
                                                            title="Edit"
                                                            onClick={() =>
                                                                showProductModal(
                                                                    item,
                                                                )
                                                            }
                                                        >
                                                            <Edit className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>

                <div className="flex items-center justify-center space-x-2 py-10">
                    <button
                        onClick={() => handlePage(urlParams.page_number - 1)}
                        disabled={urlParams.page_number === 1}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {[...Array(max_page)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isActive = urlParams.page_number === pageNumber;

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
                        onClick={() => handlePage(urlParams.page_number + 1)}
                        disabled={urlParams.page_number === max_page}
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

/**
 * This is to extract all the searchparams that are in the url
 * @returns a object with all possible urlparams or there default value
 */
function getUrlParams()
{
    let urlParams = {
        categorie:[],
        dayprice_min:0,
        dayprice_max:0,
        weekprice_min:0,
        weekprice_max:0,
        page_size:12,
        page_number:1
    };

        // Create a URLSearchParams object
        const params = new URLSearchParams(window.location.search);

        // Convert URL parameters to an object
        const paramsObject = {};
        for (const [key, value] of params.entries()) {
            // check if it might be a number and not a empty value because javascipt think that null==0
            if (!isNaN(value) && value.toString().length > 0)
                paramsObject[key] = Number(value);
            else paramsObject[key] = value;
        }
    //
        // Silence any errors that might arise when parsing categorie
        try{
            paramsObject['categorie'] = JSON.parse(paramsObject['categorie']);
        }catch(e){}

        // Update state with parameters
        urlParams={...urlParams,...paramsObject};
    return urlParams;
}


/**
 * This is to go to other page with the given urlParams
 * @param urlParams all the urlparams needed to use in the url
 */
function changeUrl(urlParams) {
    router.visit(
        '?' +
        new URLSearchParams({
            ...urlParams,
            categorie: JSON.stringify(urlParams.categorie),
        }));
}

/**
 * This is to create a fitler component to filter on price and category
 * @param categories all active categories to filter on 
 * @returns a jsx component with a option to filter the products
 */
function FilterContent({categories}){
    const [urlParams, setUrlParams] = useState({
        categorie:[],
        dayprice_min:0,
        dayprice_max:0,
        weekprice_min:0,
        weekprice_max:0,
        page_size:12,
        page_number:1
    });

    useEffect(()=>{
        setUrlParams(getUrlParams());
    },[])

    function setData(key, value) {
        setUrlParams((prev) => ({ ...prev, [key]: value }));
    }

    /**
     * This is to update the categories in the data object
     * @param e the data
     */
    function categoryCheck(e) {
        if (urlParams.categorie.includes(e.target.value)) {
            setData(
                'categorie',
                urlParams.categorie.filter((j) => j !== e.target.value),
            );
        } else setData('categorie', [...urlParams.categorie, e.target.value]);
    }

    /**
     * Apply the filtering
     */
    function filter()
    {
        changeUrl({...urlParams,page_number:1});
    }

    return (
        <aside className="w-full space-y-6 lg:w-64">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <Filter className="h-4 w-4 text-orange-500" /> Filters
                </h3>

                <div className="mb-6">
                    <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Categorieën
                    </label>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-orange-600"
                            >
                                <label htmlFor={cat.id}>{cat.name} </label>
                                <input
                                    type="checkbox"
                                    id={cat.id}
                                    value={cat.id}
                                    onChange={(e) => categoryCheck(e)}
                                    checked={urlParams.categorie.includes(
                                        cat.id.toString(),
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Dagprijs
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                            value={urlParams.dayprice_min || 0}
                            onInput={(e) =>
                                setData(
                                    'dayprice_min',
                                    parseFloat(e.target.value),
                                )
                            }
                        />
                        <input
                            type="number"
                            placeholder="0"
                            step="0.01"
                            min="0"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                            value={urlParams.dayprice_max || 0}
                            onInput={(e) =>
                                setData(
                                    'dayprice_max',
                                    parseFloat(e.target.value),
                                )
                            }
                        />
                    </div>
                </div>
                <div>
                    <label className="mb-2 mt-2 block text-xs font-bold tracking-wider text-slate-400 uppercase">
                        Weekprijs
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                            value={urlParams.weekprice_min || 0}
                            onInput={(e) =>
                                setData(
                                    'weekprice_min',
                                    parseFloat(e.target.value),
                                )
                            }
                        />
                        <input
                            type="number"
                            placeholder="0"
                            step="0.01"
                            min="0"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                            value={urlParams.weekprice_max || 0}
                            onInput={(e) =>
                                setData(
                                    'weekprice_max',
                                    parseFloat(e.target.value),
                                )
                            }
                        />
                    </div>
                </div>
                <div className="mt-3">
                    <button
                        onClick={() => filter()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 p-2 text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-105 hover:bg-orange-600 active:scale-95"
                    >
                        <ListFilter className="h-5 w-5" />
                        Filter
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Product;
