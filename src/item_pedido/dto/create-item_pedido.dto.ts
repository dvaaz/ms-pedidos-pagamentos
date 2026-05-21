export class CreateItemPedidoDto {
    pedido_uuid!: string;
    produto_id!: number;
    produto_nome!: string;
    produto_preco!: number;
    item_quantidade!: number;
}
