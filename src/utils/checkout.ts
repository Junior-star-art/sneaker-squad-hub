
import { CartItem } from "@/types/cart";
import { supabase } from "@/integrations/supabase/client";
import { initiatePayFastPayment } from "./payfast";

export interface CheckoutData {
  customer: {
    name: string;
    email: string;
    userId?: string;
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billing?: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: CartItem[];
  total: number;
}

export const processCheckout = async (checkoutData: CheckoutData) => {
  try {
    // 1. Create the order in the database
    const { customer, shipping, billing, items, total } = checkoutData;
    
    // Prepare the shipping address in JSON format
    const shippingAddress = {
      address: shipping.address,
      city: shipping.city,
      state: shipping.state,
      postal_code: shipping.postalCode,
      country: shipping.country,
    };
    
    // Use shipping address as billing if not provided
    const billingAddress = billing ? {
      address: billing.address,
      city: billing.city,
      state: billing.state,
      postal_code: billing.postalCode,
      country: billing.country,
    } : shippingAddress;
    
    // Insert the order into the database
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: customer.userId,
        total_amount: total,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        status: 'pending'
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    const orderId = orderData.id;
    
    // 2. Insert the order items
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) 
        : item.price,
      size: item.size
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    // 3. Create an initial tracking entry
    await supabase
      .from('order_tracking')
      .insert({
        order_id: orderId,
        status: 'order_created',
        description: 'Order has been placed, awaiting payment',
      });
    
    // 4. Initiate PayFast payment
    const paymentResult = initiatePayFastPayment({
      amount: total,
      customerName: customer.name,
      customerEmail: customer.email,
      itemName: items.length > 1 
        ? `Order #${orderId.substring(0, 8)} (${items.length} items)` 
        : items[0].name,
      orderId
    });
    
    return {
      success: true,
      orderId,
      paymentUrl: paymentResult.url
    };
    
  } catch (error) {
    console.error('Checkout process failed:', error);
    return {
      success: false,
      error: 'Failed to process checkout'
    };
  }
};
