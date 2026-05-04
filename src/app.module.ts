import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma/prisma.module';
import { MetodosDePagamentoService } from './metodos-de-pagamento/metodos-de-pagamento.service';
import { MetodosDePagamentoController } from './metodos-de-pagamento/metodos-de-pagamento.controller';
import { MetodosDePagamentoModule } from './metodos-de-pagamento/metodos-de-pagamento.module';

@Module({
  imports: [PrismaModule, MetodosDePagamentoModule],
  controllers: [AppController, MetodosDePagamentoController],
  providers: [AppService, MetodosDePagamentoService],
})
export class AppModule {}
