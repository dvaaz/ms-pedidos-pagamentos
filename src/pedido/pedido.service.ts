import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CreateItemPedidoDto } from '../item_pedido/dto/create-item_pedido.dto';
import { CheckItemPedidoDto } from '../item_pedido/dto/check-item_pedido.dto';
import { ResponseItemPedidoDto } from '../item_pedido/dto/response-item_pedido.dto'
import { uuidv7 } from 'uuidv7';
// import { HttpService } from '@nestjs/axios';
import got from 'got';
import { EnderecoDeEntregaService } from '../endereco_de_entrega/endereco_de_entrega.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { item_pedido } from '../generated/prisma/browser';
import { Prisma as PrismaClient, item_pedido as ItemPedidoModel, pedido as PedidoModel } from '../generated/prisma/client.js';
import { ItemPedidoService } from '../item_pedido/item_pedido.service';


@Injectable()
export class PedidoService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly entrega: EnderecoDeEntregaService,
    private readonly produto: ItemPedidoService
  ) { }

  /**
   * Recebe o id do usuário e uma string de itens do pedido e retorna a confirmação de criação do pedido. 
   * @param createPedidoDto 
   * @returns 
   */
  async create(user: string, createPedidoDto: CreatePedidoDto): Promise<PedidoModel> {
    // Como o UUID do usuário virá da API de carrinho, pulamos a etapa de validação do mesmo, podemos apenas validar o carrinho (por segurança).
    // TODO: Lógica de validação do carrinho do usuário para garantir que os itens do pedido sejam válidos.
    try {
      const endereco = await this.entrega.findOne(user, createPedidoDto.endereco_id); // tambem poderia ser via prisma

      if (!endereco) {
        throw new NotFoundException('Enderenço não encontrado');
      }
      const pedidoUuid = uuidv7(); // Gera um UUID para o pedido


        // Cria um array para armazenar as IDs do item do pedido vindos no dto CreatePedidoDto.
        const produtosPedido: Omit<CreateItemPedidoDto,
        'pedido_uuid'>[] = [];

        for (const item of createPedidoDto.itens_pedido) {
          const produto: Omit<CreateItemPedidoDto,
              'pedido_uuid'> = {
            produto_id: item.produto_id,
            item_quantidade: item.item_quantidade,
            produto_nome: item.produto_nome,
            produto_preco: item.produto_preco,
          }
          produtosPedido.push(produto);
        }
        
        const createProdutosPedido: ItemPedidoModel[] = await this.produto.create(pedidoUuid, produtosPedido);
        if (!createProdutosPedido || createProdutosPedido.length === 0) {
          throw new BadRequestException('Não foi possível criar os itens do pedido');
        }

        const pedido: PedidoModel = {
          pedido_uuid: pedidoUuid,
          pedido_usuario_uuid: user,
          pedido_endereco_uuid: createPedidoDto.endereco_id,
          pedido_status: 'PENDENTE',
        };

        // const urlProduto = 'http://localhost:3001/produtos/verificar/'; // substituir pelo real

        // const response = await got.post<ResponseItemPedidoDto>(
        //   urlProduto,
        //   {
        //     json: {
        //       itenspedido
        //     },
        //     responseType: 'json'
        //   }
        // );

        // const produto = response.body;
        
        
        return this.prisma.pedido.create({
          data: pedido
        });

    } catch(error) {
      throw new Error('Error creating pedido');
    }
  }

findAll(userId: string): Promise<PedidoModel[]> {
  try{
    return this.prisma.pedido.findMany({
      where: { usuario_uuid: userId },
    });
  } catch (error){
    throw new BadRequestException(`Não foi possivel encontrar os pedidos ${error}`);
  }
  
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
