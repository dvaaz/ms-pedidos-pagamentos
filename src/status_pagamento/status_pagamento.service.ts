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

      // lógica de atualização do status do pedido:
    private const arrayDeStatusRegistrados = [
      'APROVADO',
      'REJEITADO',
      'AGUARDANDO_AUTH',
    ];

  constructor(private readonly prisma: PrismaService) {}

/**
 * Funcao para alterar o status do pagamento através de seu nome
  * Vai depender de resposta externa. 
*/
async updateStatusPagamento(nome: string): Promise<StatusPagamentoModel['status_pagamento_id']> {
  if (!nome) {
    throw new Error('O nome do status do pagamento é obrigatório');
  }
  // verifica se o status do pagamento esta registrado
  if (!this.arrayDeStatusRegistrados.includes(nome.trim().toUpperCase())) {
    throw new Error('Status do pagamento não registrado');
  }
  

  const status = await this.prisma.status_pagamento.findFirst({
    where: { status_pagamento_nome: nome.trim().toUpperCase() },
    select: {
      status_pagamento_id: true,
      status_pagamento_nome: true,
    },
  });
  if (!status || !status.status_pagamento_id || !status.status_pagamento_nome) {
    throw new Error('Status do pagamento não encontrado');
  }
}

  /**
   * Busca um status de pagamento pelo ID.
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

      /**
       * Busca um status de pagamento pelo nome.
       */
      async findByName(nome: string): Promise<StatusPagamentoModel | null> {
        if (!nome || nome.trim() === '') {
          return null;
        }

        return await this.prisma.status_pagamento.findFirst({
          where: { status_pagamento_nome: nome.trim().toUpperCase() },
        });
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


}
