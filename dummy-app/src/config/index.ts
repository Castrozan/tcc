import dotenv from 'dotenv';
import { Config } from './types.js';

dotenv.config();

const configs: Record<string, Config> = {
    development: {
        port: Number(process.env.PORT) || 3000,
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseKey: process.env.SUPABASE_KEY || ''
    },
    test: {
        port: Number(process.env.PORT) || 3000,
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseKey: process.env.SUPABASE_KEY || ''
    },
    production: {
        port: Number(process.env.PORT) || 3000,
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseKey: process.env.SUPABASE_KEY || ''
    }
};

const environment = process.env.NODE_ENV ?? 'development';
const config: Config = configs[environment] || configs.development;

export default config;
