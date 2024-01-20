import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hpbqcsdnelanzpwzvxsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwYnFjc2RuZWxhbnpwd3p2eHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU1Nzg0ODUsImV4cCI6MjAyMTE1NDQ4NX0.cRBBa4mDcbNp5y3jOiQY-FZ7Ayy2MEHKlkUcNEIBedQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
