import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  /*access configuration values from our ConfigService the we can inject it using standard 
    constructor injection.
    */
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return this.configService.get('database');
    //The get() method can also traverse a nested custom configuration object
  }
}
