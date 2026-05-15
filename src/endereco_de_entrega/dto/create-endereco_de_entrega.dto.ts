export class CreateEnderecoDeEntregaDto {
    uf?: string;
    destinatario?: string;
    municipio?: string;
    logradouro?: string;
    numero?: number;
    complemento?: string;
    cep!: string;

// Recebe o valor e retorna limpo
    static cepLimpo(cep: string|number): string {
        return String(cep || '').replace(/\D/g, '');
    }

    // Recebe o valor e retorna o número
    static numeroInt(numero: any): number {
        if (typeof numero === 'string') {
            const parsed = parseInt(numero, 10);
            return isNaN(parsed) ? 0 : parsed;
        }
        return numero || 0;
    }

}