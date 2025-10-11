# 📡 Documentación de API - Ranked Vote

API RESTful para el sistema de votación comunitaria Ranked Vote.

**Base URL:** `http://localhost:5001/api` (desarrollo)  
**Producción:** URL pendiente

---

## 📋 Índice

- [Autenticación](#autenticación)
- [Endpoints](#endpoints)
  - [Events](#events)
  - [Candidates](#candidates)
  - [Votes](#votes)
  - [Results](#results)
- [Modelos de Datos](#modelos-de-datos)
- [Códigos de Error](#códigos-de-error)

---

## 🔐 Autenticación

Actualmente la API es pública para endpoints de lectura. Los endpoints de escritura (POST, PUT, DELETE) requerirán autenticación en futuras versiones.

---

## 🌐 Endpoints

### Events

#### GET /api/events

Obtiene todos los eventos.

**Query Parameters:**
- `active` (boolean, opcional): Filtrar por eventos activos
- `year` (number, opcional): Filtrar por año

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx123",
      "name": "Flor de Tabasco 2026",
      "description": "Certamen anual...",
      "year": 2026,
      "startDate": "2026-04-01T00:00:00.000Z",
      "endDate": "2026-04-30T23:59:59.999Z",
      "votingStart": "2026-04-01T00:00:00.000Z",
      "votingEnd": "2026-04-25T23:59:59.999Z",
      "active": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

#### GET /api/events/:id

Obtiene un evento específico por ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx123",
    "name": "Flor de Tabasco 2026",
    "description": "Certamen anual...",
    "year": 2026,
    "startDate": "2026-04-01T00:00:00.000Z",
    "endDate": "2026-04-30T23:59:59.999Z",
    "votingStart": "2026-04-01T00:00:00.000Z",
    "votingEnd": "2026-04-25T23:59:59.999Z",
    "active": true,
    "candidates": [...],
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

#### GET /api/events/:id/stats

Obtiene estadisticas del evento (total votos, votos por hora, top 5 candidatos)

```json
{
  {
    "success": true,
    "data": {
        "totalVotes": 1,
        "votesByHour": {
            "19": 1
        },
        "topCandidates": [
            {
                "id": "cmgk7w7hv0002ac4jbhux8m2j",
                "name": "Embajadora Centro",
                "municipality": "Centro",
                "photoUrl": null,
                "bio": "Representante del municipio de Centro",
                "points": 5
            },
            ...
        ]
    }
  }
}
```
---

### Candidates

#### GET /api/candidates

Obtiene todas las candidatas.

**Query Parameters:**
- `eventId` (string, requerido): ID del evento
- `active` (boolean, opcional): Filtrar por candidatas activas
- `municipality` (string, opcional): Filtrar por municipio

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxx456",
      "eventId": "clxxx123",
      "name": "María García",
      "municipality": "Centro",
      "age": 22,
      "photoUrl": "https://...",
      "bio": "Representante del municipio...",
      "orderNumber": 1,
      "active": true,
      "createdAt": "2026-01-15T00:00:00.000Z",
      "updatedAt": "2026-01-15T00:00:00.000Z"
    }
  ],
  "count": 17
}
```

---

#### GET /api/candidates/:id

Obtiene una candidata específica por ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clxxx456",
    "eventId": "clxxx123",
    "name": "María García",
    "municipality": "Centro",
    "age": 22,
    "photoUrl": "https://...",
    "bio": "Representante del municipio...",
    "orderNumber": 1,
    "active": true,
    "createdAt": "2026-01-15T00:00:00.000Z",
    "updatedAt": "2026-01-15T00:00:00.000Z"
  }
}
```

---

### Votes

#### POST /api/votes

Crea un nuevo voto.

**Request Body:**
```json
{
  "eventId": "clxxx123",
  "voterEmail": "opcional@example.com",
  "voterName": "Juan Pérez",
  "firstPlaceId": "clxxx456",
  "secondPlaceId": "clxxx457",
  "thirdPlaceId": "clxxx458",
  "fourthPlaceId": "clxxx459",
  "fifthPlaceId": "clxxx460"
}
```

**Validaciones:**
- Todas las posiciones deben ser diferentes
- Las candidatas deben pertenecer al evento
- Un IP solo puede votar una vez por evento
- Las candidatas deben estar activas

**Response (Success):**
```json
{
  "success": true,
  "message": "Voto registrado exitosamente",
  "data": {
    "id": "clxxx789",
    "eventId": "clxxx123",
    "voterIp": "192.168.1.1",
    "voterEmail": "opcional@example.com",
    "voterName": "Juan Pérez",
    "createdAt": "2026-10-06T19:30:00.000Z"
  }
}
```

**Response (Error - Ya votó):**
```json
{
  "success": false,
  "message": "Ya has votado en este evento",
  "code": "DUPLICATE_VOTE"
}
```

---

#### GET /api/votes

Obtiene votos (solo para admin).

**Query Parameters:**
- `eventId` (string, opcional): Filtrar por evento
- `page` (number, opcional): Número de página (default: 1)
- `limit` (number, opcional): Resultados por página (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

#### GET /api/votes/check

Verifica si un usuario ya votó.

**Query Parameters:**
- `eventId` (string, requerido): ID del evento

**Response:**
```json
{
  "success": true,
  "hasVoted": true,
  "voteDate": "2026-10-06T19:30:00.000Z"
}
```

---

### Results

#### GET /api/results

Obtiene los resultados agregados de un evento.

**Query Parameters:**
- `eventId` (string, requerido): ID del evento

**Response:**
```json
{
  "success": true,
  "data": {
    "eventId": "clxxx123",
    "totalVotes": 1247,
    "results": {
      "firstPlace": [
        {
          "candidateId": "clxxx456",
          "candidate": {
            "name": "María García",
            "municipality": "Centro",
            "photoUrl": "https://..."
          },
          "votes": 287,
          "percentage": 23.02
        }
      ],
      "secondPlace": [...],
      "thirdPlace": [...],
      "fourthPlace": [...],
      "fifthPlace": [...]
    },
    "topCandidates": [
      {
        "candidateId": "clxxx456",
        "candidate": {
          "name": "María García",
          "municipality": "Centro"
        },
        "totalPoints": 1523,
        "breakdown": {
          "first": 287,
          "second": 198,
          "third": 143,
          "fourth": 89,
          "fifth": 76
        }
      }
    ],
    "lastUpdated": "2026-10-06T20:00:00.000Z"
  }
}
```

---

#### GET /api/results/trends

Obtiene tendencias de votación en tiempo real.

**Query Parameters:**
- `eventId` (string, requerido): ID del evento
- `interval` (string, opcional): 'hour', 'day', 'week' (default: 'day')

**Response:**
```json
{
  "success": true,
  "data": {
    "eventId": "clxxx123",
    "interval": "day",
    "trends": [
      {
        "date": "2026-10-01",
        "votes": 43,
        "cumulative": 43
      },
      {
        "date": "2026-10-02",
        "votes": 87,
        "cumulative": 130
      }
    ]
  }
}
```

---

## 📊 Modelos de Datos

### Event
```typescript
{
  id: string
  name: string
  description: string | null
  year: number
  startDate: Date
  endDate: Date
  votingStart: Date
  votingEnd: Date
  active: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Candidate
```typescript
{
  id: string
  eventId: string
  name: string
  municipality: string
  age: number | null
  photoUrl: string | null
  bio: string | null
  orderNumber: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Vote
```typescript
{
  id: string
  eventId: string
  voterIp: string
  voterEmail: string | null
  voterName: string | null
  firstPlaceId: string
  secondPlaceId: string
  thirdPlaceId: string
  fourthPlaceId: string
  fifthPlaceId: string
  createdAt: Date
  updatedAt: Date
}
```

---

## ❌ Códigos de Error

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| 400 | Bad Request | Request inválido o datos faltantes |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Ya existe un recurso (ej: voto duplicado) |
| 422 | Unprocessable Entity | Error de validación |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Error del servidor |

### Formato de Error

```json
{
  "success": false,
  "message": "Descripción del error",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "firstPlaceId",
      "message": "Primera posición es requerida"
    }
  ]
}
```

---

## 🔒 Rate Limiting

- **Límite general:** 100 requests por 15 minutos por IP
- **Endpoint de votación:** 5 requests por hora por IP
- **Headers de respuesta:**
  - `X-RateLimit-Limit`: Límite total
  - `X-RateLimit-Remaining`: Requests restantes
  - `X-RateLimit-Reset`: Timestamp de reset

---

## 🧪 Ejemplos de Uso

### JavaScript (Fetch)

```javascript
// Obtener candidatas
const response = await fetch('http://localhost:5001/api/candidates?eventId=clxxx123')
const data = await response.json()

// Votar
const voteResponse = await fetch('http://localhost:5001/api/votes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    eventId: 'clxxx123',
    firstPlaceId: 'clxxx456',
    secondPlaceId: 'clxxx457',
    thirdPlaceId: 'clxxx458',
    fourthPlaceId: 'clxxx459',
    fifthPlaceId: 'clxxx460'
  })
})
```

### cURL

```bash
# Obtener resultados
curl http://localhost:5001/api/results?eventId=clxxx123

# Votar
curl -X POST http://localhost:5001/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "clxxx123",
    "firstPlaceId": "clxxx456",
    "secondPlaceId": "clxxx457",
    "thirdPlaceId": "clxxx458",
    "fourthPlaceId": "clxxx459",
    "fifthPlaceId": "clxxx460"
  }'
```

---

## 📞 Soporte

¿Preguntas sobre la API? Abre un issue en GitHub o contacta a jblancoh26@gmail.com

---

*Última actualización: Octubre 2026*