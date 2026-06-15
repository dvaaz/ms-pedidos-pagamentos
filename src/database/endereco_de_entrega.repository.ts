import { PrismaService } from "./prisma/prisma.service";
import {
    endereco_de_entrega as EnderecoEntregaModel,
    Prisma as PrismaClient,
} from "../generated/prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EnderecoDeEntregaRepository {
    constructor(private readonly prisma: PrismaService) { }

    private readonly MAX_ENDERECOS = 5;

    /**
     * Conta o número de endereços de um usuário
     * @param user 
     * @returns true se o usuário tiver menos de N endereços, false caso contrário
     */
    async countMaxEndereco(user: string): Promise<boolean> {
        const count = await this.prisma.endereco_de_entrega.count({
            where: { endereco_usuario_uuid: user },
        });
        if (count >= this.MAX_ENDERECOS) {
            return false;
        }
        return true;
    }

    /**
     * Criar um novo endereço de entrega
     * @param data 
     * @returns 
     */
    async create(data: Omit<
        EnderecoEntregaModel,
        'endereco_created_at' | 'endereco_updated_at'
    >): Promise<EnderecoEntregaModel> {
        return this.prisma.endereco_de_entrega.create({ data: data });
    }

    /**
     *  Encontra todos os endereços de entrega
     * @param params - Objeto com os parâmetros de busca
     * @returns Array de endereços de entrega
     */
    async findAll(params: {
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
     * Encontra todos os endereços de determinado usuario por sua UUID
     * @param user 
     * @returns 
     */
    async findAllByUser(user: string): Promise<EnderecoEntregaModel[]> {
        return this.prisma.endereco_de_entrega.findMany({
            where: { endereco_usuario_uuid: user },
            orderBy: { endereco_created_at: 'desc' },
        });
    }

    /**
     * Encontra um endereço de entrega por id
     * @param id 
     * @returns 
     */
    async findOne(id: string): Promise<EnderecoEntregaModel | null> {
        return this.prisma.endereco_de_entrega.findUnique({
            where: { endereco_uuid: id },
        });
    }

    /**
     * Atualiza um endereço de entrega por id
     * @param id 
     * @param data 
     * @returns 
     */
    //Test
    async update(id: string, data: PrismaClient.endereco_de_entregaUpdateInput): Promise<EnderecoEntregaModel> {
        return this.prisma.endereco_de_entrega.update({
            where: { endereco_uuid: id },
            data: data,
        });
    }

    /**
     * Deleta um endereço de entrega por id
     * @param id 
     * @returns 
     */
    async remove(id: string): Promise<EnderecoEntregaModel> {
        return this.prisma.endereco_de_entrega.delete({
            where: { endereco_uuid: id },
        });
    }

}