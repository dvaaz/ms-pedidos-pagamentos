import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemPedidoService } from './item_pedido.service';
import { CreateItemPedidoDto } from './dto/create-item_pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item_pedido.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Produtos do Pedido')
@Controller('item-pedido')
export class ItemPedidoController {
  constructor(private readonly itemPedidoService: ItemPedidoService) {}

  // @Post()
  // create(@Body() createItemPedidoDto: CreateItemPedidoDto) {
  //   return this.itemPedidoService.create(createItemPedidoDto);
  // }

  @Get('pedido/:pedidoId')
  findAll(@Param('pedidoId') pedidoId: string) {
    return this.itemPedidoService.findAll(pedidoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemPedidoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemPedidoDto: UpdateItemPedidoDto) {
    return this.itemPedidoService.update(+id, updateItemPedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemPedidoService.remove(+id);
  }
}
