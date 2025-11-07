export default function TestEnvPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Verificación de Variables de Entorno
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Estado de las Variables</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
              <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ No configurado'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded">
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ No configurado'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 border rounded">
              <span className="font-medium">SUPABASE_SERVICE_ROLE_KEY:</span>
              <span className={process.env.SUPABASE_SERVICE_ROLE_KEY ? 'text-green-600' : 'text-red-600'}>
                {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurado' : '❌ No configurado'}
              </span>
            </div>
          </div>

          {process.env.NEXT_PUBLIC_SUPABASE_URL && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-semibold text-blue-800 mb-2">URL de Supabase:</h3>
              <p className="text-blue-700 text-sm break-all">
                {process.env.NEXT_PUBLIC_SUPABASE_URL}
              </p>
            </div>
          )}

          {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-semibold text-green-800 mb-2">Anon Key (primeros 50 caracteres):</h3>
              <p className="text-green-700 text-sm break-all">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 50)}...
              </p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <a
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  )
}
