import { Injectable } from '@nestjs/common';
import type { CreateStatusPedidoDto } from './dto/create-status_pedido.dto';
import type { UpdateStatusPedidoDto } from './dto/update-status_pedido.dto';
import { PrismaService } from '../database/prisma/prisma.service';
import { Prisma as PrismaClient, status_pedido as StatusPedidoModel} from '../generated/prisma/client.js';



@Injectable()
export class StatusPedidoService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  /**
   * Cria novo método de pagamento
   * @param data 
   * @returns 
   */
  async create(data: CreateStatusPedidoDto): Promise<StatusPedidoModel> {
    if (!data.nome || data.nome.trim() === '') {
      throw new Error('O nome do método de pagamento é obrigatório');
    }
    const model: Omit<StatusPedidoModel, 'status_pedido_id'> = {
      status_pedido_nome: data.nome.trim().toUpperCase(),
    };
    return await this.prisma.status_pedido.create({ data: model });
  }

  /**
   * Busca todos os métodos de pagamento
   * @param params 
   * @returns 
   */
  async findAll(params:{
    skip?: number; // Número de registros a pular
    take?: number; // Número de registros a buscar
    cursor?: PrismaClient.status_pedidoWhereUniqueInput; // Cursor para paginação
    where?: PrismaClient.status_pedidoWhereInput; // Filtros para a consulta
    orderBy?: PrismaClient.status_pedidoOrderByWithRelationInput; // Ordenação dos resultados
  }): Promise<StatusPedidoModel[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.status_pedido.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  /**
   * Busca por um método por id
   * @param input 
   * @returns 
   */
  async findOne(input: number): Promise<StatusPedidoModel | null> {
    try {
      
      return await this.prisma.status_pedido.findUnique({ 
      where: { status_pedido_id: input } 
    });
  } catch (e) {
    if (e instanceof PrismaClient.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw new Error('Método de pagamento não encontrado');
    }
    throw e; // Para outros erros
  }
  }

  /**
   * Update de método de pagamento
   * @param id 
   * @param data 
   * @returns 
   */
  async update(params: {
    where: PrismaClient.status_pedidoWhereUniqueInput;
    data: UpdateStatusPedidoDto;}) : Promise<StatusPedidoModel> {
      try {
        if (params.data.nome && params.data.nome.trim() === '') {
          throw new Error('O nome do método de pagamento não pode ser vazio');
        }
        const updateData: Partial<StatusPedidoModel> = {};
        if (params.data.nome) {
          updateData.status_pedido_nome = params.data.nome.trim().toUpperCase();
        }
        return await this.prisma.status_pedido.update({
          where: { status_pedido_id: params.where.status_pedido_id },
          data: updateData
        });
      } catch (e) {
        if (e instanceof PrismaClient.PrismaClientKnownRequestError && e.code === 'P2025') { 
          throw new Error('Método de pagamento não encontrado');
        }
        throw e; 
      }
    }

  /**
   * Remover método de pagamento
   * @param id 
   * @returns 
   */
  async remove(
    where: PrismaClient.status_pedidoWhereUniqueInput
  ) {
    try{
      return await this.prisma.status_pedido.delete({ where });
    } catch (e) {
        if (e instanceof PrismaClient.PrismaClientKnownRequestError && e.code === 'P2025') { 
          throw new Error('Método de pagamento não encontrado');
        }
        throw e; 
      }
    }
}