import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetodosDePagamentoService } from './metodos_de_pagamento.service';
import type { MetodosDePagamento } from './dto/metodos-de-pagamento.dto';
import { metodos_de_pagamento as MetodoModel } from 'src/generated/prisma/client';

@Controller('metodos-de-pagamento')
export class MetodosDePagamentoController {
  constructor(private readonly metodosDePagamentoService: MetodosDePagamentoService) {}

  // Método responsável por criar novo método de pagamento.
  @Post()
  async create(@Body() data: MetodosDePagamento): Promise<MetodoModel> {
    return this.metodosDePagamentoService.create(data);
    }

  // Método responsável por listar todos os métodos de pagamento.
  @Get()
  async findAll(): Promise<MetodoModel[]> {
    return this.metodosDePagamentoService.metodos({
    });
  }

  // Método responsável por listar um método de pagamento específico com base no ID fornecido.
  @Get(":id")
  async findOne(@Param('id') id: string): Promise<MetodoModel> {
    return this.metodosDePagamentoService.metodo({ 
      metodos_de_pagamento_id: Number(id) 
    });
  }

  // Método responsável por listar um método de pagamento específico com base no nome fornecido.
  @Get("nome/:id")
  async findByName(@Param('nome') id: string): Promise<MetodoModel> {
    return this.metodosDePagamentoService.metodo({ 
      nome: id 
    });
  }

  // Método responsável por atualizar um método de pagamento específico com base no ID fornecido.
  @Patch(":id")
  async update(@Param('id') id: string, @Body() data: MetodosDePagamento): Promise<MetodoModel> {
    return this.metodosDePagamentoService.update({
      where: { id: Number(id) },
      data,
    });
  }

  // Método responsável por remover um método de pagamento específico com base no ID fornecido.
  @Delete(":id")
  async remove(@Param('id') id: string): Promise<MetodoModel> {
    return this.metodosDePagamentoService.remove({ id: Number(id) });
  }
}