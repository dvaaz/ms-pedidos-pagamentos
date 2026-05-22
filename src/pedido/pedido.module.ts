import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ItemPedidoService } from 'src/item_pedido/item_pedido.service';
import { EnderecoDeEntregaService } from 'src/endereco_de_entrega/endereco_de_entrega.service';

@Module({
  controllers: [PedidoController],
  providers: [
    PedidoService,
    PrismaService,
    ItemPedidoService,
    EnderecoDeEntregaService
  ],
})
export class PedidoModule {}
