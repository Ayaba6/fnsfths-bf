import { supabase } from './supabase';

export const testConnection = async () => {
  const { data, error } =
    await supabase.auth.getSession();

  if (error) {
    console.error(error);
  }

  console.log('Connexion Supabase OK');
};