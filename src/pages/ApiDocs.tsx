
import React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
        <Alert className="bg-geeky-cyan/10 border-geeky-cyan">
          <AlertCircle className="h-4 w-4 text-geeky-cyan" />
          <AlertTitle className="text-geeky-cyan">Acceso a API Pública</AlertTitle>
          <AlertDescription>
            Esta API está disponible públicamente y puede ser accedida directamente desde cualquier cliente HTTP como Postman, 
            curl o un navegador web. No requiere autenticación para operaciones de lectura.
          </AlertDescription>
        </Alert>
        
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
          <div className="mt-2 text-white/70 text-sm">
            Esta URL base funciona desde cualquier cliente HTTP. No es necesario ejecutar localmente la aplicación.
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
                <div className="mb-2 font-mono text-geeky-purple text-xs">curl {baseUrl}/api/mensaje_bienvenida</div>
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
                <div className="mb-2 font-mono text-geeky-purple text-xs">
                  {`curl -X PUT ${baseUrl}/api/mensaje_bienvenida -H "Content-Type: application/json" -d '{"content": "Nuevo mensaje de bienvenida"}'`}
                </div>
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
                <div className="mb-2 font-mono text-geeky-purple text-xs">curl {baseUrl}/api/anuncios/activos</div>
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
                <div className="mb-2 font-mono text-geeky-purple text-xs">
                  {`curl -X POST ${baseUrl}/api/anuncios -H "Content-Type: application/json" -d '{"titulo":"Nuevo anuncio",...}'`}
                </div>
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
                <div className="mb-2 font-mono text-geeky-purple text-xs">
                  {`curl -X PUT ${baseUrl}/api/anuncios/1 -H "Content-Type: application/json" -d '{"titulo":"Anuncio actualizado",...}'`}
                </div>
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
                <div className="mb-2 font-mono text-geeky-purple text-xs">
                  curl -X DELETE {baseUrl}/api/anuncios/1
                </div>
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
            Para probar esta API en Postman:
          </p>
          <ol className="list-decimal pl-6 text-white/80 space-y-2">
            <li>Abre Postman y crea una nueva colección llamada "GeekyBot API"</li>
            <li>Configura la URL base como variable de colección: <code className="bg-black/30 px-2 py-1 rounded">{baseUrl}/api</code></li>
            <li>Crea solicitudes para los diferentes endpoints usando la URL base</li>
            <li>Para solicitudes POST y PUT, incluye el header <code className="bg-black/30 px-2 py-1 rounded">Content-Type: application/json</code></li>
            <li>La API responderá con JSON sin importar desde dónde la llames</li>
          </ol>
          <div className="flex items-center gap-4 bg-black/30 p-4 rounded mt-4">
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
      </div>
    </div>
  );
};

export default ApiDocs;
