import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CreateItemPedidoDto } from '../item_pedido/dto/create-item_pedido.dto';
import { VerifyItemPedidoDto } from '../item_pedido/dto/verify-item_pedido.dto';
import { uuidv7 } from 'uuidv7';
// import { HttpService } from '@nestjs/axios';
import got from 'got';
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
  async create(user: string, createPedidoDto: CreatePedidoDto) {
    // Como o UUID do usuário virá da API de carrinho, pulamos a etapa de validação do mesmo, podemos apenas validar o carrinho (por segurança).
    // TODO: Lógica de validação do carrinho do usuário para garantir que os itens do pedido sejam válidos.
    try {
      const endereco = await this.entrega.findOne(user, createPedidoDto.endereco_id);
      if(!endereco){
        throw new NotFoundException('Enderenço não encontrado');
      }
      const pedidoUuid = uuidv7(); // Gera um UUID para o pedido
      // Cria um array para armazenar as IDs do item do pedido vindos no dto CreatePedidoDto.
      const itensValidados: CreateItemPedidoDto[] = [];
      const urlProduto = 'http://localhost:3001/produtos/verificar'; // substituir pelo real
      for (const item of createPedidoDto.itens_pedido) {

      try {

        const response: any = await got(urlProduto, {
          header: {
            produto_id: item.produto_id
          },
          responseType: 'json'
        });

        const produto = response.body;
        
        
        if (produto && produto.disponivel) {

          itensValidados.push({
            pedido_uuid: pedidoUuid,
            produto_id: produto.id,
            produto_nome: produto.nome,
            produto_preco: produto.preco,
            item_quantidade: item.item_quantidade
          });

        }

      } catch (error) {

        // Ignora item inválido e continua
        console.error(
          `Erro ao validar produto ${item.produto_id}`,
          error.message
        );

      }

    }

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
