import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusPedidoService } from './status_pedido.service';
import type { CreateStatusPedidoDto } from './dto/create-status_pedido.dto';
import type { UpdateStatusPedidoDto } from './dto/update-status_pedido.dto';
import { status_pedido as StatusPedidoModel } from '../generated/prisma/client';

@Controller('status_pedido')
export class StatusPedidoController {
  constructor(private readonly StatusPedidoService: StatusPedidoService) {}

  @Post()
  create(@Body() data: CreateStatusPedidoDto) : Promise<StatusPedidoModel> {
    return this.StatusPedidoService.create(data);
  }

  @Get()
  findAll(): Promise<StatusPedidoModel[]> {
    return this.StatusPedidoService.findAll({});
  }

  @Get('/:id')
  findOne(@Param('id') id: number): Promise<StatusPedidoModel | null> {
    return this.StatusPedidoService.findOne(+id); // o parametro está vindo como string o '+' alterna para number
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() data: UpdateStatusPedidoDto) {
    return this.StatusPedidoService.update({ where: { status_pedido_id: +id }, data });
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.StatusPedidoService.remove({ status_pedido_id: +id });
  }
}
