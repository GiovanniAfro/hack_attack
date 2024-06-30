<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Response;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function index()
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'age' => 29,
        ];
        return Response::json($data);
        // return response()->json($data);
    }

    public function sayHi()
    {
        return Response::json(['message' => 'Hello, World!']);
		}

	public function upload($request)
	{
		$data = $request->all(); // Get all the input data from the request

		// Save the data to the database using Eloquent
        
		// YourModel::create($data);

		return Response::json(['message' => 'Upload page']);
	}
}
