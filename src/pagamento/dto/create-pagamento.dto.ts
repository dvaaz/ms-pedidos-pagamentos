import { ApiProperty } from '@nestjs/swagger';

export class CreatePagamentoDto {
  @ApiProperty({ description: 'UUID do pedido' })
  pedido_uuid!: string;

  @ApiProperty({ description: 'ID do método de pagamento' })
  metodos_de_pagamento_id!: number;

  @ApiProperty({
    description: 'Quantidade de parcelas',
    required: false,
    minimum: 1,
  })
  pagamento_numero_parcelas?: number;
}
