import { createClient } from '@supabase/supabase-js';

// Verificar variables de entorno de manera más robusta
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

// Función helper para validar URL
const isValidUrl = (url: string | undefined): boolean => {
  if (!url || url === '' || url.includes('tu-') || url.includes('aqui')) {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validar que las variables estén configuradas correctamente
const hasValidConfig = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey.length > 0;

// Solo crear el cliente si las variables están disponibles y son válidas
export const supabase = hasValidConfig && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Server client with service role key (for admin operations)
export const supabaseAdmin = hasValidConfig && supabaseUrl && supabaseServiceKey && supabaseServiceKey.length > 0
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Auth helpers
export const getUser = async () => {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
};

// Cliente para operaciones del servidor (con service role key)
export const createServerClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  
  if (!isValidUrl(url) || !serviceKey || serviceKey.length === 0) {
    throw new Error(
      'Missing or invalid Supabase environment variables for server client. ' +
      'Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set correctly.'
    );
  }
  
  // TypeScript ahora sabe que url y serviceKey no son undefined después de la validación
  return createClient(url as string, serviceKey as string, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper para obtener URL pública de imágenes en buckets públicos
export const getPublicImageUrl = (bucketName: string, filePath: string): string | null => {
  if (!supabaseUrl) return null;
  
  // Para buckets públicos, Supabase genera URLs públicas automáticamente
  // Formato: {supabaseUrl}/storage/v1/object/public/{bucketName}/{filePath}
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
};

// Helper para obtener URL pública de imágenes de instalaciones
export const getFacilityImageUrl = (fileName: string): string | null => {
  return getPublicImageUrl('facilities-images', fileName);
};