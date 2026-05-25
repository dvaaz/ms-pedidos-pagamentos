import { Prisma as PrismaNameSpace } from '../generated/prisma/client.js';
import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { CreateItemPedidoDto } from '../item_pedido/dto/create-item_pedido.dto';
import { uuidv7 } from 'uuidv7';
import got from 'got';
import { EnderecoDeEntregaService } from '../endereco_de_entrega/endereco_de_entrega.service';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  Prisma as PrismaClient,
  item_pedido as ItemPedidoModel,
  pedido as PedidoModel,
  status_pedido as StatusPedidoModel
} from '../generated/prisma/client.js';
import { ItemPedidoService } from '../item_pedido/item_pedido.service';
import { StatusPedidoService } from '../status_pedido/status_pedido.service.js';


@Injectable()
export class PedidoService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly entrega: EnderecoDeEntregaService,
    private readonly produto: ItemPedidoService,
    private readonly statusPedido: StatusPedidoService
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

      // Outra possibilidade seria criar o pedido primeiro, e depois criar os itens do pedido, associando-os ao pedido criado ou caso nao seja possivel confirmar nenhum produto anexar o status 'REJEITADO'.
      // No entanto, isso exigiria uma transação para garantir a atomicidade da operação, o que pode ser mais complexo de implementar. 
      // Para simplificar, optei por criar os itens do pedido primeiro e depois criar o pedido associando os itens criados.


      const statusPedido = await this.prisma.status_pedido.findFirst({
        where: {
          status_pedido_nome: 'ACEITO',
        },
        select: {
          status_pedido_id: true,
        },
      });

      if (!statusPedido) {
        throw new NotFoundException('Status do pedido não encontrado');
      }

      const pedido: Omit<PedidoModel,
        'pedido_created_at' | 'pedido_updated_at'> = {
        pedido_uuid: pedidoUuid,
        usuario_uuid: user,
        pedido_nome_destinatario: createPedidoDto.destinatario || 'Destinatário não informado',
        endereco_de_entrega_uuid: endereco.endereco_uuid,
        pedido_valor_total: valorTotalDoPedido,
        status_pedido_id: statusPedido.status_pedido_id,
      };

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


  /**
   * Atualiza o status do pedido para o próximo status na sequência.
   * @param id 
   */
  async updateStatusPedido(id: string) {
    const statusAtual = await this.prisma.pedido.findUnique({
      where: { pedido_uuid: id },
      select: { status_pedido_id: true ,
         status_pedido: true
      },
    });

    if (!statusAtual) {
      throw new NotFoundException(`Pedido com o UUID ${id} não foi encontrado.`);
    }

    const novoStatusId: number = await this.statusPedido.updateStatusPedido(statusAtual.status_pedido_id);
    if (!novoStatusId) {
      throw new BadRequestException(`Não foi possível atualizar o status do pedido com o UUID ${id}. Status atual: ${statusAtual.status_pedido}`);
    }
    // transforma o novoStatusId em number    

    const statusAtualizado = await this.prisma.pedido.update({
      where: { pedido_uuid: id },
      data: { status_pedido_id: novoStatusId },
    });

    if (!statusAtualizado) {
      throw new NotFoundException(`Não foi possível atualizar o status do pedido com o UUID ${id}.`);
    }




  }

  /**
   * Altera o endereço de entrega de um pedido específico. Recebe o ID do pedido e o ID do novo endereço de entrega.
   * @param id 
   * @param endereco_id 
   */
  async updateEndereco(id: string, endereco_id: string) {
    try {
      const pedido = await this.prisma.pedido.findUniqueOrThrow({
        where: { pedido_uuid: id },
        select: {
          pedido_uuid: true,
          usuario_uuid: true,
        }
      });

      if (!pedido) {
        throw new NotFoundException(`Pedido não encontrado.`);
      }

      // Busca o endereço de entrega para garantir que ele exista e pertença ao mesmo usuário do pedido
      const endereco = this.prisma.endereco_de_entrega.findFirst({
        where: { endereco_uuid: endereco_id, endereco_usuario_uuid: pedido.usuario_uuid },
      });

      if (!endereco) {
        throw new NotFoundException(`Endereço de entrega não encontrado para o usuário.`);
      }

      // Atualiza o endereço de entrega do pedido
      try {
        const updatedPedido = await this.prisma.pedido.update({
          where: { pedido_uuid: id },
          data: {
            endereco_de_entrega_uuid: endereco_id,
          },
        });
      } catch (error) {
        if (error instanceof PrismaNameSpace.PrismaClientKnownRequestError && error.code === 'P2025') {
          // Registro não encontrado
          return null;
        }
        throw error; // Re-throw outros erros
      }

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const mensagemErro = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Erro ao atualizar o endereço de entrega: ${mensagemErro}`);
    }
  }

}
