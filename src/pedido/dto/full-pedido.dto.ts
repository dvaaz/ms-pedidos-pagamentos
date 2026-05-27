export class FullPedidoDto {
    pedido_uuid: string;
    pedido_valor_total: number;
    pedido_status: string;
    data_criacao: Date;
    // Array com os dados do endereço de entrega
    endereco_entrega: {
        cep: string;
        uf?: string;
        destinatario?: string;
        municipio?: string;
        logradouro?: string;
        numero?: number;
        complemento?: string;
    };
    // Array de produtos do pedido, com nome, descrição, preço unitário e quantidade
    produto_pedido: {
        produto_nome: string;
        preco_unitario: number;
        quantidade: number;
    }[];
}