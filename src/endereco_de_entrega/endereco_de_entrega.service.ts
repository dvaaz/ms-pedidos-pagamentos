import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Prisma as PrismaClient, endereco_de_entrega as EnderecoEntregaModel } from '../generated/prisma/client.js';
import { CreateEnderecoDeEntregaDto as createDto } from './dto/create-endereco_de_entrega.dto';
import { UpdateEnderecoDeEntregaDto as updateDto } from './dto/update-endereco_de_entrega.dto';

@Injectable()
export class EnderecoDeEntregaService {

    constructor(
        private readonly prisma: PrismaService
    ) {}

    /**
     * Cria um novo endereço de entrega
     * @param data 
     * @returns 
     */
    async create(data: ): Promise<EnderecoEntregaModel> {
        // Implementação para criar um novo endereço de entrega
        if (!data.cep || data.cep.trim() === '') {
            throw new Error('O CEP é obrigatório');
        }
        const model: Omit<EnderecoEntregaModel, 'endereco_de_entrega_id'> = {
            endereco_cep: data.cep.trim(),
            endereco_logradouro: data.logradouro?.trim() || null,
            endereco_numero: data.numero ? parseInt(data.numero) : null,
            endereco_complemento: data.complemento?.trim() || null,
            endereco_municipio: data.municipio?.trim() || null,
            endereco_uf: data.uf?.trim().toUpperCase() || null,
        }; 
        return await this.prisma.endereco_de_entrega.create({ data });
    }
     
}
