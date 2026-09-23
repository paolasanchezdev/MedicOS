// =========================================================================
// ARCHIVO: apps/api/src/modules/lifestyle/lifestyle.service.ts
// DESCRIPCIÓN: Servicio de negocio con cálculo estricto de datos reales en DB,
//              racha L-D verídica (value > 0) y persistencia en PostgreSQL.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import type {
  LifestyleDashboardSummaryDTO,
  LifestyleHabitType,
  LogHabitDTO,
  RecordActivityDTO,
  CreateGoalDTO,
  LifestyleActivityDTO,
  LifestyleGoalDTO,
  LifestyleHabitSummaryDTO,
} from './lifestyle.types.js';

export class LifestyleService extends BaseService {
  private getWeekCalendar(refDate = new Date()): {
    dayDates: string[];
    startOfWeek: Date;
    endOfWeek: Date;
    todayIndex: number;
  } {
    const now = new Date(refDate);
    const day = now.getDay();
    // Lunes = 0, Martes = 1, ..., Sábado = 5, Domingo = 6
    const distanceToMonday = (day + 6) % 7;

    const start = new Date(now);
    start.setDate(now.getDate() - distanceToMonday);
    start.setHours(0, 0, 0, 0);

    const dayDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dayDates.push(`${yyyy}-${mm}-${dd}`);
    }

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return {
      dayDates,
      startOfWeek: start,
      endOfWeek: end,
      todayIndex: distanceToMonday,
    };
  }

  private formatDbDate(d: Date | string): string {
    if (typeof d === 'string') return d.slice(0, 10);
    return d.toISOString().slice(0, 10);
  }

  async resolvePatientId(patientIdOrUserId: string): Promise<string | null> {
    const db = prisma as any;
    let patient = await db.patient.findFirst({
      where: {
        OR: [{ id: patientIdOrUserId }, { userId: patientIdOrUserId }],
        deletedAt: null,
      },
    });

    if (!patient) {
      const user = await db.user.findUnique({
        where: { id: patientIdOrUserId },
      });

      if (user) {
        patient = await db.patient.findFirst({
          where: {
            deletedAt: null,
            OR: [
              { userId: user.id },
              {
                firstName: { equals: user.firstName, mode: 'insensitive' },
                lastName: { equals: user.lastName, mode: 'insensitive' },
              },
            ],
          },
        });
      }
    }

    return patient ? patient.id : null;
  }

  async getLifestyleSummary(patientIdOrUserId: string): Promise<LifestyleDashboardSummaryDTO> {
    const db = prisma as any;
    const patientId = await this.resolvePatientId(patientIdOrUserId);

    if (!patientId) {
      return {
        activeGoal: null,
        weeklyStats: {
          activeDaysCount: 0,
          totalExerciseMinutes: 0,
          waterDaysLogged: 0,
          waterGlassesToday: 0,
          avgSleepHours: 0,
          sleepHoursToday: 0,
          habitsLoggedTodayCount: 0,
          totalWeeklyLogsCount: 0,
        },
        habits: [],
        recentActivities: [],
      };
    }

    const { dayDates, startOfWeek, endOfWeek, todayIndex } = this.getWeekCalendar();
    const todayStr = dayDates[todayIndex]!;

    // 1. Logs de hábitos de la semana actual
    const habitLogs = await db.lifestyleHabitLog.findMany({
      where: {
        patientId,
        loggedDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    // 2. Actividades de la semana actual
    const activitiesThisWeek = await db.lifestyleActivity.findMany({
      where: {
        patientId,
        performedAt: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
        deletedAt: null,
      },
      orderBy: { performedAt: 'desc' },
    });

    // 3. Actividades recientes (últimas 6)
    const recentActivitiesRaw = await db.lifestyleActivity.findMany({
      where: { patientId, deletedAt: null },
      orderBy: { performedAt: 'desc' },
      take: 6,
    });

    const recentActivities: LifestyleActivityDTO[] = recentActivitiesRaw.map((a: any) => ({
      id: a.id,
      activityName: a.activityName,
      durationMinutes: a.durationMinutes,
      intensity: a.intensity,
      performedAt: a.performedAt,
      notes: a.notes ?? null,
    }));

    // 4. Objetivo semanal activo
    const rawGoal = await db.lifestyleGoal.findFirst({
      where: {
        patientId,
        status: 'IN_PROGRESS',
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    // 5. Cálculos para métricas reales
    const uniqueActiveDates = new Set(
      activitiesThisWeek.map((a: any) => new Date(a.performedAt).toISOString().slice(0, 10))
    );
    const activeDaysCount = uniqueActiveDates.size;
    const totalExerciseMinutes = activitiesThisWeek.reduce(
      (sum: number, a: any) => sum + a.durationMinutes,
      0
    );

    const waterLogs = habitLogs.filter((h: any) => h.habitType === 'WATER' && Number(h.value) > 0);
    const sleepLogs = habitLogs.filter((h: any) => h.habitType === 'SLEEP' && Number(h.value) > 0);

    const todayWaterLog = habitLogs.find(
      (l: any) => l.habitType === 'WATER' && this.formatDbDate(l.loggedDate) === todayStr
    );
    const waterGlassesToday = todayWaterLog ? Math.round(Number(todayWaterLog.value)) : 0;

    const todaySleepLog = habitLogs.find(
      (l: any) => l.habitType === 'SLEEP' && this.formatDbDate(l.loggedDate) === todayStr
    );
    const sleepHoursToday = todaySleepLog ? Number(todaySleepLog.value) : 0;

    const totalSleepHours = sleepLogs.reduce((sum: number, s: any) => sum + Number(s.value), 0);
    const avgSleep = sleepLogs.length > 0 ? Math.round((totalSleepHours / sleepLogs.length) * 10) / 10 : 0;

    let activeGoal: LifestyleGoalDTO | null = null;
    if (rawGoal) {
      const currentDays = rawGoal.habitType === 'ACTIVITY' ? activeDaysCount : waterLogs.length;
      const progress = Math.min(100, Math.round((currentDays / rawGoal.targetDays) * 100));

      activeGoal = {
        id: rawGoal.id,
        title: rawGoal.title,
        habitType: rawGoal.habitType,
        targetDays: rawGoal.targetDays,
        currentDays,
        progressPercentage: progress,
        status: rawGoal.status,
        startDate: rawGoal.startDate,
        endDate: rawGoal.endDate,
      };
    }

    // 6. Mapeo determinista de hábitos semanales
    const habitTypes: LifestyleHabitType[] = [
      'WATER',
      'ACTIVITY',
      'SLEEP',
      'NUTRITION',
      'MINDFULNESS',
      'TOBACCO',
    ];

    let habitsLoggedTodayCount = 0;

    const habits: LifestyleHabitSummaryDTO[] = habitTypes.map((type) => {
      const logsForType = habitLogs.filter((h: any) => h.habitType === type);

      // Un día solo es válido si existe registro con valor > 0
      const daysLogged: boolean[] = dayDates.map((dStr) => {
        if (type === 'ACTIVITY') {
          return uniqueActiveDates.has(dStr);
        }
        return logsForType.some(
          (l: any) => this.formatDbDate(l.loggedDate) === dStr && Number(l.value) > 0
        );
      });

      const todayLog = logsForType.find((l: any) => this.formatDbDate(l.loggedDate) === todayStr);
      const isLoggedToday =
        type === 'ACTIVITY'
          ? uniqueActiveDates.has(todayStr)
          : Boolean(todayLog && Number(todayLog.value) > 0);

      if (isLoggedToday) {
        habitsLoggedTodayCount += 1;
      }

      const todayValue = todayLog ? Number(todayLog.value) : 0;
      const lastUnit = todayLog ? todayLog.unit : logsForType[0]?.unit ?? null;

      return {
        habitType: type,
        daysLoggedThisWeek: daysLogged.filter(Boolean).length,
        targetDaysWeekly: type === 'WATER' || type === 'SLEEP' ? 7 : 4,
        daysLogged,
        todayValue,
        lastUnit,
        isLoggedToday,
      };
    });

    return {
      activeGoal,
      weeklyStats: {
        activeDaysCount,
        totalExerciseMinutes,
        waterDaysLogged: waterLogs.length,
        waterGlassesToday,
        avgSleepHours: avgSleep,
        sleepHoursToday,
        habitsLoggedTodayCount,
        totalWeeklyLogsCount: habitLogs.filter((h: any) => Number(h.value) > 0).length,
      },
      habits,
      recentActivities,
    };
  }

  async logHabit(patientIdOrUserId: string, dto: LogHabitDTO): Promise<void> {
    const db = prisma as any;
    const patientId = await this.resolvePatientId(patientIdOrUserId);
    if (!patientId) throw new Error('Paciente no identificado.');

    const yyyyMmDd = dto.loggedDate
      ? dto.loggedDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    const dateToSave = new Date(`${yyyyMmDd}T00:00:00.000Z`);

    await db.lifestyleHabitLog.upsert({
      where: {
        patientId_habitType_loggedDate: {
          patientId,
          habitType: dto.habitType,
          loggedDate: dateToSave,
        },
      },
      update: {
        value: Number(dto.value),
        unit: dto.unit,
        notes: dto.notes ?? null,
      },
      create: {
        patientId,
        habitType: dto.habitType,
        loggedDate: dateToSave,
        value: Number(dto.value),
        unit: dto.unit,
        notes: dto.notes ?? null,
      },
    });
  }

  async recordActivity(patientIdOrUserId: string, dto: RecordActivityDTO): Promise<LifestyleActivityDTO> {
    const db = prisma as any;
    const patientId = await this.resolvePatientId(patientIdOrUserId);
    if (!patientId) throw new Error('Paciente no identificado.');

    const performedAt = dto.performedAt ? new Date(dto.performedAt) : new Date();

    const created = await db.lifestyleActivity.create({
      data: {
        patientId,
        activityName: dto.activityName,
        durationMinutes: Number(dto.durationMinutes),
        intensity: dto.intensity || 'MODERATE',
        performedAt,
        notes: dto.notes ?? null,
      },
    });

    const yyyyMmDd = performedAt.toISOString().slice(0, 10);
    const dayDate = new Date(`${yyyyMmDd}T00:00:00.000Z`);

    await db.lifestyleHabitLog.upsert({
      where: {
        patientId_habitType_loggedDate: {
          patientId,
          habitType: 'ACTIVITY',
          loggedDate: dayDate,
        },
      },
      update: {
        value: 1,
        unit: 'sesión',
      },
      create: {
        patientId,
        habitType: 'ACTIVITY',
        loggedDate: dayDate,
        value: 1,
        unit: 'sesión',
      },
    });

    return {
      id: created.id,
      activityName: created.activityName,
      durationMinutes: created.durationMinutes,
      intensity: created.intensity,
      performedAt: created.performedAt,
      notes: created.notes ?? null,
    };
  }

  async createGoal(patientIdOrUserId: string, dto: CreateGoalDTO): Promise<LifestyleGoalDTO> {
    const db = prisma as any;
    const patientId = await this.resolvePatientId(patientIdOrUserId);
    if (!patientId) throw new Error('Paciente no identificado.');

    const { startOfWeek, endOfWeek } = this.getWeekCalendar();
    const startDate = dto.startDate ? new Date(dto.startDate) : startOfWeek;
    const endDate = dto.endDate ? new Date(dto.endDate) : endOfWeek;

    await db.lifestyleGoal.updateMany({
      where: { patientId, status: 'IN_PROGRESS' },
      data: { status: 'COMPLETED' },
    });

    const created = await db.lifestyleGoal.create({
      data: {
        patientId,
        title: dto.title,
        habitType: dto.habitType || 'ACTIVITY',
        targetDays: Number(dto.targetDays),
        startDate,
        endDate,
        status: 'IN_PROGRESS',
      },
    });

    return {
      id: created.id,
      title: created.title,
      habitType: created.habitType,
      targetDays: created.targetDays,
      currentDays: 0,
      progressPercentage: 0,
      status: created.status,
      startDate: created.startDate,
      endDate: created.endDate,
    };
  }
}

export const lifestyleService = new LifestyleService();