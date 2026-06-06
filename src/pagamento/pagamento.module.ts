import { Module } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { PagamentoController } from './pagamento.controller';
import { PedidoService } from 'src/pedido/pedido.service';
import { StatusPagamentoService } from 'src/status_pagamento/status_pagamento.service';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Module({
  controllers: [PagamentoController],
  providers: [
    PagamentoService,
    PrismaService,
    StatusPagamentoService,
    PedidoService
  ],
})
export class PagamentoModule {}
