import {
  Logger,
  ValidationPipe,
  NestApplicationOptions,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AllExceptionsFilter } from './components/app/filters/allExceptions.filter';
import { AppModule } from './components/app/app.module';
import { CustomHeadersEnum } from './enums/custom-headers.enum';
import { HttpExceptionFilter } from './components/app/filters/http-exception.filter';

// import * as helmet from 'helmet';

class AppMain {
  logger = new Logger('General logger');
  appOptions = <NestApplicationOptions>{};
  app: NestExpressApplication;
  constructor() {
    this.#bootstrap();
  }

  async #bootstrap() {
    await this.#initializeApplicationInstance();

    this.#enableCors();
    this.#useGlobalPipes();
    this.#useGlobalFilters();
    this.#enableVersioning();
    this.#initializeLogger();
    this.#initializeSwagger();

    await this.#listen();
  }

  async #initializeApplicationInstance() {
    this.app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      this.appOptions,
    );
  }

  #enableCors() {
    this.app.enableCors({
      origin: ['http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });
  }

  #useGlobalPipes() {
    this.app.useGlobalPipes(
      new ValidationPipe({
        // forbidUnknownValues: true,
        transform: true,
      }),
    );
  }

  #useGlobalFilters() {
    // TODO figure it out why this is not working
    // this.app.useGlobalFilters(new HttpExceptionFilter());
    // const httpAdapterHost = this.app.get(HttpAdapterHost);
    // this.app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  }

  #enableVersioning() {
    this.app.enableVersioning({
      type: VersioningType.HEADER,
      header: CustomHeadersEnum.apiVersion,
      defaultVersion: VERSION_NEUTRAL,
    });
  }

  #initializeLogger() {
    if (process.env.LOGS === 'true') {
      this.app.use((req, res, next) => {
        this.logger.debug(`[${req.method}] ${req.originalUrl}`);
        next();
      });
    }
  }

  #initializeSwagger() {
    if (
      !process.env.FEATURE_SWAGGER_ENABLED ||
      process.env.FEATURE_SWAGGER_ENABLED === 'true'
    ) {
      const config = new DocumentBuilder()
        .setTitle('Book CMS API')
        .setDescription('The book CMS API description')
        .setVersion('1.0')
        .build();
      const document = SwaggerModule.createDocument(this.app, config);

      SwaggerModule.setup('api', this.app, document);
    }
  }

  async #listen() {
    const configService = this.app.get(ConfigService);
    const port = configService.get('APP_SERVER_PORT');
    await this.app.listen(port, () =>
      this.logger.verbose(`The server is running on ${port} port`),
    );
  }
}

new AppMain();
