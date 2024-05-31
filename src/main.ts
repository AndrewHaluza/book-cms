import {
  Logger,
  NestApplicationOptions,
  VERSION_NEUTRAL,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './components/app/app.module';
import { CustomHeadersEnum } from './enums/custom-headers.enum';

class AppMain {
  logger = new Logger('Main logger');
  appOptions = <NestApplicationOptions>{};
  app: NestExpressApplication;
  constructor() {
    this.#bootstrap();
  }

  async #bootstrap() {
    await this.#initializeApplicationInstance();

    this.#enableCors();
    this.#useHelmet();
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
      origin: [
        `http://${process.env.APP_SERVER_HOST || 'localhost'}:${process.env.APP_SERVER_PORT || 3000}`,
      ],
      methods: 'GET,HEAD,POST,OPTIONS',
    });
  }

  #useHelmet() {
    this.app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
          directives: {
            imgSrc: [
              `'self'`,
              'data:',
              'apollo-server-landing-page.cdn.apollographql.com',
            ],
            scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
            manifestSrc: [
              `'self'`,
              'apollo-server-landing-page.cdn.apollographql.com',
            ],
            frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
          },
        },
      }),
    );
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
    if (process.env.APP_LOGS === 'true') {
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
