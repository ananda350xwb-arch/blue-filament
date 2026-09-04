import { getSupabaseClient } from './supabase';
import { Order, FilamentColor, StoreSettings } from '../types';

// Convert App Order to Supabase Row
export function orderToDbRow(order: Order) {
  return {
    order_id: order.orderId,
    model_url: order.modelUrl,
    model_name: order.modelName || '3D Model',
    color_count: order.colorCount,
    colors: order.colors,
    quantity: order.quantity,
    scale: order.scale,
    infill: order.infill,
    note: order.note || '',
    status: order.status,
    price_status: order.priceStatus,
    quoted_price: order.quotedPrice,
    estimated_grams: order.estimatedGrams,
    estimated_print_time_hours: order.estimatedPrintTimeHours,
    assigned_printer_id: order.assignedPrinterId,
    internal_notes: order.internalNotes,
    tracking_number: order.trackingNumber,
    created_at: order.createdAt,
    updated_at: order.updatedAt || new Date().toISOString(),
  };
}

// Convert Supabase Row to App Order
export function dbRowToOrder(row: any): Order {
  return {
    orderId: row.order_id,
    modelUrl: row.model_url,
    modelName: row.model_name,
    colorCount: Number(row.color_count),
    colors: row.colors || [],
    quantity: Number(row.quantity),
    scale: Number(row.scale),
    infill: row.infill,
    note: row.note || '',
    status: row.status,
    priceStatus: row.price_status,
    quotedPrice: row.quoted_price ? Number(row.quoted_price) : undefined,
    estimatedGrams: row.estimated_grams ? Number(row.estimated_grams) : undefined,
    estimatedPrintTimeHours: row.estimated_print_time_hours ? Number(row.estimated_print_time_hours) : undefined,
    assignedPrinterId: row.assigned_printer_id,
    internalNotes: row.internal_notes,
    trackingNumber: row.tracking_number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Convert Filament to DB Row
export function filamentToDbRow(f: FilamentColor) {
  return {
    id: f.id,
    name: f.name,
    name_th: f.nameTh,
    hex: f.hex,
    secondary_hex: f.secondaryHex || null,
    material: f.material,
    category: f.category,
    in_stock: f.inStock,
    popular: f.popular || false,
    badge: f.badge || null,
    description_th: f.descriptionTh || null,
    remaining_grams: f.remainingGrams ?? 1000,
    price_per_gram: f.pricePerGram ?? 1.2,
  };
}

export function dbRowToFilament(row: any): FilamentColor {
  return {
    id: row.id,
    name: row.name,
    nameTh: row.name_th,
    hex: row.hex,
    secondaryHex: row.secondary_hex || undefined,
    material: row.material,
    category: row.category,
    inStock: Boolean(row.in_stock),
    popular: Boolean(row.popular),
    badge: row.badge || undefined,
    descriptionTh: row.description_th || undefined,
    remainingGrams: row.remaining_grams !== null ? Number(row.remaining_grams) : 1000,
    pricePerGram: row.price_per_gram !== null ? Number(row.price_per_gram) : 1.2,
  };
}

// Cloud Database API Actions
export const CloudDB = {
  // Orders
  async fetchOrders(): Promise<Order[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('bf_orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data.map(dbRowToOrder);
    } catch (e) {
      console.warn('CloudDB.fetchOrders error:', e);
      return null;
    }
  },

  async upsertOrder(order: Order): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const row = orderToDbRow(order);
      const { error } = await client.from('bf_orders').upsert(row, { onConflict: 'order_id' });
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('CloudDB.upsertOrder error:', e);
      return false;
    }
  },

  async deleteOrder(orderId: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('bf_orders').delete().eq('order_id', orderId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('CloudDB.deleteOrder error:', e);
      return false;
    }
  },

  // Filaments
  async fetchFilaments(): Promise<FilamentColor[] | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('bf_filaments').select('*');
      if (error) throw error;
      if (data.length === 0) return null;
      return data.map(dbRowToFilament);
    } catch (e) {
      console.warn('CloudDB.fetchFilaments error:', e);
      return null;
    }
  },

  async upsertFilament(filament: FilamentColor): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const row = filamentToDbRow(filament);
      const { error } = await client.from('bf_filaments').upsert(row, { onConflict: 'id' });
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('CloudDB.upsertFilament error:', e);
      return false;
    }
  },

  async deleteFilament(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client.from('bf_filaments').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('CloudDB.deleteFilament error:', e);
      return false;
    }
  },

  // Store Settings
  async fetchSettings(): Promise<StoreSettings | null> {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client.from('bf_settings').select('*').limit(1).maybeSingle();
      if (error || !data) return null;
      return {
        storeName: data.store_name,
        lineId: data.line_id,
        phone: data.phone,
        announcementText: data.announcement_text,
        announcementActive: data.announcement_active,
        basePricePerGram: Number(data.base_price_per_gram),
        amsColorChangeFee: Number(data.ams_color_change_fee),
        shippingFlatRate: Number(data.shipping_flat_rate),
        licenseNotice: data.license_notice,
      };
    } catch (e) {
      console.warn('CloudDB.fetchSettings error:', e);
      return null;
    }
  },

  async updateSettings(settings: StoreSettings): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const row = {
        id: 'default',
        store_name: settings.storeName,
        line_id: settings.lineId,
        phone: settings.phone,
        announcement_text: settings.announcementText,
        announcement_active: settings.announcementActive,
        base_price_per_gram: settings.basePricePerGram,
        ams_color_change_fee: settings.amsColorChangeFee,
        shipping_flat_rate: settings.shippingFlatRate,
        license_notice: settings.licenseNotice,
        updated_at: new Date().toISOString(),
      };
      const { error } = await client.from('bf_settings').upsert(row, { onConflict: 'id' });
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('CloudDB.updateSettings error:', e);
      return false;
    }
  },
};
