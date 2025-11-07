export default function AdminTestPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          ✅ Ruta /admin Funcionando
        </h1>
        <p className="text-gray-600 mb-6">
          Si puedes ver esta página, significa que la ruta /admin está funcionando correctamente.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• URL actual: /admin/test</p>
          <p>• No hay redirects activos</p>
          <p>• La configuración está correcta</p>
        </div>
        <a 
          href="/admin" 
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ir al Dashboard Principal
        </a>
      </div>
    </div>
  )
}
