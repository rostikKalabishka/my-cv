import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/user/user.entity';
// import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate({ make, model, year, lng, lat, mileage }) {
    return this.repo
      .createQueryBuilder()
      .select('*')
      .where('make = :make', { make: make })
      .andWhere('model = :model', { model: model })
      .andWhere('lng - :model BETWEEN -5 AND 5', { model: lng })
      .andWhere('lat - :model BETWEEN -5 AND 5', { model: lat })
      .andWhere('year - :model BETWEEN -3 AND 3', { model: year })
      .orderBy('ABS(milage-:milage)', 'DESC')
      .limit(3)
      .setParameters({ mileage })
      .getRawOne();
  }
  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }
  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }
}
