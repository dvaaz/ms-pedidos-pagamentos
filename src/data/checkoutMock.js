export const checkoutMock = {
  customer: {
    email: 'pessoa@email.com.br',
    name: 'Joao Pessoa Silva',
    phone: '(21)9999-9991'
  },
  payment: {
    cardMask: '4984-xxxx-xxxx-3325'
  },
  pickup: {
    store: 'Loja Av. Missoes 240',
    message: 'Pronta para retirada em ate 2h apos confirmacao de pagamento.'
  },
  addresses: [
    {
      id: 'create-reference-01',
      label: 'Casa',
      details: 'Rua das Camisas, 123 - Sao Paulo - SP'
    },
    {
      id: 'create-reference-02',
      label: 'Trabalho',
      details: 'Av. Paulista, 900 - Sao Paulo - SP'
    }
  ],
  emptyAddress: {
    cep: '',
    street: '',
    number: '',
    complement: '',
    recipient: ''
  },
  order: {
    id: 'mock-order-01',
    items: [
      {
        id: 'shirt-premium-01',
        name: 'Camisa Premium',
        quantity: 1,
        price: 231.7
      }
    ],
    subtotal: 231.7,
    shipping: 0,
    total: 231.7
  }
};
