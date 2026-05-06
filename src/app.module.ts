import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma/prisma.module';
import { MetodosDePagamentoService } from './metodos_de_pagamento/metodos_de_pagamento.service';
import { MetodosDePagamentoController } from './metodos_de_pagamento/metodos_de_pagamento.controller';
import { MetodosDePagamentoModule } from './metodos_de_pagamento/metodos_de_pagamento.module';


@Module({
  imports: [PrismaModule, MetodosDePagamentoModule],
  controllers: [AppController, MetodosDePagamentoController],
  providers: [AppService, MetodosDePagamentoService],
})
export class AppModule {}
