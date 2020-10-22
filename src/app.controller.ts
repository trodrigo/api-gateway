import { Body, Controller, Get, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { CriarCategoriaDto } from 'src/dtos/criar-categoria.dto';

@Controller('api/v1')
export class AppController {

  private logger = new Logger(AppController.name)
  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:60lO7CUob613@34.203.216.219:5672/smartranking'],
        queue: 'admin-backend'
      }

    })
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  async criarCateoria(
    @Body() criarCategoriaDto: CriarCategoriaDto){
      return await this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto)
    }
}
