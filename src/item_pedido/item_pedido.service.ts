import { Injectable, BadRequestException, NotFoundException  } from '@nestjs/common';
import { CreateItemPedidoDto } from './dto/check-item_pedido.dto';
import { UpdateItemPedidoDto } from './dto/update-item_pedido.dto';
// import axios from 'axios'; // Importando a biblioteca axios para fazer requisições HTTP
import { PrismaService } from 'src/database/prisma/prisma.service';
import { Prisma as PrismaClient, item_pedido as ItemPedidoModel } from '../generated/prisma/client.js';

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
  async create(pedidoId: string, createItemPedidoDto: CreateItemPedidoDto[]) : Promise<ItemPedidoModel[]> {
    // Aqui a funcao recebe o id do produto e entra em contato com a API externa para verificar o nome e o preço atual do produto. Depois disso, o itemPedido é criado com as informações atualizadas e armazenado no banco de dados. O id do itemPedido criado é retornado para ser associado ao pedido posteriormente.
    try{
      const itensDoPedido : ItemPedidoModel[] = await this.prisma.item_pedido.createMany({
        data: createItemPedidoDto.map(item => ({
          pedido_uuid: pedidoId,
          id_produto: item.produto_id,
          item_pedido_quantidade: item.item_quantidade,
          item_pedido_nome_produto: item.produto_nome,
          item_pedido_preco: (item.produto_preco) / 100,
          item_pedido_total_preco: (item.item_quantidade * item.produto_preco)/100,
        })),
        skipDuplicates: true, // Evita a criação de itens duplicados para o mesmo pedido
      });
      // return itemPedido.map(item => item.item_pedido_uuid); // caso retornemos apenas os ids dos itens do pedido, podemos associar esses ids ao pedido posteriormente
      return itensDoPedido; // retornamos o itemPedido completo para que possamos ter acesso a todas as informações do item do pedido, caso seja necessário.
    } catch (error){
      throw new BadRequestException(`Não foi possivel adicionar o item ${error}`);
    }
      
  }

  findAll(pedidoId: string) {
    try{
      return this.prisma.item_pedido.findMany({
        where: { pedido_uuid: pedidoId },
      });
    } catch (error){
      throw new BadRequestException(`Não foi possivel encontrar os itens do pedido ${error}`);
    }
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
