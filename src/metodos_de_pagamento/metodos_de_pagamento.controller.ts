import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetodosDePagamentoService } from './metodos_de_pagamento.service';
import type { CreateMetodosDePagamentoDto } from './dto/create-metodos_de_pagamento.dto';
import type { UpdateMetodosDePagamentoDto } from './dto/update-metodos_de_pagamento.dto';
import { metodos_de_pagamento as PagamentoModel } from '../generated/prisma/client';

@Controller('metodos_de_pagamento')
export class MetodosDePagamentoController {
  constructor(private readonly metodosDePagamentoService: MetodosDePagamentoService) {}

  @Post()
  create(@Body() data: CreateMetodosDePagamentoDto) : Promise<PagamentoModel> {
    return this.metodosDePagamentoService.create(data);
  }

  @Get()
  findAll(): Promise<PagamentoModel[]> {
    return this.metodosDePagamentoService.findAll({});
  }

  @Get('/:id')
  findOne(@Param('id') id: number): Promise<PagamentoModel | null> {
    return this.metodosDePagamentoService.findOne(+id); // o parametro está vindo como string o '+' alterna para number
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() data: UpdateMetodosDePagamentoDto) {
    return this.metodosDePagamentoService.update({ where: { metodos_de_pagamento_id: +id }, data });
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.metodosDePagamentoService.remove({ metodos_de_pagamento_id: +id });
  }
}
