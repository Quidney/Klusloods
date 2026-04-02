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
        Schema::table('companies', function (Blueprint $table) {
            $table->string('name', 120)->nullable()->after('id');
            $table->string('vat_identification_number', 40)->nullable()->after('KvK');
            $table->decimal('vat_rate', 5, 2)->default(21.00)->after('vat_identification_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['name', 'vat_identification_number', 'vat_rate']);
        });
    }
};
