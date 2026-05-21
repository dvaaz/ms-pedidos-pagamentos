import { Injectable } from '@nestjs/common';
import { CreateItemPedidoDto } from './dto/verify-item_pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item_pedido.dto';
// import axios from 'axios'; // Importando a biblioteca axios para fazer requisições HTTP
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class ItemPedidoService {
  constructor(
            private readonly prisma: PrismaService
  ) {}

  /**
   * Essa funcao recebe um um DTO de criação de itemPedido, entra em contato com API externa para verificar os nome e preços atuais do produto
   * @param createItemPedidoDto 
   * @returns 
   */
  create(createItemPedidoDto: CreateItemPedidoDto) {
    // Aqui a funcao recebe o id do produto e entra em contato com a API externa para verificar o nome e o preço atual do produto. Depois disso, o itemPedido é criado com as informações atualizadas e armazenado no banco de dados. O id do itemPedido criado é retornado para ser associado ao pedido posteriormente.
    const produto = axios.get(`http://api.produto.com/produtos/${createItemPedidoDto.produto_id}`);
    const itemPedido = {
      
  }

  findAll() {
    return `This action returns all itemPedido`;
  }

  findOne(pedidoId: string, itemId: string) { // A busca por item pedido será feita através do id do item e do pedido

  }

  update(id: number, updateItemPedidoDto: UpdateItemPedidoDto) { // não haverá update de itemPedido, mas vamos deixar esse método aqui para manter a estrutura do CRUD
    return `This action updates a #${id} itemPedido`;
  }

  remove(id: number) { // não haverá remoção de itemPedido, mas vamos deixar esse método aqui para manter a estrutura do CRUD
    return `This action removes a #${id} itemPedido`;
  }
}
