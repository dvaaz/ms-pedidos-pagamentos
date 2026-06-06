import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { PagamentoService } from './pagamento.service';

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post()
  create(@Body() createPagamentoDto: CreatePagamentoDto) {
    return this.pagamentoService.create(createPagamentoDto);
  }

  @Get(':id/status')
  getStatus(@Param('id') id: string) {
    return this.pagamentoService.getStatusPagamento(id);
  }

  @Patch(':id/efetuar')
  efetuar(@Param('id') id: string) {
    return this.pagamentoService.efetuarPagamento(id);
  }
}
