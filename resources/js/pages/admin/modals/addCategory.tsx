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
const AddCategory = ({ isOpen, onClose,setCategory}) => {
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
    });

    function submit() {
        post('/admin/category',{
            preserveScroll:true,
            onSuccess:()=>{
                setCategory(prev=>([...prev,data]));
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
                        Categorie toevoegen
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
                            placeholder="Bijv. Graafmachine"
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
                            placeholder="Beschrijf de specificaties van de categorie..."
                            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            value={data.description}
                        ></textarea>
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
export default AddCategory;