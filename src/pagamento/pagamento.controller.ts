import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
  @HttpCode(HttpStatus.CREATED)
  create(
    @Headers('userId') userId: string,
    @Body() createPagamentoDto: CreatePagamentoDto,
  ) {
    return this.pagamentoService.create(userId, createPagamentoDto);
  }

  @Get(':id/status')
  @HttpCode(HttpStatus.OK)
  getStatus(@Headers('userId') userId: string, @Param('id') id: string) {
    return this.pagamentoService.getStatusPagamento(userId, id);
  }

  @Patch(':id/efetuar')
  @HttpCode(HttpStatus.OK)
  efetuar(@Headers('userId') userId: string, @Param('id') id: string) {
    return this.pagamentoService.efetuarPagamento(userId, id);
  }
}
