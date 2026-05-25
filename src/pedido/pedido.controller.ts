import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post(':userId')
  create(@Param('userId') userId: string, @Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(userId,createPedidoDto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.pedidoService.findAll(userId);
  }

  @Get('findone/:id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(id);
  }


  @Patch('update-endereco/:id')
  @ApiOperation({ summary: 'Atualiza o endereço de entrega de um pedido com outro já existente' })
  updateEndereco(@Param('id') id: string, @Body() enderecoId: string) {
    return this.pedidoService.updateEndereco(id, enderecoId);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.pedidoService.remove(+id);
  // }
}
