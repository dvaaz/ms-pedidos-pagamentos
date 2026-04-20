// Interfaces para o Endereço de Entrega
export interface EnderecoDeEntrega {
    uuid: string;
    uf: string;
    cidade: string;
    logradouro: string;
    numero: number;
    complemento?: string;
}
