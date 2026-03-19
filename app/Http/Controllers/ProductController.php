<?php

namespace App\Http\Controllers;

use App\Models\Barcode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Tool;
use App\Models\Price;
use App\Models\Category;
use App\Enums\BarcodeStatus;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products=Tool::with('price','category','barcode')->get();
        $categories=Category::all();
        return Inertia::render('admin/product',['products'=>$products,'categories'=>$categories]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function edit(string $id)
    {
        //
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
            if(file_exists($product->images))
                {
                    Storage::disk('public')->delete($product->images);
                }
            $filename = $validated['name'] . Str::uuid() . '.' . $validated['images']->getClientOriginalExtension();
            $path=Storage::disk('public')->putFileAs('product_images', $validated['images'], $filename);
            $product->images = '/'.$path;
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
    public function destroy(string $id)
    {
        //
    }
}
