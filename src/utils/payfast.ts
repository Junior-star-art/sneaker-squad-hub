interface PayFastData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  email_address: string;
  amount: string;
  item_name: string;
}

export const createPayFastForm = (data: PayFastData) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://sandbox.payfast.co.za/eng/process';  // Use sandbox for testing

  Object.entries(data).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  return form;
};

export const initiatePayFastPayment = (orderData: {
  amount: number;
  customerName: string;
  customerEmail: string;
  itemName: string;
}) => {
  const paymentData: PayFastData = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID || '',
    merchant_key: process.env.PAYFAST_MERCHANT_KEY || '',
    return_url: `${window.location.origin}/payment-success`,
    cancel_url: `${window.location.origin}/payment-cancelled`,
    notify_url: `${window.location.origin}/api/payfast-notification`,
    name_first: orderData.customerName,
    email_address: orderData.customerEmail,
    amount: orderData.amount.toFixed(2),
    item_name: orderData.itemName,
  };

  const form = createPayFastForm(paymentData);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};