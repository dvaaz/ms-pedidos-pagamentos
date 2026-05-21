import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CreateItemPedidoDto } from '../item_pedido/dto/create-item_pedido.dto';
import { VerifyItemPedidoDto } from '../item_pedido/dto/verify-item_pedido.dto';
import { uuidv7 } from 'uuidv7';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PedidoService {

  /**
   * Recebe o id do usuário e uma string de itens do pedido e retorna a confirmação de criação do pedido. 
   * @param createPedidoDto 
   * @returns 
   */
  create(user: string, createPedidoDto: CreatePedidoDto) {
    // Como o UUID do usuário virá da API de carrinho, pulamos a etapa de validação do mesmo, podemos apenas validar o carrinho (por segurança).
    // TODO: Lógica de validação do carrinho do usuário para garantir que os itens do pedido sejam válidos.
    try {
      const pedidoUUid = uuidv7(); // Gera um UUID para o pedido
      // Cria um array para armazenar as IDs do item do pedido vindos no dto CreatePedidoDto.
      const itensPedidoValidos: CreateItemPedidoDto[] = [];
      for createPedidoDto.itens_pedido in createPedidoDto:
        itensPedidoValidos.push(createPedidoDto.itens_pedido);      
      // Para cada item no array do pedido é feita validação do mesmo, caso seja válido o item é adicionado ao array de itens do pedido, caso não seja válido, o item é ignorado e o processo continua.
      // TODO : Envia array de itens do Pedido e a quantidade de cada um para a API de produto que retornará apenas os itens válidos incluindo seu preço, nome
      // Esses dados irao para um array de criar item pedido. Que contera o pedidoUUid criado nessa funcao, e sera encaminhado ao item_pedido

      

      return `This action adds a new pedido for user ${user} with the following details: ${JSON.stringify(createPedidoDto)}`;
    } catch (error) {
      throw new Error('Error creating pedido');
    }
  }

  findAll() {
    return `This action returns all pedido`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pedido`;
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} pedido`;
  }
}
