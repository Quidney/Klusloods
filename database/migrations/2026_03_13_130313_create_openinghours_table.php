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
        Schema::create('openinghours', function (Blueprint $table) {
            $table->id();
            $table->enum('day',['maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag','zondag']);
            $table->time('startime');
            $table->time('endtime');
            $table->enum('status',['open','gesloten']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('openinghours');
    }
};
