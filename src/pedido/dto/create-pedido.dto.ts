export class CreatePedidoDto {
    usuario!: string;
    endereco_id!: string; // Recebe o id do endereço de entrega
    status_pedido?: number;
    destinatario?: string;
    itens_pedido!: string[]; // Recebe um array de strings representando os ids dos itens do pedido
}
