
import React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ApiDocs = () => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Obtener la URL base dinámica
    const url = window.location.origin;
    setBaseUrl(url);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-pixel text-geeky-cyan mb-8">Documentación de la API</h1>
      
      <div className="bg-geeky-dark/80 p-6 rounded-lg border border-geeky-purple/30 space-y-8">
        <section>
          <h2 className="text-xl font-pixel text-geeky-purple mb-4">Base URL</h2>
          <div className="flex items-center gap-4 bg-black/30 p-4 rounded">
            <code className="font-mono text-white flex-1">{baseUrl}/api</code>
            <Button 
              variant="outline"
              onClick={() => copyToClipboard(`${baseUrl}/api`)}
              className="text-xs"
            >
              Copiar
            </Button>
          </div>
        </section>

        <Tabs defaultValue="welcome">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="welcome">Mensaje de Bienvenida</TabsTrigger>
            <TabsTrigger value="ads">Anuncios</TabsTrigger>
          </TabsList>

          <TabsContent value="welcome" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-pixel text-geeky-cyan">GET /mensaje_bienvenida</h3>
              <p className="text-white/80">Obtiene el mensaje de bienvenida actual</p>
              <div className="bg-black/30 p-4 rounded">
                <pre className="text-white text-sm">
{`// Respuesta
{
  "id": 1,
  "contenido": "¡Saludos, viajero del multiverso geek!",
  "fecha_actualizacion": "2025-04-28T15:08:44.000408+00:00"
}`}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-pixel text-geeky-cyan">PUT /mensaje_bienvenida</h3>
              <p className="text-white/80">Actualiza el mensaje de bienvenida</p>
              <div className="bg-black/30 p-4 rounded">
                <pre className="text-white text-sm">
{`// Body
{
  "content": "Nuevo mensaje de bienvenida"
}

// Respuesta
{
  "id": 1,
  "contenido": "Nuevo mensaje de bienvenida",
  "fecha_actualizacion": "2025-04-28T15:30:00.000000+00:00"
}`}
                </pre>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ads" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-pixel text-geeky-cyan">GET /anuncios/activos</h3>
              <p className="text-white/80">Obtiene la lista de anuncios activos</p>
              <div className="bg-black/30 p-4 rounded">
                <pre className="text-white text-sm">
{`// Respuesta
[
  {
    "id": 1,
    "titulo": "GeekyBot Plus",
    "descripcion": "Desbloquea acceso ilimitado",
    "url_destino": "https://ejemplo.com",
    "imagen_portada": "https://ejemplo.com/imagen.jpg",
    "fecha_inicio": "2025-04-28T15:08:44.000408+00:00",
    "fecha_fin": "2026-04-28T15:08:44.000408+00:00",
    "activo": true
  }
]`}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-pixel text-geeky-cyan">POST /anuncios</h3>
              <p className="text-white/80">Crea un nuevo anuncio</p>
              <div className="bg-black/30 p-4 rounded">
                <pre className="text-white text-sm">
{`// Body
{
  "titulo": "Nuevo anuncio",
  "descripcion": "Descripción del anuncio",
  "url_destino": "https://ejemplo.com",
  "imagen_portada": "https://ejemplo.com/imagen.jpg",
  "fecha_inicio": "2025-04-28T15:00:00.000Z",
  "fecha_fin": "2026-04-28T15:00:00.000Z",
  "activo": true
}`}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-pixel text-geeky-cyan">PUT /anuncios/{'{id}'}</h3>
              <p className="text-white/80">Actualiza un anuncio existente</p>
              <div className="bg-black/30 p-4 rounded">
                <pre className="text-white text-sm">
{`// Body
{
  "titulo": "Anuncio actualizado",
  "descripcion": "Nueva descripción",
  "activo": false
}`}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-pixel text-geeky-cyan">DELETE /anuncios/{'{id}'}</h3>
              <p className="text-white/80">Elimina un anuncio</p>
              <div className="bg-black/30 p-4 rounded">
                <pre className="text-white text-sm">
{`// Respuesta
{
  "success": true
}`}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <section className="space-y-4">
          <h2 className="text-xl font-pixel text-geeky-purple">Probar en Postman</h2>
          <p className="text-white/80">
            Para probar esta API puedes usar Postman u otra herramienta similar. La API está disponible públicamente en:
          </p>
          <div className="flex items-center gap-4 bg-black/30 p-4 rounded">
            <code className="font-mono text-white flex-1">{baseUrl}/api</code>
            <Button 
              variant="outline"
              onClick={() => copyToClipboard(`${baseUrl}/api`)}
              className="text-xs"
            >
              Copiar
            </Button>
          </div>
          <p className="text-white/80">
            Recuerda incluir el header 'Content-Type: application/json' cuando envíes datos en el body de tus peticiones.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ApiDocs;
