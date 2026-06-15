import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7'; // Importa a função uuidv7 para gerar UUIDs
import { EnderecoDeEntregaRepository } from 'src/database/endereco_de_entrega.repository';
import {
  Prisma as PrismaClient,
  endereco_de_entrega as EnderecoEntregaModel,
} from '../generated/prisma/client.js';
import { CreateEnderecoDeEntregaDto as createDto } from './dto/create-endereco_de_entrega.dto';
import {
  UpdateEnderecoDeEntregaDto as updateDto,
  UpdateEnderecoDeEntregaDto,
} from './dto/update-endereco_de_entrega.dto';

@Injectable()
export class EnderecoDeEntregaService {
  constructor(private readonly repository: EnderecoDeEntregaRepository) { }

  /**
   * Cria um novo endereço de entrega
   * @param data
   * @returns
   */
  async create(data: createDto): Promise<EnderecoEntregaModel> {
    // verifica se o cep e o destinatário foram fornecidos
    // deve receber no header o uuid do usuário, nesse momento recebe
    try {
      if (!data.cep || data.cep.trim() === '') {
        throw new Error('O CEP é obrigatório');
      }
      if (!data.destinatario || data.destinatario.trim() === '') {
        throw new Error('O destinatário é obrigatório');
      }
      // Verifica se o usuario_uuid é válido
      // TODO: Verificar se o usuário existe no sistema, caso contrário, lançar um erro

      // Verifica se o usuario possui no máximo 3 endereços cadastrados
      const canCreate = await this.repository.countMaxEndereco(data.destinatario.trim());
      if (canCreate == false) {
        throw new Error(
          'O usuário já possui o número máximo de endereços cadastrados',
        );
      }


      const model: Omit<
        EnderecoEntregaModel,
        'endereco_created_at' | 'endereco_updated_at'
      > = {
        endereco_uuid: uuidv7(),
        endereco_usuario_uuid: data.destinatario.trim(),
        endereco_cep: createDto.cepLimpo(data.cep),
        endereco_logradouro: data.logradouro ? data.logradouro.trim() : '',
        endereco_numero: createDto.numeroInt(data.numero),
        endereco_complemento: data.complemento ? data.complemento.trim() : '',
        endereco_municipio: data.municipio ? data.municipio.trim() : '',
        endereco_uf: data.uf ? data.uf.trim().toUpperCase() : '',
      };

      return await this.repository.create(model);
    } catch (e) {
      throw new Error(`Erro ao criar endereço de entrega: ${e.message}`);
    }
  }

  /**
   * Busca todos os endereços de entrega (rota Admin)
   * @returns
   */
  async findAll() {
    try {
      return await this.repository.findAll({});
    } catch (e) {
      throw new Error(`Erro ao buscar endereços de entrega: ${e.message}`);
    }
  }

  /**
   * Busca por todos os endereços de entrega de um usuário especifico. Cada usuário tem um máximo de 3 endereços cadastrados
   * @param usuario_uuid
   * @returns
   */
  async findAllByUsuario(user: string) {
    try {
      // Verifica se o usuario_uuid é válido
      // TODO: Verificar se o usuário existe no sistema, caso contrário, lançar um erro
      const trimmedUser = user.trim();
      if (trimmedUser && trimmedUser !== '') {
        return await this.repository.findAllByUser(trimmedUser);
      }

      throw new Error("Usuário não informado");

    } catch (e) {
      throw new Error(
        `Erro ao buscar endereços de entrega do usuário: ${e.message}`,
      );
    }
  }

  /**
   * Busca por um endereço de entrega por id
   * @param input
   * @returns
   */
  async findOne(
    user: string,
    input: string,
  ): Promise<EnderecoEntregaModel | null> {
    // Verifica se o usuario_uuid é válido
    // TODO: Verificar se o usuário existe no sistema, caso contrário, lançar um erro
    const endereco = await this.repository.findOne(input);

    if (!endereco) {
      throw new Error('Endereço de entrega não encontrado');
    }
    if (endereco.endereco_usuario_uuid !== user) {
      throw new Error('Endereço de entrega não pertence ao usuário');
    }

    return endereco;
  }

  /**
   * Atualiza um endereço de entrega por id
   * @param id
   * @param data
   * @returns
   */
  async update(
    id: string,
    user: string,
    data: UpdateEnderecoDeEntregaDto,
  ): Promise<EnderecoEntregaModel> {
    try {
      // Verifica se o endereço existe antes de tentar atualizar
      const existing = await this.repository.findOne(id);
      // Se o endereço não existir, lança um erro
      if (!existing) {
        throw new Error('Endereço de entrega não encontrado');
      }

      const updateData: PrismaClient.endereco_de_entregaUpdateInput = {};

      if (data.cep !== undefined) {
        updateData.endereco_cep = createDto.cepLimpo(data.cep);
        if (updateData.endereco_cep === '') {
          throw new Error('O CEP não pode ser vazio');
        }
      }
      if (data.logradouro !== undefined) {
        updateData.endereco_logradouro = data.logradouro.trim();
      }
      if (data.numero !== undefined) {
        updateData.endereco_numero = createDto.numeroInt(data.numero);
      }
      if (data.complemento !== undefined) {
        updateData.endereco_complemento = data.complemento.trim();
      }
      if (data.municipio !== undefined) {
        updateData.endereco_municipio = data.municipio.trim();
      }
      if (data.uf !== undefined) {
        updateData.endereco_uf = data.uf.trim().toUpperCase();
      }

      return await this.repository.update(id, updateData);
    } catch (e) {
      throw new Error(`Erro ao atualizar endereço de entrega: ${e.message}`);
    }
  }

  /**
   * Deleta um endereço de entrega por id
   * @param id
   * @returns
   */
  async remove(id: string, user: string): Promise<boolean> {
    try {
      // Verifica se o endereço existe antes de tentar deletar
      const existing = await this.repository.findOne(id);
      // Se o endereço não existir, retorna false
      if (!existing) {
        return false;
      }
      // Tenta deletar o endereço
      await this.repository.remove(id);
      // Se a deleção for bem-sucedida, retorna true
      return true;
    } catch (e) {
      throw new Error(`Erro ao deletar endereço de entrega: ${e.message}`);
    }
  }
}
