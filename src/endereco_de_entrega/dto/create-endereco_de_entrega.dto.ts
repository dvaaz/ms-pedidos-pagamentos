export class CreateEnderecoDeEntregaDto {
    uf?: string;
    municipio?: string;
    logradouro?: string;
    numero?: number;
    complemento?: string;
    cep!: string;
}