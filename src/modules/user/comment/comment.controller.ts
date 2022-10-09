import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { TransformHeadersInterceptor } from '../../../interceptors/transform.interceptor';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { CommentService } from './comment.service';

@Controller('comment')
@ApiSecurity('BearerAuthorization')
@ApiTags('friendRequest')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TransformHeadersInterceptor)
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}
}
