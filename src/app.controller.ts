import { Body, Controller, Get, Logger, Post, Query, Put, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Observable } from 'rxjs';
import { CriarCategoriaDto } from 'src/dtos/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';

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
      },

    })
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  criarCateoria(
    @Body() criarCategoriaDto: CriarCategoriaDto) {

      this.clientAdminBackend.emit('criar-categoria', criarCategoriaDto)

    }

    @Get('categorias')
    consultarCategorias(@Query('idCategoria') _id: string): Observable<any> {

      return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '')

    }

    @Put('categorias/:_id')
    @UsePipes(ValidationPipe)    
    atualizarCategoria(
      @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
      @Param('_id') _id: string) {
        this.clientAdminBackend.emit('atualizar-categoria', {
          id: _id,
          categoria: atualizarCategoriaDto
        })

    }       
}
