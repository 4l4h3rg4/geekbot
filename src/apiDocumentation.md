
# Documentación de la API REST de GeekyBot

Esta documentación te permitirá probar la API REST interna del proyecto utilizando Postman.

## Base URL

```
http://localhost:8080/api
```

## Endpoints

### Mensaje de Bienvenida

#### Obtener mensaje de bienvenida
- **URL**: `/mensaje_bienvenida`
- **Método**: `GET`
- **Respuesta exitosa**: 
```json
{
  "id": 1,
  "contenido": "¡Saludos, viajero del multiverso geek! Soy GeekyBot...",
  "fecha_actualizacion": "2025-04-28T15:08:44.000408+00:00"
}
```

#### Actualizar mensaje de bienvenida
- **URL**: `/mensaje_bienvenida`
- **Método**: `PUT`
- **Body**:
```json
{
  "content": "Nuevo mensaje de bienvenida"
}
```
- **Respuesta exitosa**:
```json
{
  "id": 1,
  "contenido": "Nuevo mensaje de bienvenida",
  "fecha_actualizacion": "2025-04-28T15:30:00.000000+00:00"
}
```

### Anuncios

#### Obtener anuncios activos
- **URL**: `/anuncios/activos`
- **Método**: `GET`
- **Respuesta exitosa**:
```json
[
  {
    "id": 1,
    "titulo": "GeekyBot Plus",
    "descripcion": "Desbloquea acceso ilimitado a GeekyBot con una suscripción premium",
    "url_destino": "https://www.paypal.com/ncp/payment/ZZBBENPTUT26N",
    "imagen_portada": "",
    "fecha_inicio": "2025-04-28T15:08:44.000408+00:00",
    "fecha_fin": "2026-04-28T15:08:44.000408+00:00",
    "activo": true
  }
]
```

#### Crear un nuevo anuncio
- **URL**: `/anuncios`
- **Método**: `POST`
- **Body**:
```json
{
  "titulo": "Nuevo anuncio",
  "descripcion": "Descripción del anuncio",
  "url_destino": "https://ejemplo.com",
  "imagen_portada": "",
  "fecha_inicio": "2025-04-28T15:00:00.000000+00:00",
  "fecha_fin": "2026-04-28T15:00:00.000000+00:00",
  "activo": true
}
```
- **Respuesta exitosa**:
```json
{
  "id": 2,
  "titulo": "Nuevo anuncio",
  "descripcion": "Descripción del anuncio",
  "url_destino": "https://ejemplo.com",
  "imagen_portada": "",
  "fecha_inicio": "2025-04-28T15:00:00.000000+00:00",
  "fecha_fin": "2026-04-28T15:00:00.000000+00:00",
  "activo": true
}
```

#### Actualizar un anuncio existente
- **URL**: `/anuncios/{id}`
- **Método**: `PUT`
- **Body**:
```json
{
  "titulo": "Anuncio actualizado",
  "descripcion": "Nueva descripción",
  "activo": false
}
```
- **Respuesta exitosa**:
```json
{
  "id": 1,
  "titulo": "Anuncio actualizado",
  "descripcion": "Nueva descripción",
  "url_destino": "https://www.paypal.com/ncp/payment/ZZBBENPTUT26N",
  "imagen_portada": "",
  "fecha_inicio": "2025-04-28T15:08:44.000408+00:00",
  "fecha_fin": "2026-04-28T15:08:44.000408+00:00",
  "activo": false
}
```

#### Eliminar un anuncio
- **URL**: `/anuncios/{id}`
- **Método**: `DELETE`
- **Respuesta exitosa**:
```json
{
  "success": true
}
```

## Probar la API en Postman

1. Abre Postman
2. Crea una nueva colección llamada "GeekyBot API"
3. Añade las solicitudes descritas anteriormente
4. Para cada solicitud, utiliza la URL base y el endpoint correspondiente
5. Para las solicitudes POST y PUT, configura el header `Content-Type: application/json`
6. Asegúrate de que la aplicación esté ejecutándose en localhost:8080

### Importante
Esta API es interna y se intercepta a nivel del navegador mediante un interceptor de fetch. Para probarla desde Postman, asegúrate de que la aplicación esté en ejecución, ya que las solicitudes se procesan a través del interceptor configurado en `apiHandlers.ts`.
