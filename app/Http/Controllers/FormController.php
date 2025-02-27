<?php

namespace App\Http\Controllers;

use App\Http\Resources\FormCollection;
use App\Http\Resources\FormResource;
use App\Models\Form;
use Inertia\Inertia;

use Illuminate\Http\Request;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('forms', [
            'forms' => new FormCollection(Form::paginate(request()->perPage ?? 10)),
            'searchParams' => request()->query() ?: null
        ]);
    }

    public function create()
    {
        return Inertia::render('form-create');
    }

    public function store(Request $request)
    {
        // Validate request data
        $validated = $request->validate([
            // TODO: add validator
//            'content' => 'required|string',
        ]);

        // Create the post
        Form::create($validated);

        return redirect()->route('forms.index');
    }

    public function show(Request $request, string $id)
    {
        return Inertia::render('form-preview', [
            'form' => Form::findOrFail($id)
        ]);
    }

    public function edit(Request $request, string $id)
    {
        return Inertia::render('form-editor', [
            'form' => Form::findOrFail($id)
        ]);
    }


    public function update(Request $request, Form $form)
    {
        $form->update($request->all());

        return redirect()->route('forms.index');
    }

}
