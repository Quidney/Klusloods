<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if(isset($request->page_size))
            $page_size=(int)$request->page_size;
        else
            $page_size=9;
        if(isset($request->page_number))
            $page_number=(int)$request->page_number;
        else
            $page_number=1;
        if(isset($request->search))
            $category=Category::whereLike('name',"%".$request->search."%")->limit($page_size)->offset(($page_number-1)*$page_size)->get();
        else $category=Category::limit($page_size)->offset(($page_number-1)*$page_size)->get();
        return Inertia::render('admin/category',['categories'=>$category,'max_page'=>ceil(Category::count()/$page_size)]);
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
        $validated=$request->validate([
            'name'=>'required|max:50|unique:categories,name',
            'description'=>'required|max:255',
        ]);
        
        $category=new Category();

        $category->name=$validated['name'];
        $category->description=$validated['description'];
        
        $category->save();
        
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
            'id'=>'required|exists:categories,id',
            'name'=>'required|max:50',
            'description'=>'required|max:255',
        ]);
        
        $category=Category::find($validated['id']);

        $category->name=$validated['name'];
        $category->description=$validated['description'];
        
        $category->save();

        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::with('tool')->findOrFail($id);
        if(count($category->tool)>0)
            {
                return response('There are tools with that category so deletion isn\'t possilbe',400);
            }else $category->delete();
        return response('The category is successfully removed');
    }
}
