import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
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
  // Tera de verificar se o usuário é admin ou não, para retornar todos os endereços ou apenas os do usuário
  findAll() {
    return this.enderecoDeEntregaService.findAll({});
  }

  /**
   * Busca um endereço de entrega por ID e verifica se pertence ao usuário autenticado
    * @param id
    * @return O endereço de entrega encontrado ou null se não encontrado ou não pertencer ao usuário
   */
  @Get(':id/:user')
  findOne(
    @Param('id') id: string,
    @Param('user') user: string,
    // @Req() req: any // Substitua 'any' pelo tipo correto do request, se disponível
  ) {
    // const user = req.user; // Supondo que o middleware de autenticação tenha adicionado o usuário ao request
    return this.enderecoDeEntregaService.findOne(id, user);
  }

  @Patch(':id/:user')
  update(@Param('id') id: string, @Param('user') user: string, @Body() updateEnderecoDeEntregaDto: any) {
    return this.enderecoDeEntregaService.update(id, user, updateEnderecoDeEntregaDto);
  }

  @Delete(':id/:user')
  remove(@Param('id') id: string, @Param('user') user: string) {
    return this.enderecoDeEntregaService.remove(id, user);
  }
}
