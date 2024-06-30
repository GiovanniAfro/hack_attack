<?php
// app/Http/Controllers/DataController.php

namespace App\Http\Controllers;

use App\Services\FlaskServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DataController extends Controller
{
    protected $flaskService;

    public function __construct(FlaskServices $flaskService)
    {
        $this->flaskService = $flaskService;
    }

    public function processData(Request $request)
    {
        if (!$request->has('file')) {
            return response()->json(['error' => 'Data is required'], 400);
        }
        $file = $request->file('file');

        // Log the file details
        // logger()->debug("hello Received file: " . $file->getClientOriginalName());
        // logger()->debug("hello File MIME type: " . $file->getMimeType());
        // logger()->debug("hello File size: " . $file->getSize());

        $path = $file->store('temp', 'public');
        $responseData = $this->flaskService->sendDataToFlask($file);
        Storage::disk('public')->delete($path);
        // Handle the response as needed
        return response()->json($responseData);
    }
}



        // if (!$request->has('file')) {
        //     return response()->json(['error' => 'Data is required'], 400);
        // }
        // $file = $request->file('file');
        // // Handle the file upload logic here
        // // For example, save the file to a storage location
        // $path = $file->store('audio', 'public');

        // // Return the URL of the saved audio file
        // return response()->json(['audioUrl' => Storage::url($path)]);