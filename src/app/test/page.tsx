export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          ¡Tailwind CSS está funcionando!
        </h1>
        <p className="text-gray-700">
          Si puedes ver este texto con estilos, Tailwind está funcionando correctamente.
        </p>
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          ✅ CSS cargado correctamente
        </div>
      </div>
    </div>
  )
}
