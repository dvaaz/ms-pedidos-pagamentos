# ShirtStore Checkout

Projeto React criado a partir do mock de checkout informado.

## Onde trocar dados mockados

- Dados do cliente, pagamento, enderecos, retirada e valores do pedido: `src/data/checkoutMock.js`
- URL do API Gateway: variavel de ambiente `VITE_API_GATEWAY_URL`
- Pontos de integracao preparados: `src/services/apiGateway.js`

## Comportamento implementado

- Estado inicial com `retirar` selecionado.
- Clique em `receber` abre modal de enderecos.
- A primeira opcao do modal e `CRIAR NOVO ENDERECO`.
- Clique em `CRIAR NOVO ENDERECO` abre modal com formulario de endereco.
- `Finalizar Compra` chama a camada `checkoutGateway.finishOrder`.

## Comandos

```bash
npm install
npm run dev
```

Esses comandos nao foram executados aqui.
