import { Module } from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import { StatusPedidoService } from './status_pedido.service';
import { StatusPedidoController } from './status_pedido.controller';
import { PrismaService } from 'src/database/prisma/prisma.service';


@Module({
    controllers: [StatusPedidoController],
    providers: [
        StatusPedidoService,
        PrismaService
    ],
    exports: [StatusPedidoService],
    imports: [HttpModule]
})
export class StatusPedidoModule {}
