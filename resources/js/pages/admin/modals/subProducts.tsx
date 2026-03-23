import { useEffect, useState } from 'react';
import {
    X,
    Save,
    Plus,
    Barcode,
} from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

/**
 * This is to edit the exemplars
 * @param isOpen if the modal should be showen or not 
 * @param onClose the function to execute when the user wants to close the modal
 * @param product the products including its exemplars
 * @returns a jsx element as model to edit the exemplars
 */
const SubProducts = ({ isOpen, onClose, product }) => {
    const [subproducts,setSubproducts]=useState();
    useEffect(()=>{
        setSubproducts(product.barcode||[]);
    },[product])
    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 text-black">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative transform overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                    <h2 className="text-xl font-bold text-slate-900">
                        Exemplaren bewerken
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <AddSubProduct tool_id={product.id} setSubproducts={setSubproducts}/>
                <hr/>
                <EdditSubProduct subproducts={subproducts} setSubproducts={setSubproducts}/>

            </div>
        </div>
    );
};

/**
 * This it to add a new exemplar
 * @param tool_id the id that connects the exemplar to the main product
 * @param setSubProducts update the subproducts with the new created one
 * @returns a jsx element with a input and submit button to add a new exemplar
 */
function AddSubProduct({tool_id,setSubproducts}){
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        tool_id:tool_id,
        barcode:""
    });

    /**
     * Submit the data to create a new exemplar
     * @param e event
     */
    function submit(e){
        e.preventDefault();

        post('/admin/barcodes',{
            onSuccess:(k)=>{
                setSubproducts(k.props.products.find(product=>product.id===tool_id).barcode);
                reset('barcode');
            }
        });
    }
    
    return (
        <form className="space-y-5 p-6" onSubmit={(e)=>submit(e)}>
            <div className='flex items-end gap-3 w-full'>
            <div className='w-full'>
                <label className="mb-1.5 block flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Barcode className="h-4 w-4 text-orange-500" /> Barcode
                    {errors.barcode && (
                        <span className="text-red-500">{errors.barcode}</span>
                    )}
                </label>
                <input
                    type="text"
                    value={data.barcode}
                    onChange={(e) => setData('barcode', e.target.value)}
                    placeholder="Bijvoorbeeld: 1235589"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
            </div>

            <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-2.5 font-bold text-white shadow-lg h-fit shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95"
            >
                {!recentlySuccessful && (
                    <>
                        <Plus className="h-5 w-5" /> 
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
                        <Plus className="h-5 w-5" /> Toegevoegd
                    </p>
                </Transition>
            </button>
</div>
        </form>
    );

}

/**
 * This is for edditing subproducts 
 * @param subproducts all subproducts belonging to the product
 * @param setSubproducts used to update the subproducts
 * @returns jsx element with all the subproducts and there barcode
 */
function EdditSubProduct({subproducts,setSubproducts}){
    return(
        <div className="space-y-5 overflow-y-auto overscroll-contain max-h-[50vh] p-6">
       {subproducts.map((subproduct)=>{
           return (
                    <div className='flex flex-column gap-3'>
           <SubproductItem
                key={subproduct.id}
                subproduct={subproduct}
                setSubproducts={setSubproducts}
           />
           </div>
           );
       })} 
        </div>
    );
}
/**
 * The actual component. I had to do it like this because
 * when i use a useState in a loop react is complaining about that has more states then the previous render :-(
 * @param subproducts all subproducts belonging to the product
 * @param setSubproducts used to update the subproducts
 * @returns jsx element with values
 */
function SubproductItem({subproduct,setSubproducts})
{
    const status = ['onderhoud', 'afgeschreven', 'beschikbaar', 'verhuurd'];
    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        id: subproduct.id,
        barcode: subproduct.barcode,
        status: subproduct.status,
    });
    
    /**
     * Submit the data as put to update
     * @param e event
     * @returns void 
     */
    function submit(e)
    {
        e.preventDefault();
        if(data.status==='afgeschreven')
        {
            if(!confirm('Ben je zeker om dit product af te schrijven. Dit kan niet ongedaan worden gemaakt'))return;
        }
        put('/admin/barcodes',{
            onSuccess:(k)=>{
                setSubproducts(k.props.products.find(product=>product.id===subproduct.tool_id).barcode);
            }
        })
    }

    return (
        <form className="flex items-end gap-4" onSubmit={(e)=>submit(e)}>
            <div className="flex flex-col">
                <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Barcode className="h-4 w-4 text-orange-500" /> Barcode
                    {errors.barcode && (
                        <span className="text-red-500">{errors.barcode}</span>
                    )}
                </label>
                <input
                    type="text"
                    value={data.barcode}
                    onChange={(e) => setData('barcode', e.target.value)}
                    placeholder="Bijvoorbeeld: 1235589"
                    className="w-48 rounded-lg border border-slate-200 bg-white px-4 py-2.5 transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700">
                    Status
                    {errors.status && (
                        <span className="text-red-500">{errors.status}</span>
                    )}
                </label>
                <select
                    value={data.status}
                    disabled={subproduct.status==='verhuurd'}
                    onChange={(e) => setData('status', e.target.value)}
                    className="w-48 rounded-lg border border-slate-200 bg-white px-4 py-2.5 transition-all outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                >
                    {status.map((s) => (
                        <option key={s} disabled={s === 'verhuurd'} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="flex h-fit items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95"
            >
                {!recentlySuccessful && <Save className="h-5 w-5" />}
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
        </form>
    );
}
export default SubProducts;
