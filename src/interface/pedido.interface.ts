// Interfaces para o Pedido
export interface Pedido {
    uuid: string;
    valor_total_pedido: number;
    id_destinatario: string;
    uuid_endereco_de_entrega_: string;
    id_status_pedido: number;
    nome_destinatario: string;
}