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
        Schema::create('retours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->index()->constrained('reservations');
            $table->dateTime('actualreturntime');
            $table->enum('status',['in orde','schoonmaak nodig','schade','defect']);
            $table->text('notes')->nullable();
            $table->float('cost',9.2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retours');
    }
};
