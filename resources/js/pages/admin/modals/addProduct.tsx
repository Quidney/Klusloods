import {
    X,
    Save,
    Euro,
    Info,
    Package,
    Calendar,
    ShieldCheck,
    Image,
} from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
 
/**
 * This is to add a product
 * @param isOpen if the modal should be showen or not 
 * @param onClose the function to execute when the user wants to close the modal
 * @param categories all possible categories to choose out
 * @returns a jsx element as model to add the new product
 */
const AddProductModal = ({ isOpen, onClose, categories }) => {
    if (!isOpen) return null;
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        name: '',
        description: '',
        category_id: categories[0].id,
        dayprice: 0.00,
        weekprice: 0.00,
        deposit: 0.00,
        images: null,
    });

    function submit() {
        post('/admin/tools',{
            preserveScroll:true,
            onSuccess:()=>{
                reset();
            }
        });
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 text-black">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                    <h2 className="text-xl font-bold text-slate-900">
                        Product toevoegen
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
                    <div>
                        <label className="flex-col mb-1.5 block flex flex-wrap gap-2 text-sm font-bold text-slate-700">
                            <div className='flex gap-3'>
                                <Image className="h-4 w-4 text-orange-500" />{' '}
                                Foto{' '}
                                {errors.images && (
                                    <span className="text-red-500">
                                        {errors.images}
                                    </span>
                                )}
                            </div>
                            {data.images ? (
                                <img src={URL.createObjectURL(data.images)} className='object-contain'/>
                            ) : (
                            <></>
                            )}
                        </label>
                        <input
                            type="file"
                            accept="image/jpg,image/png,image/gif,image/jpeg"
                            onChange={(e) =>
                                setData('images', e.target.files[0])
                            }
                            placeholder="Bijv. Heavy Duty Graafmachine"
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Package className="h-4 w-4 text-orange-500" /> Naam{" "}
                            {errors.name && (
                                <span className="text-red-500">
                                    {errors.name}
                                </span>
                            )}
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Bijv. Heavy Duty Graafmachine"
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Info className="h-4 w-4 text-orange-500" />{' '}
                            Omschrijving {" "}
                            {errors.description && (
                                <span className="text-red-500">
                                    {errors.description}
                                </span>
                            )}
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Beschrijf de specificaties van het gereedschap..."
                            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            value={data.description}
                        ></textarea>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-bold text-slate-700">
                            Categorie{" "}
                            {errors.category_id && (
                                <span className="text-red-500">
                                    {errors.category_id}
                                </span>
                            )}
                        </label>
                        <select
                            value={data.category_id}
                            onChange={(e) =>
                                setData('category_id', e.target.value)
                            }
                            className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                        >
                            {categories.map((category) => (
                                <option value={category.id} key={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Euro className="h-4 w-4 text-orange-500" />{' '}
                                Dagprijs
                                {errors.dayprice && (
                                    <span className="text-red-500">
                                        {errors.dayprice}
                                    </span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={data.dayprice}
                                    onChange={(e) =>
                                        setData('dayprice', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-8 transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                />
                                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400">
                                    €
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block flex items-center gap-2 text-sm font-bold text-slate-700">
                                <Calendar className="h-4 w-4 text-orange-500" />{' '}
                                Weekprijs
                                {errors.weekprice && (
                                    <span className="text-red-500">
                                        {errors.weekprice}
                                    </span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={data.weekprice}
                                    onChange={(e) =>
                                        setData('weekprice', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-8 transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                />
                                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400">
                                    €
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block flex items-center gap-2 text-sm font-bold text-slate-700">
                            <ShieldCheck className="h-4 w-4 text-orange-500" />{' '}
                            Borg 
                            {errors.deposit && (
                                <span className="text-red-500">
                                    {errors.deposit}
                                </span>
                            )}
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                value={data.deposit}
                                onChange={(e) =>
                                    setData('deposit', e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pr-4 pl-8 transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            />
                            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400">
                                €
                            </span>
                        </div>
                    </div>
                </form>

                <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 p-6">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-6 py-2.5 font-bold text-slate-600 transition-colors hover:bg-white"
                    >
                        Annuleren
                    </button>
                    <button
                        type="submit"
                        onClick={() => submit()}
                        className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-2.5 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95"
                    >
                        {!recentlySuccessful && (
                            <>
                                <Save className="h-5 w-5" /> Opslaan
                            </>
                        )}
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="flex gap-3">
                                <Save className="h-5 w-5" /> Opgeslagen
                            </p>
                        </Transition>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
