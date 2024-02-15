import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { ReportsService } from './reports/reports.service';
import { ReportsModule } from './reports/reports.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ReportsModule, UserModule],
  controllers: [AppController],
  providers: [AppService, UserService, ReportsService],
})
export class AppModule {}
