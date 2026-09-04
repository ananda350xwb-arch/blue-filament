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
    customer_name: order.customerName || null,
    customer_contact: order.customerContact || null,
    payment_status: order.paymentStatus || 'UNPAID',
    paid_amount: order.paidAmount || null,
    payment_date: order.paymentDate || null,
    payment_slip_url: order.paymentSlipUrl || null,
    payment_note: order.paymentNote || null,
    created_at: order.createdAt,
    updated_at: order.updatedAt || new Date().toISOString(),
  };
}

// Convert Supabase Row to App Order
export function dbRowToOrder(row: any): Order {
  if (!row) {
    return {
      orderId: `BF-${Date.now()}`,
      modelUrl: 'https://makerworld.com/',
      modelName: '3D Model',
      colorCount: 1,
      colors: [],
      quantity: 1,
      scale: 100,
      infill: 'standard',
      note: '',
      status: 'PENDING_REVIEW',
      priceStatus: 'TO BE CONFIRMED',
      paymentStatus: 'UNPAID',
      createdAt: new Date().toISOString(),
    };
  }

  let parsedColors: any[] = [];
  try {
    if (typeof row.colors === 'string') {
      parsedColors = JSON.parse(row.colors);
    } else if (Array.isArray(row.colors)) {
      parsedColors = row.colors;
    }
  } catch {
    parsedColors = [];
  }

  return {
    orderId: row.order_id || `BF-${Date.now()}`,
    modelUrl: row.model_url || 'https://makerworld.com/',
    modelName: row.model_name || '3D Model',
    colorCount: Number(row.color_count) || Math.max(1, parsedColors.length),
    colors: Array.isArray(parsedColors) ? parsedColors : [],
    quantity: Number(row.quantity) || 1,
    scale: Number(row.scale) || 100,
    infill: row.infill || 'standard',
    note: row.note || '',
    status: row.status || 'PENDING_REVIEW',
    priceStatus: row.price_status || 'TO BE CONFIRMED',
    quotedPrice: row.quoted_price ? Number(row.quoted_price) : undefined,
    estimatedGrams: row.estimated_grams ? Number(row.estimated_grams) : undefined,
    estimatedPrintTimeHours: row.estimated_print_time_hours ? Number(row.estimated_print_time_hours) : undefined,
    assignedPrinterId: row.assigned_printer_id || undefined,
    internalNotes: row.internal_notes || undefined,
    trackingNumber: row.tracking_number || undefined,
    customerName: row.customer_name || undefined,
    customerContact: row.customer_contact || undefined,
    paymentStatus: row.payment_status || 'UNPAID',
    paidAmount: row.paid_amount ? Number(row.paid_amount) : undefined,
    paymentDate: row.payment_date || undefined,
    paymentSlipUrl: row.payment_slip_url || undefined,
    paymentNote: row.payment_note || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || undefined,
  };
}

// Convert Filament to DB Row
export function filamentToDbRow(f: FilamentColor) {
  return {
    id: f.id,
    name: f.name || 'Filament',
    name_th: f.nameTh || f.name || 'สีฟิลาเมนต์',
    hex: f.hex || '#2563EB',
    secondary_hex: f.secondaryHex || null,
    material: f.material || 'PLA+',
    category: f.category || 'basic',
    in_stock: f.inStock ?? true,
    popular: f.popular || false,
    badge: f.badge || null,
    description_th: f.descriptionTh || null,
    remaining_grams: f.remainingGrams ?? 1000,
    price_per_gram: f.pricePerGram ?? 1.2,
  };
}

export function dbRowToFilament(row: any): FilamentColor {
  if (!row) {
    return {
      id: `fil-${Date.now()}`,
      name: 'Filament Color',
      nameTh: 'สีฟิลาเมนต์',
      hex: '#2563EB',
      material: 'PLA+',
      category: 'basic',
      inStock: true,
      remainingGrams: 1000,
      pricePerGram: 1.2,
    };
  }

  return {
    id: row.id || `fil-${Date.now()}`,
    name: row.name || 'Filament Color',
    nameTh: row.name_th || row.name || 'สีฟิลาเมนต์',
    hex: row.hex || '#2563EB',
    secondaryHex: row.secondary_hex || undefined,
    material: row.material || 'PLA+',
    category: row.category || 'basic',
    inStock: row.in_stock !== undefined ? Boolean(row.in_stock) : true,
    popular: Boolean(row.popular),
    badge: row.badge || undefined,
    descriptionTh: row.description_th || undefined,
    remainingGrams: row.remaining_grams !== null && row.remaining_grams !== undefined ? Number(row.remaining_grams) : 1000,
    pricePerGram: row.price_per_gram !== null && row.price_per_gram !== undefined ? Number(row.price_per_gram) : 1.2,
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
