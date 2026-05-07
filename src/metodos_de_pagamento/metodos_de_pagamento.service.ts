import { Injectable } from '@nestjs/common';
import type { CreateMetodosDePagamentoDto } from './dto/create-metodos_de_pagamento.dto';
import type { UpdateMetodosDePagamentoDto } from './dto/update-metodos_de_pagamento.dto';
import { PrismaService } from '../database/prisma/prisma.service';
import { Prisma as PrismaClient, metodos_de_pagamento as PagamentoModel} from '../generated/prisma/client.js';

// import {MetodosDePagamento as PagamentoModel} from './entities/metodos_de_pagamento.entity'

@Injectable()
export class MetodosDePagamentoService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  /**
   * Cria novo método de pagamento
   * @param data 
   * @returns 
   */
  async create(data: CreateMetodosDePagamentoDto): Promise<PagamentoModel> {
    return await this.prisma.metodos_de_pagamento.create({ data });
  }

  /**
   * Busca todos os métodos de pagamento
   * @param params 
   * @returns 
   */
  async findAll(params:{
    skip?: number; // Número de registros a pular
    take?: number; // Número de registros a buscar
    cursor?: PrismaClient.metodos_de_pagamentoWhereUniqueInput; // Cursor para paginação
    where?: PrismaClient.metodos_de_pagamentoWhereInput; // Filtros para a consulta
    orderBy?: PrismaClient.metodos_de_pagamentoOrderByWithRelationInput; // Ordenação dos resultados
  }): Promise<PagamentoModel[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.metodos_de_pagamento.findMany({
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
  async findOne(input: number): Promise<PagamentoModel | null> {
    try {
      return await this.prisma.metodos_de_pagamento.findUnique({ 
      where: { metodos_de_pagamento_id: input } 
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
    where: PrismaClient.metodos_de_pagamentoWhereUniqueInput;
    data: UpdateMetodosDePagamentoDto;}) : Promise<PagamentoModel> {
      try {
        return await this.prisma.metodos_de_pagamento.update(params);
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
    where: PrismaClient.metodos_de_pagamentoWhereUniqueInput
  ) {
    try{
      return await this.prisma.metodos_de_pagamento.delete({ where });
    } catch (e) {
        if (e instanceof PrismaClient.PrismaClientKnownRequestError && e.code === 'P2025') { 
          throw new Error('Método de pagamento não encontrado');
        }
        throw e; 
      }
    }
}