const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL ?? '';

async function request(path, options = {}) {
  if (!API_GATEWAY_URL) {
    console.info('[mock-api-gateway]', path, options.body ? JSON.parse(options.body) : null);
    return { ok: true, mocked: true };
  }

  const response = await fetch(`${API_GATEWAY_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Api Gateway error: ${response.status}`);
  }

  return response.json();
}

export const checkoutGateway = {
  finishOrder(order) {
    return request('/checkout/orders/finish', {
      method: 'POST',
      body: JSON.stringify(order)
    });
  },
  saveAddress(address) {
    return request('/checkout/addresses', {
      method: 'POST',
      body: JSON.stringify(address)
    });
  }
};
