/*
DTO (Data Transfer Object) schema. 
A DTO is an object that defines how the data will be sent over the network. 
Better to define these using classes with Typescript.
*/
export class RequestMeta {
  actor: string;
  email: string;
  originalUrl: string;
  method: string;
  userAgent: string;
  host: string;
  clientIp: string;
  requestId: string;
  userId: string;
  sessionId: string;
  role: string;
  startTime: number;
}
