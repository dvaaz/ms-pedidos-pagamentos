import { CreateItemPedidoDto } from '../../item_pedido/dto/create-item_pedido.dto';
export class CreatePedidoDto {
    endereco_id?: string; // Recebe o id do endereço de entrega
    status_pedido?: number;
    destinatario?: string;
    itens_pedido!: CreateItemPedidoDto[]; // Recebe um array de objetos representando os itens do pedido
}
