import { Injectable } from '@nestjs/common';
import type { CreateStatusPagamentoDto } from './dto/create-status_pagamento.dto';
import type { UpdateStatusPagamentoDto } from './dto/update-status_pagamento.dto';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  Prisma as PrismaClient,
  status_pagamento as StatusPagamentoModel,
} from '../generated/prisma/client.js';

@Injectable()
export class StatusPagamentoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria novo método de pagamento
   * @param data
   * @returns
   */
  async create(data: CreateStatusPagamentoDto): Promise<StatusPagamentoModel> {
    if (!data.nome || data.nome.trim() === '') {
      throw new Error('O nome do método de pagamento é obrigatório');
    }
    const model: Omit<StatusPagamentoModel, 'status_pagamento_id'> = {
      status_pagamento_nome: data.nome.trim().toUpperCase(),
    };
    return await this.prisma.status_pagamento.create({ data: model });
  }

  /**
   * Busca todos os métodos de pagamento
   * @param params
   * @returns
   */
  async findAll(params: {
    skip?: number; // Número de registros a pular
    take?: number; // Número de registros a buscar
    cursor?: PrismaClient.status_pagamentoWhereUniqueInput; // Cursor para paginação
    where?: PrismaClient.status_pagamentoWhereInput; // Filtros para a consulta
    orderBy?: PrismaClient.status_pagamentoOrderByWithRelationInput; // Ordenação dos resultados
  }): Promise<StatusPagamentoModel[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.status_pagamento.findMany({
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
  async findOne(input: number): Promise<StatusPagamentoModel | null> {
    try {
      return await this.prisma.status_pagamento.findUnique({
        where: { status_pagamento_id: input },
      });
    } catch (e) {
      if (
        e instanceof PrismaClient.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
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
    where: PrismaClient.status_pagamentoWhereUniqueInput;
    data: UpdateStatusPagamentoDto;
  }): Promise<StatusPagamentoModel> {
    try {
      if (params.data.nome && params.data.nome.trim() === '') {
        throw new Error('O nome do método de pagamento não pode ser vazio');
      }
      const updateData: Partial<StatusPagamentoModel> = {};
      if (params.data.nome) {
        updateData.status_pagamento_nome = params.data.nome
          .trim()
          .toUpperCase();
      }
      return await this.prisma.status_pagamento.update({
        where: { status_pagamento_id: params.where.status_pagamento_id },
        data: updateData,
      });
    } catch (e) {
      if (
        e instanceof PrismaClient.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
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
  async remove(where: PrismaClient.status_pagamentoWhereUniqueInput) {
    try {
      return await this.prisma.status_pagamento.delete({ where });
    } catch (e) {
      if (
        e instanceof PrismaClient.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new Error('Método de pagamento não encontrado');
      }
      throw e;
    }
  }
}
