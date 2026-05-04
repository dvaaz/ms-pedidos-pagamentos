import { Test, TestingModule } from '@nestjs/testing';
import { MetodosDePagamentoController } from './metodos-de-pagamento.controller';

describe('MetodosDePagamentoController', () => {
  let controller: MetodosDePagamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetodosDePagamentoController],
    }).compile();

    controller = module.get<MetodosDePagamentoController>(MetodosDePagamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
