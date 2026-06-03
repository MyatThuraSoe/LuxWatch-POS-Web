<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Materialized View: Daily Sales Summary
        DB::statement("
            CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_sales AS
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as total_sales,
                SUM(total_amount) as total_revenue,
                SUM(tax_amount) as total_tax,
                SUM(discount_amount) as total_discount,
                COUNT(DISTINCT id) as transaction_count
            FROM sales
            WHERE status IN ('completed', 'refunded', 'partially_refunded')
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        ");
        
        // Index for faster lookups
        DB::statement("CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_daily_sales_date ON mv_daily_sales(date)");

        // Materialized View: Inventory Valuation
        DB::statement("
            CREATE MATERIALIZED VIEW IF NOT EXISTS mv_inventory_valuation AS
            SELECT 
                pv.id as variant_id,
                pv.sku,
                ii.quantity,
                pv.cost_price,
                pv.retail_price,
                (ii.quantity * pv.cost_price) as total_cost_value,
                (ii.quantity * pv.retail_price) as total_retail_value
            FROM product_variants pv
            JOIN inventory_items ii ON pv.id = ii.variant_id
            WHERE ii.quantity > 0
        ");
        
        DB::statement("CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_inventory_valuation_variant ON mv_inventory_valuation(variant_id)");
    }

    public function down(): void
    {
        DB::statement("DROP MATERIALIZED VIEW IF EXISTS mv_daily_sales");
        DB::statement("DROP MATERIALIZED VIEW IF EXISTS mv_inventory_valuation");
    }
    
    public function refreshViews()
    {
        DB::statement("REFRESH MATERIALIZED VIEW mv_daily_sales");
        DB::statement("REFRESH MATERIALIZED VIEW mv_inventory_valuation");
    }
};
