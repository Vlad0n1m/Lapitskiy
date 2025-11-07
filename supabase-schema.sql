-- ============================================
-- Lapitskiy Coffee Shop - Order Management System
-- Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    telegram_user_id BIGINT,
    telegram_username TEXT,
    phone TEXT NOT NULL,
    total_price INTEGER NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'kaspi')),
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('pickup', 'delivery')),
    delivery_address TEXT,
    comment TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (
        status IN ('new', 'accepted', 'in_progress', 'ready', 'on_the_way', 'delivered', 'picked_up', 'cancelled')
    ),
    telegram_message_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_telegram_user_id ON orders(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    size TEXT NOT NULL,
    sirop TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price INTEGER NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ============================================
-- ORDER STATUS HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by TEXT NOT NULL CHECK (changed_by IN ('staff', 'system', 'customer')),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    comment TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_changed_at ON order_status_history(changed_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update updated_at on orders table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO order_status_history (order_id, old_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, 'system');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_order_status_changes
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION log_status_change();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read orders (for Mini App)
CREATE POLICY "Allow public read access to orders"
    ON orders FOR SELECT
    USING (true);

-- Policy: Allow public to insert orders (for Mini App)
CREATE POLICY "Allow public insert orders"
    ON orders FOR INSERT
    WITH CHECK (true);

-- Policy: Allow authenticated users to update orders (for staff)
CREATE POLICY "Allow authenticated update orders"
    ON orders FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow public to read order_items
CREATE POLICY "Allow public read access to order_items"
    ON order_items FOR SELECT
    USING (true);

-- Policy: Allow public to insert order_items
CREATE POLICY "Allow public insert order_items"
    ON order_items FOR INSERT
    WITH CHECK (true);

-- Policy: Allow public to read order_status_history
CREATE POLICY "Allow public read access to order_status_history"
    ON order_status_history FOR SELECT
    USING (true);

-- Policy: Allow system to insert history (via service role)
CREATE POLICY "Allow system insert order_status_history"
    ON order_status_history FOR INSERT
    WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get order with items
CREATE OR REPLACE FUNCTION get_order_with_items(order_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'order', row_to_json(o.*),
        'items', (
            SELECT json_agg(row_to_json(oi.*))
            FROM order_items oi
            WHERE oi.order_id = order_uuid
        ),
        'history', (
            SELECT json_agg(row_to_json(oh.*))
            FROM order_status_history oh
            WHERE oh.order_id = order_uuid
            ORDER BY oh.changed_at DESC
        )
    ) INTO result
    FROM orders o
    WHERE o.id = order_uuid;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert test data
-- INSERT INTO orders (order_number, phone, total_price, payment_method, delivery_method, status)
-- VALUES ('1730123456', '+77771234567', 2500, 'cash', 'pickup', 'new');

-- ============================================
-- NOTES
-- ============================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Make sure to configure RLS policies according to your security needs
-- 3. Update service role key in .env.local for admin operations
-- 4. The trigger automatically logs status changes
-- 5. Use get_order_with_items() function for efficient queries

