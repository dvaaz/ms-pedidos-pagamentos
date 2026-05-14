import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnderecoDeEntregaService } from './endereco_de_entrega.service';
import { CreateEnderecoDeEntregaDto } from './dto/create-endereco_de_entrega.dto';
import { endereco_de_entrega as EnderecoEntregaModel } from '../generated/prisma/client';

@Controller('endereco-de-entrega')
export class EnderecoDeEntregaController {
  constructor(private readonly enderecoDeEntregaService: EnderecoDeEntregaService) {}
    
  @Post()
    create(@Body() data: CreateEnderecoDeEntregaDto) : Promise<EnderecoEntregaModel> {
      return this.enderecoDeEntregaService.create(data);
    }
}
