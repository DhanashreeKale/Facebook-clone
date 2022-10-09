/*DTO (Data Transfer Object) schema. 
A DTO is an object that defines how the data will be sent over the network. 
Better to define these using classes with Typescript.

 In order to make the class properties visible to the SwaggerModule, 
 we annotate them with the @ApiProperty() decorator. 
*/
import { ApiProperty } from '@nestjs/swagger';

export class Metadata {
  @ApiProperty()
  startTime: number;

  @ApiProperty()
  endTime: number;

  @ApiProperty()
  apiProcessingTime: any;
}
