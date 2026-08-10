import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';

export class ReportsService extends BaseService {
  async getExecutiveSummary() {
    const [totalUsers, totalPatients, totalBrigades, activeBrigades, totalConsultations] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.patient.count({ where: { deletedAt: null } }),
      prisma.brigade.count({ where: { deletedAt: null } }),
      prisma.brigade.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      prisma.consultation.count({ where: { deletedAt: null } }),
    ]);

    return {
      totalUsers,
      totalPatients,
      totalBrigades,
      activeBrigades,
      totalConsultations,
      systemStatus: 'OPERATIONAL',
      updatedAt: new Date().toISOString(),
    };
  }
}

export const reportsService = new ReportsService();