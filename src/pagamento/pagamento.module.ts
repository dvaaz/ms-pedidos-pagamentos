import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from './pagamento.service';

@Module({
  controllers: [PagamentoController],
  providers: [PagamentoService, PrismaService],
})
export class PagamentoModule {}
