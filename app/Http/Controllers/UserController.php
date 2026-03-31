<?php

namespace App\Http\Controllers;

use App\Enums\userrole;
use App\Enums\userstatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Validation\Rules\Enum;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if(isset($request->search))
            $search=$request->search;
        else $search=null;
        return Inertia::render('admin/users',[
            'users'=>User::when(isset($search),function($q) use($search) {
                return $q->whereLike('firstname', "%" . $search . "%")
                    ->whereLike('lastname', "%" . $search . "%")
                    ->whereLike('email', "%" . $search . "%");
            })->get(['firstname','lastname',"email",'status','role','id'])
        ]);
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
        //
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
            'id'=>"required|exists:users,id",
            'role'=>[new Enum(userrole::class),'required'],
            'status'=>[new Enum(userstatus::class),'required'],
        ]);
        
        $user=User::find($validated['id']);
        $user->role=$validated['role'];
        $user->status=$validated['status'];
        
        $user->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
