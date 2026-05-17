import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidoService {

  /**
   * 
   * @param createPedidoDto 
   * @returns 
   */
  create(user: string, createPedidoDto: CreatePedidoDto) {
    // Na esperança que o usuário já esteja autenticado e o token JWT seja decodificado, podemos acessar o nome do usuário diretamente.
    // Então a primeira tarefa é garantir que o nome do usuário seja passado corretamente para este método. Isso pode ser feito através de um guard ou interceptor que decodifica o token JWT e extrai o nome do usuário, passando-o como argumento para este método.
    // Agora, com o nome do usuário disponível, podemos associar o pedido criado a esse usuário. Isso pode ser feito armazenando o nome do usuário junto com os detalhes do pedido no banco de dados.
    // A partir desse momento vamos acessaar ao item_pedido para passar o id de cada item e sua quantidade
  
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
