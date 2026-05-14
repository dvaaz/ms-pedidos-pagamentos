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
            endereco_cep: createDto.cepLimpo(data.cep),
            endereco_logradouro: data.logradouro? data.logradouro.trim() : '',
            endereco_numero: createDto.numeroInt(data.numero),
            endereco_complemento: data.complemento? data.complemento.trim() : '',
            endereco_municipio: data.municipio? data.municipio.trim() : '',
            endereco_uf: data.uf? data.uf.trim().toUpperCase() : '',
        }; 
        return await this.prisma.endereco_de_entrega.create({ data :model });
    }
     
    /**
     * Busca todos os endereços de entrega
     * @param params 
     * @returns
     */
    async findAll(params:{
        skip?: number; // Número de registros a pular
        take?: number; // Número de registros a buscar
        cursor?: PrismaClient.endereco_de_entregaWhereUniqueInput; // Cursor para paginação
        where?: PrismaClient.endereco_de_entregaWhereInput; // Filtros para a consulta
        orderBy?: PrismaClient.endereco_de_entregaOrderByWithRelationInput; // Ordenação dos resultados
    }): Promise<EnderecoEntregaModel[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return await this.prisma.endereco_de_entrega.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    /**
     * Busca por um endereço de entrega por id
     * @param input 
     * @returns
     */
    async findOne(input: string): Promise<EnderecoEntregaModel | null> {
        try {
            return await this.prisma.endereco_de_entrega.findUnique({ 
                where: { endereco_uuid: input } 
            });
        } catch (e) {
            throw new Error(`Erro ao buscar endereço de entrega: ${e.message}`);
        }
    }

    /**
     * Atualiza um endereço de entrega por id
     * @param id 
     * @param data 
     * @returns
     */
    async update(id: string, data: updateDto): Promise<EnderecoEntregaModel> {
        try {
            // Verifica se o endereço existe antes de tentar atualizar
            const existing = await this.prisma.endereco_de_entrega.findUnique({ 
                where: { endereco_uuid: id } 
            });
            // Se o endereço não existir, lança um erro
            if (!existing) {
                throw new Error('Endereço de entrega não encontrado');
            }
            const updateData: PrismaClient.endereco_de_entregaUpdateInput = {};
                if (data.cep !== undefined) {
                    updateData.endereco_cep = createDto.cepLimpo(data.cep);
                }
                if (data.logradouro !== undefined) {
                    updateData.endereco_logradouro = data.logradouro.trim();
                }
                if (data.numero !== undefined) {
                    updateData.endereco_numero = createDto.numeroInt(data.numero);
                }
                if (data.complemento !== undefined) {
                    updateData.endereco_complemento = data.complemento.trim();
                }
                if (data.municipio !== undefined) {
                    updateData.endereco_municipio = data.municipio.trim();
                }
                if (data.uf !== undefined) {
                    updateData.endereco_uf = data.uf.trim().toUpperCase();
                }
            return await this.prisma.endereco_de_entrega.update({
                // cria um objeto de atualização com os campos fornecidos
                where: { endereco_uuid: id },
                data: {
                    ...updateData,
                    endereco_updated_at: new Date()
                },
            });
        } catch (e) {
            throw new Error(`Erro ao atualizar endereço de entrega: ${e.message}`);
        }
    }

    /**
     * Deleta um endereço de entrega por id
     * @param id 
     * @returns
     */
    async remove(id: string): Promise<boolean> {
        try {
            // Verifica se o endereço existe antes de tentar deletar
            const existing = await this.prisma.endereco_de_entrega.findUnique({ 
                where: { endereco_uuid: id } 
            });
            // Se o endereço não existir, retorna false
            if (!existing) {
                return false;
            }
            // Tenta deletar o endereço            
            await this.prisma.endereco_de_entrega.delete({ 
                where: { endereco_uuid: id } 
            });
            // Se a deleção for bem-sucedida, retorna true
            return true;
        } catch (e) {
            throw new Error(`Erro ao deletar endereço de entrega: ${e.message}`);
        } 
    }
    
     
}
