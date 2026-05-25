import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CreateItemPedidoDto } from '../item_pedido/dto/create-item_pedido.dto';
import { uuidv7 } from 'uuidv7';
import got from 'got';
import { EnderecoDeEntregaService } from '../endereco_de_entrega/endereco_de_entrega.service';
import { PrismaService } from '../database/prisma/prisma.service';
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

      if (!endereco || endereco.endereco_uuid !== createPedidoDto.endereco_id) {
        throw new NotFoundException('Enderenço não encontrado');
      }
      const pedidoUuid = uuidv7(); // Gera um UUID para o pedido


      // Cria um array para armazenar as IDs do item do pedido vindos no dto CreatePedidoDto.
      const produtosPedido: Omit<CreateItemPedidoDto, 'pedido_uuid'>[] = [];

      for (const item of createPedidoDto.itens_pedido) {
        const produto: Omit<CreateItemPedidoDto, 'pedido_uuid'> = {
          produto_id: item.produto_id,
          item_quantidade: item.item_quantidade,
          produto_nome: item.produto_nome,
          produto_preco: item.produto_preco,
        }
        produtosPedido.push(produto);
      }

      const [createProdutosPedido, valorTotalDoPedido] = await this.produto.create(pedidoUuid, produtosPedido);
      if (!createProdutosPedido || createProdutosPedido.length === 0) {
        throw new BadRequestException('Não foi possível criar os itens do pedido');
      }

      const pedido: Omit<PedidoModel,
        'pedido_created_at' | 'pedido_updated_at'> = {
        pedido_uuid: pedidoUuid,
        usuario_uuid: user,
        pedido_nome_destinatario: createPedidoDto.destinatario || 'Destinatário não informado',
        endereco_de_entrega_uuid: endereco.endereco_uuid,
        pedido_valor_total: valorTotalDoPedido,
        status_pedido_id: 1, // Status inicial do pedido, pode ser alterado posteriormente
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


      return await this.prisma.pedido.create({
        data: pedido
      });



    } catch (error) {
      throw new Error('Error creating pedido');
    }
  }

  async findAll(userId: string): Promise<PedidoModel[]> {
    try {
      return await this.prisma.pedido.findMany({
        where: { usuario_uuid: userId },
      });

    } catch (error) {
      throw new BadRequestException(`Não foi possivel encontrar os pedidos ${error}`);
    }

  }

  async findOne(id: string): Promise<PedidoModel> {
    try {
      const pedido = await this.prisma.pedido.findUnique({
        where: { pedido_uuid: id },
      });

      // Se o Prisma não encontrar, ele retorna null. Tratamos com a Exception nativa do NestJS
      if (!pedido) {
        throw new NotFoundException(`Pedido com o UUID ${id} não foi encontrado.`);
      }

      return pedido;
    } catch (error) {
      // Se a exceção já for do NestJS (o NotFoundException acima), apenas a repasse adiante
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      // Erros de banco de dados (ex: string de UUID malformada ou falha de conexão) caem aqui
      const mensagemErro = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Erro ao buscar o pedido: ${mensagemErro}`);
    }
  }



  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} pedido`;
  }
}
