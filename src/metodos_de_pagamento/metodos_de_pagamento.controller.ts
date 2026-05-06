import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetodosDePagamentoService } from './metodos_de_pagamento.service';
import type { CreateMetodosDePagamentoDto } from './dto/create-metodos_de_pagamento.dto';
import type { UpdateMetodosDePagamentoDto } from './dto/update-metodos_de_pagamento.dto';

@Controller('metodos_de_pagamento')
export class MetodosDePagamentoController {
  constructor(private readonly metodosDePagamentoService: MetodosDePagamentoService) {}

  @Post()
  create(@Body() createMetodosDePagamentoDto: CreateMetodosDePagamentoDto) {
    return this.metodosDePagamentoService.create(createMetodosDePagamentoDto);
  }

  @Get()
  findAll() {
    return this.metodosDePagamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodosDePagamentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetodosDePagamentoDto: UpdateMetodosDePagamentoDto) {
    return this.metodosDePagamentoService.update(+id, updateMetodosDePagamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metodosDePagamentoService.remove(+id);
  }
}
