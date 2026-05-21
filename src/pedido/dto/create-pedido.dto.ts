import { VerifyItemPedidoDto } from '../../item_pedido/dto/verify-item_pedido.dto';
export class CreatePedidoDto {
    endereco_id!: string; // Recebe o id do endereço de entrega
    status_pedido?: number;
    destinatario?: string;
    itens_pedido!: VerifyItemPedidoDto[]; // Recebe um array de objetos representando os itens do pedido
}
