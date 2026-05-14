import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7'; // Importa a função uuidv7 para gerar UUIDs
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
    async create(data: createDto): Promise<EnderecoEntregaModel> {
        // Implementação para criar um novo endereço de entrega
        if (!data.cep || data.cep.trim() === '') {
            throw new Error('O CEP é obrigatório');
        }
        const model: Omit<EnderecoEntregaModel, 
            'endereco_created_at' | 'endereco_updated_at'> = {
            endereco_uuid: uuidv7(),
            endereco_cep: data.cep.trim(),
            endereco_logradouro: data.logradouro? data.logradouro.trim() : '',
            endereco_numero: data.numero ? data.numero : 0,
            endereco_complemento: data.complemento? data.complemento.trim() : '',
            endereco_municipio: data.municipio? data.municipio.trim() : '',
            endereco_uf: data.uf? data.uf.trim().toUpperCase() : '',
        }; 
        return await this.prisma.endereco_de_entrega.create({ data :model });
    }
     
}
