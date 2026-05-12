export class CreateEnderecoDeEntregaDto {
    uf?: string;
    municipio?: string;
    logradouro?: string;
    numero?: string | null = null;
    complemento?: string;
    cep!: string;
}