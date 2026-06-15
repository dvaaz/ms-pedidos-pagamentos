import { Module } from '@nestjs/common';
import { EnderecoDeEntregaService } from './endereco_de_entrega.service';
import { EnderecoDeEntregaController } from './endereco_de_entrega.controller';
import { EnderecoDeEntregaRepository } from 'src/database/endereco_de_entrega.repository';

@Module({
  controllers: [EnderecoDeEntregaController],
  providers: [EnderecoDeEntregaService, EnderecoDeEntregaRepository],
  exports: [EnderecoDeEntregaService],
})
export class EnderecoDeEntregaModule { }
