<?php
// app/Services/FlaskService.php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Storage;

class FlaskServices
{
    protected $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function sendDataToFlask($data)
    {
        // $mimeType = $data->getMimeType();
        // logger()->debug("hello type of the data: " . $mimeType);

        // // Read file content
        // $fileContent = Storage::disk('public')->get($data);
        // logger()->debug("hello content length: " . strlen($fileContent));

        // // logger()->ile metadata
        // logger()->debug("hello metadata: ", [
        //     'filename' => $data->getClientOriginalName(),
        //     'mimeType' => fopen($data->getPathname(), 'r'),
        //     'size' => $data->getSize()
        // ]);

        // Check if the file exists and is readable
        $filePath = $data->getPathname();
        if (!file_exists($filePath) || !is_readable($filePath)) {
            logger()->error("hello does not exist or is not readable: " . $filePath);
            return response()->json(['error' => 'File does not exist or is not readable'], 400);
        } else {
            logger()->debug("hello exists and is readable: " . $filePath);
        }
        
        $response = $this->client->request('POST', 'http://flask:5000/process-data', [
            'multipart' => [
                [
                    'name'     => 'file',
                    'contents' => fopen($filePath, 'r'),
                    'filename' => 'recording.x-wav'
                ],
            ]
        ]);
        // logger()->debug("HELLO", ['hi' => json_decode($response->getBody(), true)]);
        return json_decode($response->getBody(), true);
    }
}