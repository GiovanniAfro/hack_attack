<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up(): void
	{
		Schema::create('audio_files', function (Blueprint $table) {
			$table->id();
			$table->binary('file_data'); // BLOB column for storing audio file data
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		// Schema::dropIfExists('audio_files');
	}
};
