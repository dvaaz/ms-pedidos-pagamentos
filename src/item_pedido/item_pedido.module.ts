import { Module } from '@nestjs/common';
import { ItemPedidoService } from './item_pedido.service';
import { ItemPedidoController } from './item_pedido.controller';

@Module({
  controllers: [ItemPedidoController],
  providers: [ItemPedidoService],
})
export class ItemPedidoModule {}
