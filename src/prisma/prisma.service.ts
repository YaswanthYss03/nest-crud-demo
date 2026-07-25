import 'dotenv/config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL!;

    // Re-applying the fix: Replace sslmode=require with sslmode=no-verify 
    // so the pg driver accepts Supabase's certificate.
    const pool = new Pool({
      connectionString: connectionString.replace('sslmode=require', 'sslmode=no-verify'),
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
