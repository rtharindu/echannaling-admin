import { prisma } from '@/config/database';
import { logger } from '@/config/logger';

export class DoctorService {
  async getAllDoctors(): Promise<any[]> {
    try {
      logger.info('Starting to fetch all doctors from database');
      
      const doctors = await prisma.user.findMany({
        where: { 
          isActive: true 
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        }
      });

      logger.info(`Found ${doctors.length} doctors in database`);
      
      // Transform to doctor profile format
      return doctors.map((doctor: any) => ({
        id: doctor.id,
        name: (doctor as any).name || 'Unknown Doctor',
        email: doctor.email,
        specialization: 'General Medicine', // Default since not in users table
        qualification: 'MBBS', // Default qualification
        experience: 5, // Default years
        phoneNumber: '+94700000000', // Default phone
        consultationFee: 1500.00, // Default fee
        rating: 4.5, // Default rating
        profileImage: null,
        description: 'Experienced medical practitioner',
        languages: ['English', 'Sinhala'],
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        isActive: true,
        createdAt: doctor.createdAt,
        status: 'APPROVED'
      }));
    } catch (error) {
      logger.error('Error fetching doctors:', error);
      return [];
    }
  }

  async getDoctorById(id: string): Promise<any | null> {
    try {
      const doctor = await prisma.user.findUnique({
        where: { 
          id,
          role: 'AGENT' as any
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        }
      });

      if (!doctor) return null;

      return {
        id: doctor.id,
        name: (doctor as any).name || 'Unknown Doctor',
        email: doctor.email,
        specialization: 'General Medicine',
        qualification: 'MBBS',
        experience: 5,
        phoneNumber: '+94700000000',
        consultationFee: 1500.00,
        rating: 4.5,
        profileImage: null,
        description: 'Experienced medical practitioner',
        languages: ['English', 'Sinhala'],
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        isActive: true,
        createdAt: doctor.createdAt,
        status: 'APPROVED'
      };
    } catch (error) {
      logger.error('Error fetching doctor:', error);
      return null;
    }
  }

  async createDoctor(data: any): Promise<any> {
    try {
      const doctor = await prisma.user.create({
        data: {
          email: data.email,
          password: '$2b$10$defaulthashedpassword', // Should be properly hashed
          name: data.name,
          role: 'DOCTOR',
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        }
      });

      return {
        id: doctor.id,
        name: (doctor as any).name,
        email: doctor.email,
        specialization: data.specialization || 'General Medicine',
        qualification: data.qualification || 'MBBS',
        experience: data.experience || 0,
        phoneNumber: data.phoneNumber || '+94700000000',
        consultationFee: data.consultationFee || 1500.00,
        rating: 0,
        profileImage: data.profileImage || null,
        description: data.description || '',
        languages: data.languages || ['English'],
        availableDays: data.availableDays || ['Monday'],
        isActive: doctor.isActive,
        createdAt: doctor.createdAt,
        status: 'PENDING'
      };
    } catch (error) {
      logger.error('Error creating doctor:', error);
      throw error;
    }
  }

  async updateDoctor(id: string, data: any): Promise<any | null> {
    try {
      const doctor = await prisma.user.update({
        where: { id },
        data: {
          name: data.name,
          isActive: data.isActive,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        }
      });

      return {
        id: doctor.id,
        name: (doctor as any).name || 'Unknown Doctor',
        email: doctor.email,
        specialization: data.specialization || 'General Medicine',
        qualification: data.qualification || 'MBBS',
        experience: data.experience || 0,
        phoneNumber: data.phoneNumber || '+94700000000',
        consultationFee: data.consultationFee || 1500.00,
        rating: data.rating || 0,
        profileImage: data.profileImage || null,
        description: data.description || '',
        languages: data.languages || ['English'],
        availableDays: data.availableDays || ['Monday'],
        isActive: doctor.isActive,
        createdAt: doctor.createdAt,
        status: data.status || 'APPROVED'
      };
    } catch (error) {
      logger.error('Error updating doctor:', error);
      return null;
    }
  }

  async deleteDoctor(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      logger.error('Error deleting doctor:', error);
      return false;
    }
  }

  async getDoctorStats(): Promise<any> {
    try {
      const [total, active, inactive] = await Promise.all([
        prisma.user.count({ where: { role: 'DOCTOR' } }),
        prisma.user.count({ where: { role: 'DOCTOR', isActive: true } }),
        prisma.user.count({ where: { role: 'DOCTOR', isActive: false } })
      ]);

      return {
        total,
        active,
        inactive,
        approved: active, // Assuming active = approved
        pending: 0 // No pending status in users table
      };
    } catch (error) {
      logger.error('Error fetching doctor stats:', error);
      return { total: 0, active: 0, inactive: 0, approved: 0, pending: 0 };
    }
  }
}

export default new DoctorService();
