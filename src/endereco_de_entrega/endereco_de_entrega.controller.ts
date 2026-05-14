import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnderecoDeEntregaService } from './endereco_de_entrega.service';
import { CreateEnderecoDeEntregaDto } from './dto/create-endereco_de_entrega.dto';
import { endereco_de_entrega as EnderecoEntregaModel } from '../generated/prisma/client';

@Controller('endereco')
export class EnderecoDeEntregaController {
  constructor(private readonly enderecoDeEntregaService: EnderecoDeEntregaService) {}
    
  /**
   * Cria um novo endereço de entrega
   * @param data 
   * @returns 
   */
  @Post()
    create(@Body() data: CreateEnderecoDeEntregaDto) : Promise<EnderecoEntregaModel> {
        return this.enderecoDeEntregaService.create(data);
  }

  /**
   * Busca todos os endereços de entrega 
   * @returns
   */
  @Get()
  findAll() {
    return this.enderecoDeEntregaService.findAll({});
  }

  /**
   * Busca um endereço de entrega por ID
   * @param id 
   * @returns 
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enderecoDeEntregaService.findAll({
      where: { endereco_uuid: id }
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnderecoDeEntregaDto: any) {
    return this.enderecoDeEntregaService.update(id, updateEnderecoDeEntregaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enderecoDeEntregaService.remove(id);
  }
}
