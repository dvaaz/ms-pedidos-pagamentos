import { Controller } from '@nestjs/common';
import { EnderecoDeEntregaService } from './endereco_de_entrega.service';

@Controller('endereco-de-entrega')
export class EnderecoDeEntregaController {
  constructor(private readonly enderecoDeEntregaService: EnderecoDeEntregaService) {}
}
