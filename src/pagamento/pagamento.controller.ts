import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Headers,
} from '@nestjs/common';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { PagamentoService } from './pagamento.service';

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post()
  create(
    @Headers('userId') userId: string,
    @Body() createPagamentoDto: CreatePagamentoDto,
  ) {
    return this.pagamentoService.create(userId, createPagamentoDto);
  }

  @Get(':id/status')
  getStatus(@Headers('userId') userId: string, @Param('id') id: string) {
    return this.pagamentoService.getStatusPagamento(userId, id);
  }

  @Patch(':id/efetuar')
  efetuar(@Headers('userId') userId: string, @Param('id') id: string) {
    return this.pagamentoService.efetuarPagamento(userId, id);
  }
}
