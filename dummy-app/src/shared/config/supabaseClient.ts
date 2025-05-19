import { createClient } from '@supabase/supabase-js';
import config from '../../config/index.js';

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

export default supabase;
