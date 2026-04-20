// Interfaces para o Item do Pedido
export interface ItemPedido {
    id: number;
    uuid_pedido: string;
    id_produto: number;
    nome_produto: string;
    preco_item: number;
    total_preco_item: number;
    quantidade_item: number;
}
