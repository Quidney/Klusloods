<?php

namespace App\Http\Controllers;

use App\Models\Barcode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Tool;
use App\Models\Price;
use App\Models\Category;
use App\Models\Reservation;
use App\Enums\BarcodeStatus;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        if ($request->page_number)
            $page_number = (int)$request->page_number;
        else
            $page_number = 1;

        if ($request->page_size)
            $page_size = (int)$request->page_size;
        else
            $page_size = 10;
        
        if(isset($request->categorie))
            $categorie=json_decode($request->categorie);
        else $categorie=null;

        if(isset($request->dayprice_min))
            $dayprice_min=(int)$request->dayprice_min;
        else $dayprice_min=null;

        if(isset($request->dayprice_max))
            $dayprice_max=(int)$request->dayprice_max;
        else $dayprice_max=null;
        
        if(isset($request->weekprice_min))
            $weekprice_min=(int)$request->weekprice_min;
        else $weekprice_min=null;

        if(isset($request->weekprice_max))
            $weekprice_max=(int)$request->weekprice_max;
        else $weekprice_max=null;
        
        if(isset($request->search))
            $search=$request->search;
        else $search=null;

        $products = Tool::with(['price', 'category', 'barcode' => function ($query) {
            $query->where('status', '!=', BarcodeStatus::AFGESCHREVEN);
        }])
            // Category filter
        ->when(isset($categorie)&&count($categorie)>0,function($query) use($categorie){
            return $query->whereHas('category',function($q) use($categorie){
                return $q->whereIn('id',$categorie);
            });
        })
        // Dayprice filter
        ->when((isset($dayprice_min)&&isset($dayprice_max)&&$dayprice_min!==$dayprice_max&&$dayprice_min<$dayprice_max),function($query) use($dayprice_min,$dayprice_max){
            return $query->whereHas('price',function($q) use($dayprice_min,$dayprice_max){
                return $q->whereBetween('dayprice',[$dayprice_min,$dayprice_max]);
            });
            })
        // weekprice filter
        ->when((isset($weekprice_min)&&isset($weekprice_max)&&$weekprice_min!==$weekprice_max&&$weekprice_min<$weekprice_max),function($query) use($weekprice_min,$weekprice_max){
            return $query->whereHas('price',function($q) use($weekprice_min,$weekprice_max){
                return $q->whereBetween('weekprice',[$weekprice_min,$weekprice_max]);
            });
            })
            // Search
        ->when(isset($search),function($query) use($search){
            return $query->whereLike('name',"%".$search."%");
        });

        $max_page=ceil($products->count() / $page_size);
        $categories = Category::all();
        return Inertia::render('admin/product', [
                'products' => $products
                    ->limit($page_size)
                    ->offset(($page_number - 1) * $page_size)
                    ->get(),
                'categories' => $categories,
                'max_page' =>$max_page
            ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|max:50',
            'description' => 'required|max:255',
            'images' => 'nullable|file|mimes:jpg,png,gif,jpeg|max:4096',
            'deposit' => "numeric|required",
            'weekprice' => "numeric|required",
            'dayprice' => "numeric|required",
        ]);

        $tool = new Tool();
        $tool->name = $validated['name'];
        if (isset($validated['images'])) {

            $tool->images = $this->handleFile($validated['images'], '', $validated['name']);
        }
        $tool->category_id = $validated['category_id'];
        $tool->description = $validated['description'];

        $tool->save();

        $price = new Price();

        $price->tool_id = $tool->getKey();
        $price->dayprice = $validated['dayprice'];
        $price->weekprice = $validated['weekprice'];
        $price->deposit = $validated['deposit'];
        
        $price->save();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated= $request->validate([
            'tool_id'=>"required|exists:tools,id",
            'barcode'=>'required|unique:barcodes,barcode'
        ]);

        $barcode=new Barcode();
        $barcode->tool_id=$validated['tool_id'];
        $barcode->barcode=$validated['barcode'];
        $barcode->notes='';
        $barcode->status=BarcodeStatus::BESCHIKBAAR;
        
        $barcode->save();
    }
    
    private function handleFile($file,$oldimage='',$startfilename='')
    {

        if (file_exists($oldimage)) {
            Storage::disk('public')->delete($oldimage);
        }
        $filename = $startfilename . Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = Storage::disk('public')->putFileAs('product_images', $file, $filename);
        return  '/' . $path;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
        $validated=$request->validate([
            'id'=>'required|exists:barcodes,id',
            'status'=>[new Enum(BarcodeStatus::class),'required'],
            'barcode'=>['required',Rule::unique(Barcode::class)->ignore($request->id,'id')]
        ]);

       $barcode = Barcode::find($validated['id']);
        if($barcode->status!==BarcodeStatus::VERHUURD&&$validated['status']===BarcodeStatus::VERHUURD->value)
            throw ValidationException::withMessages(['status'=>'The status can\'t be set or be moved out of rental']);
        $reservations=Reservation::where('barcode_id',$validated['id'])->where('pickuptime','>=',\Carbon\Carbon::now())->count();
        if($reservations>0)
            throw ValidationException::withMessages(['status'=>'There are reservations in the future so this exemplar can\'t be written off']);
        $barcode->barcode=$validated['barcode'];
        $barcode->status=$validated['status'];
        $barcode->save();
        
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated=$request->validate([
            'id'=>'required|exists:tools,id',
            'name'=>'required|string|max:50',
            'description'=>'required|string|max:255',
            'images'=>'nullable|file|mimes:jpg,png,gif,jpeg|max:4096',
            'deposit'=>"numeric|required",
            'weekprice'=>"numeric|required",
            'dayprice'=>"numeric|required",
            'category_id'=>"int|required|exists:categories,id",
        ]);
        
        $product=Tool::find($validated['id']);
        $product->name=$validated['name'];
        $product->description=$validated['description'];
        if(isset($validated['images'])) {
            $product->images=$this->handleFile($validated['images'],$product->images,$validated['name']);
        }
        $product->category_id=$validated['category_id'];
        $product->save();

        // Check if the price has changed if not do not save the prices
        // Because of floating precision issue it has to be complicated :-(
        $priceChanged= Price::
        whereRaw('ABS(dayprice - ?) < ?', [$validated['dayprice'], 0.0001])
        ->whereRaw('ABS(weekprice - ?) < ?', [$validated['weekprice'], 0.0001])
        ->whereRaw('ABS(deposit - ?) < ?', [$validated['deposit'], 0.0001])
        ->where('tool_id',$product->getKey())
        ->count();

        if($priceChanged===0)
            {
               $price = new Price(); 
               $price->tool_id=$product->getKey();
               $price->dayprice=$validated['dayprice'];
               $price->weekprice=$validated['weekprice'];
               $price->deposit=$validated['deposit'];
               $price->save();
            }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
       $tool=Tool::findOrFail($id);
       
       $reservations=Reservation::whereIn('barcode_id',Barcode::where('tool_id',$tool->id)->get('id'))->count();
       $rentedEx=Barcode::where('tool_id',$tool->id)->where('status',BarcodeStatus::VERHUURD)->count();
       if($reservations>0||$rentedEx>0)return response('There are open reservations with some exemplars',400);
       
       Price::where('tool_id',$tool->id)->delete();
       $tool->delete();

       return response('The tool has successfully been removed');
    }
}
