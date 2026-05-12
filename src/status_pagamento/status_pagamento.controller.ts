import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusPagamentoService } from './status_pagamento.service';
import type { CreateStatusPagamentoDto } from './dto/create-status_pagamento.dto';
import type { UpdateStatusPagamentoDto } from './dto/update-status_pagamento.dto';
import { status_pagamento as StatusPagamentoModel } from '../generated/prisma/client';

@Controller('status_pagamento')
export class StatusPagamentoController {
  constructor(private readonly StatusPagamentoService: StatusPagamentoService) {}

  @Post()
  create(@Body() data: CreateStatusPagamentoDto) : Promise<StatusPagamentoModel> {
    return this.StatusPagamentoService.create(data);
  }

  @Get()
  findAll(): Promise<StatusPagamentoModel[]> {
    return this.StatusPagamentoService.findAll({});
  }

  @Get('/:id')
  findOne(@Param('id') id: number): Promise<StatusPagamentoModel | null> {
    return this.StatusPagamentoService.findOne(+id); // o parametro está vindo como string o '+' alterna para number
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() data: UpdateStatusPagamentoDto) {
    return this.StatusPagamentoService.update({ where: { status_pagamento_id: +id }, data });
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.StatusPagamentoService.remove({ status_pagamento_id: +id });
  }
}
