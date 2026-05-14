export class CreatePedidoDto {
    valor_total?: number;
    usuario!: string;
    endereco_?: string;
    status_pedido?: number;
    destinatario?: string;
}
