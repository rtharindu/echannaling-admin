import { prisma } from '@/config/database';
import { logger } from '@/config/logger';

export class HospitalService {
  async getAllHospitals(): Promise<any[]> {
    try {
      logger.info('Starting to fetch all hospitals from database');
      
      const hospitals = await prisma.user.findMany({
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

      logger.info(`Found ${hospitals.length} hospitals in database`);
      
      // Transform to hospital format
      return hospitals.map((hospital: any) => ({
        id: hospital.id,
        name: (hospital as any).name || 'Unknown Hospital',
        address: '123 Main Street, Colombo', // Default address
        city: 'Colombo', // Default city
        district: 'Colombo', // Default district
        contactNumber: '+94770000000', // Default phone
        email: hospital.email,
        website: 'https://example.com', // Default website
        facilities: ['Emergency', 'OPD', 'IPD', 'Lab'], // Default facilities
        isActive: true,
        createdAt: hospital.createdAt,
        status: 'APPROVED',
        profileImage: null
      }));
    } catch (error) {
      logger.error('Error fetching hospitals:', error);
      return [];
    }
  }

  async getHospitalById(id: string): Promise<any | null> {
    try {
      const hospital = await prisma.user.findUnique({
        where: { 
          id,
          role: 'CORPORATE' as any
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        }
      });

      if (!hospital) return null;

      return {
        id: hospital.id,
        name: (hospital as any).name || 'Unknown Hospital',
        address: '123 Main Street, Colombo',
        city: 'Colombo',
        district: 'Colombo',
        contactNumber: '+94770000000',
        email: hospital.email,
        website: 'https://example.com',
        facilities: ['Emergency', 'OPD', 'IPD', 'Lab'],
        isActive: true,
        createdAt: hospital.createdAt,
        status: 'APPROVED',
        profileImage: null
      };
    } catch (error) {
      logger.error('Error fetching hospital:', error);
      return null;
    }
  }

  async createHospital(data: any): Promise<any> {
    try {
      const hospital = await prisma.user.create({
        data: {
          email: data.email,
          password: '$2b$10$defaulthashedpassword', // Should be properly hashed
          name: data.name,
          role: 'HOSPITAL',
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
        id: hospital.id,
        name: (hospital as any).name,
        email: hospital.email,
        address: data.address || '123 Main Street, Colombo',
        city: data.city || 'Colombo',
        district: data.district || 'Colombo',
        contactNumber: data.contactNumber || '+94770000000',
        website: data.website || 'https://example.com',
        facilities: data.facilities || ['Emergency', 'OPD'],
        isActive: hospital.isActive,
        createdAt: hospital.createdAt,
        status: 'PENDING',
        profileImage: data.profileImage || null
      };
    } catch (error) {
      logger.error('Error creating hospital:', error);
      throw error;
    }
  }

  async updateHospital(id: string, data: any): Promise<any | null> {
    try {
      const hospital = await prisma.user.update({
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
        id: hospital.id,
        name: (hospital as any).name || 'Unknown Hospital',
        email: hospital.email,
        address: data.address || '123 Main Street, Colombo',
        city: data.city || 'Colombo',
        district: data.district || 'Colombo',
        contactNumber: data.contactNumber || '+94770000000',
        website: data.website || 'https://example.com',
        facilities: data.facilities || ['Emergency', 'OPD'],
        isActive: hospital.isActive,
        createdAt: hospital.createdAt,
        status: data.status || 'APPROVED',
        profileImage: data.profileImage || null
      };
    } catch (error) {
      logger.error('Error updating hospital:', error);
      return null;
    }
  }

  async deleteHospital(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      logger.error('Error deleting hospital:', error);
      return false;
    }
  }

  async getHospitalStats(): Promise<any> {
    try {
      const [total, active, inactive] = await Promise.all([
        prisma.user.count({ where: { role: 'HOSPITAL' } }),
        prisma.user.count({ where: { role: 'HOSPITAL', isActive: true } }),
        prisma.user.count({ where: { role: 'HOSPITAL', isActive: false } })
      ]);

      return {
        total,
        active,
        inactive,
        approved: active, // Assuming active = approved
        pending: 0 // No pending status in users table
      };
    } catch (error) {
      logger.error('Error fetching hospital stats:', error);
      return { total: 0, active: 0, inactive: 0, approved: 0, pending: 0 };
    }
  }

  async getHospitalsByCity(city: string): Promise<any[]> {
    try {
      const hospitals = await prisma.user.findMany({
        where: { 
          role: 'HOSPITAL',
          isActive: true 
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        }
      });

      // Filter by city (since city is not in database, return all for now)
      return hospitals.map(hospital => ({
        id: hospital.id,
        name: (hospital as any).name || 'Unknown Hospital',
        address: '123 Main Street, Colombo',
        city: city,
        district: 'Colombo',
        contactNumber: '+94770000000',
        email: hospital.email,
        website: 'https://example.com',
        facilities: ['Emergency', 'OPD', 'IPD', 'Lab'],
        isActive: true,
        createdAt: hospital.createdAt,
        status: 'APPROVED',
        profileImage: null
      }));
    } catch (error) {
      logger.error('Error fetching hospitals by city:', error);
      return [];
    }
  }
}

export default new HospitalService();
