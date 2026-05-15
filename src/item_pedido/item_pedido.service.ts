import { Injectable } from '@nestjs/common';
import { CreateItemPedidoDto } from './dto/create-item_pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item_pedido.dto';


@Injectable()
export class ItemPedidoService {

  /**
   * Essa funcao recebe um um DTO de criação de itemPedido, entra em contato com API externa para verificar os nome e preços atuais do produto
   * @param createItemPedidoDto 
   * @returns 
   */
  create(createItemPedidoDto: CreateItemPedidoDto) {
    return `This action adds a new itemPedido with produto_id: ${createItemPedidoDto.produto_id}, item_nome: ${createItemPedidoDto.item_nome}, item_preco: ${createItemPedidoDto.item_preco}`;
  }

  findAll() {
    return `This action returns all itemPedido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemPedido`;
  }

  update(id: number, updateItemPedidoDto: UpdateItemPedidoDto) {
    return `This action updates a #${id} itemPedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemPedido`;
  }
}
