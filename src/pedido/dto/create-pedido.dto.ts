import { ApiProperty } from '@nestjs/swagger';
import { CreateItemPedidoDto } from '../../item_pedido/dto/create-item_pedido.dto';
export class CreatePedidoDto {
    @ApiProperty({ description: 'ID do endereço de entrega', required: false })
    endereco_id?: string; // Recebe o id do endereço de entrega
    @ApiProperty({ description: 'Status do pedido', required: false })
    status_pedido?: number;
    @ApiProperty({ description: 'Destinatário do pedido', required: false })
    destinatario?: string;
    @ApiProperty({ description: 'Itens do pedido', required: true })
    itens_pedido!: CreateItemPedidoDto[]; // Recebe um array de objetos representando os itens do pedido
}
