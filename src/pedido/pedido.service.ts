import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CreateItemPedidoDto } from '../item_pedido/dto/create-item_pedido.dto';
import { VerifyItemPedidoDto } from '../item_pedido/dto/verify-item_pedido.dto';
import { uuidv7 } from 'uuidv7';
// import { HttpService } from '@nestjs/axios';
import {got} from 'got';
import { EnderecoDeEntregaService } from '../endereco_de_entrega/endereco_de_entrega.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { ItemPedidoService } from '../item_pedido/item_pedido.service';

@Injectable()
export class PedidoService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly entrega: EnderecoDeEntregaService,
    private readonly item: ItemPedidoService
  ){}

  /**
   * Recebe o id do usuário e uma string de itens do pedido e retorna a confirmação de criação do pedido. 
   * @param createPedidoDto 
   * @returns 
   */
  create(user: string, createPedidoDto: CreatePedidoDto) {
    // Como o UUID do usuário virá da API de carrinho, pulamos a etapa de validação do mesmo, podemos apenas validar o carrinho (por segurança).
    // TODO: Lógica de validação do carrinho do usuário para garantir que os itens do pedido sejam válidos.
    try {
      const endereco = await this.entrega.findOne(user, createPedidoDto.endereco_id);
      if(!endereco){
        throw new NotFoundException('Enderenço não encontrado');
      }
      const pedidoUUid = uuidv7(); // Gera um UUID para o pedido
      // Cria um array para armazenar as IDs do item do pedido vindos no dto CreatePedidoDto.
      const itensValidados: CreateItemPedidoDto[] = [];
      const urlProduto = '';
      for item in createPedidoDto.itens_pedido:
        const option = {
          Headers:{
            'produto': createPedidoDto.itens_pedido.values.
          }
        }
        const itemPedido = await got(urlProduto, produto);
        if(itemPedido){
          itensValidados.push();
        }
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
