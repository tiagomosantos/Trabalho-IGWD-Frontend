# API Documentation - Padel Club Backend

Base URL: `http://localhost:8000/api`

## Table of Contents

- [Authentication](#authentication)
- [CSRF Protection](#csrf-protection)
- [User Management](#user-management)
- [Reservations](#reservations)
- [Memberships](#memberships)
- [Shop & Products](#shop--products)
- [Tournaments](#tournaments)
- [Coaches & Training](#coaches--training)

---

## Authentication

All authenticated endpoints require session-based authentication. Include `credentials: 'include'` in your fetch requests.

### General Notes

- All requests must include credentials (cookies) for session management
- POST/PUT/DELETE requests require CSRF token in `X-CSRFToken` header
- Responses are in JSON format
- Timestamps are in ISO 8601 format

---

## CSRF Protection

### Get CSRF Token

```
GET /csrf-token/
```

**Authentication:** Not required

**Description:** Get CSRF token for subsequent POST/PUT/DELETE requests

**Response:**

```json
{
  "csrfToken": "abc123def456..."
}
```

**Usage Example:**

```javascript
// 1. Get CSRF token
const response = await fetch("http://localhost:8000/api/csrf-token/", {
  credentials: "include",
});
const { csrfToken } = await response.json();

// 2. Use token in subsequent requests
await fetch("http://localhost:8000/api/signup/", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken,
  },
  body: JSON.stringify(data),
});
```

---

## User Management

### Sign Up

```
POST /signup/
```

**Authentication:** Not required

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "password2": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (201 Created):**

```json
{
  "message": "Bem-vindo johndoe!",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "username": ["Username já existe"],
  "email": ["Email já existe"],
  "password": ["As passwords não coincidem"]
}
```

---

### Log In

```
POST /login/
```

**Authentication:** Not required

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (200 OK):**

```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "error": "Credenciais inválidas"
}
```

---

### Log Out

```
POST /logout/
```

**Authentication:** Not required (but logs out current session)

**Response (200 OK):**

```json
{
  "message": "Logout realizado com sucesso"
}
```

---

### Get Current User

```
GET /user/
```

**Authentication:** Required

**Response (200 OK):**

```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

---

## Reservations

### List User Reservations

```
GET /reservas/
```

**Authentication:** Required

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "user": 1,
    "username": "johndoe",
    "data": "2025-12-10",
    "hora": "18:00:00",
    "campo": 1,
    "duracao": 60,
    "criado_em": "2025-12-03T10:30:00Z"
  }
]
```

---

### Create Reservation

```
POST /reservas/
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": "2025-12-10",
  "hora": "18:00:00",
  "campo": 1,
  "duracao": 60
}
```

**Response (201 Created):**

```json
{
  "message": "Reserva efetuada com sucesso!",
  "reserva": {
    "id": 1,
    "user": 1,
    "username": "johndoe",
    "data": "2025-12-10",
    "hora": "18:00:00",
    "campo": 1,
    "duracao": 60,
    "criado_em": "2025-12-03T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Este horário já está reservado"
}
```

---

### Check Court Availability

```
GET /check-disponibilidade/?data=2025-12-10&hora=18:00:00&campo=1
```

**Authentication:** Not required

**Query Parameters:**

- `data` (required): Date in YYYY-MM-DD format
- `hora` (required): Time in HH:MM:SS format
- `campo` (required): Court number

**Response (200 OK):**

```json
{
  "ocupado": false
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Parâmetros obrigatórios: data, hora, campo"
}
```

---

## Memberships

### List User Memberships

```
GET /socios/
```

**Authentication:** Required

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "user": 1,
    "username": "johndoe",
    "nome_completo": "John Doe",
    "email": "john@example.com",
    "telefone": "912345678",
    "morada": "Rua Example, 123",
    "data_nascimento": "1990-01-01",
    "tipo_socio": "individual",
    "numero_socio": 1000,
    "data_inscricao": "2025-12-03",
    "ativo": true
  }
]
```

---

### Create Membership

```
POST /socios/
```

**Authentication:** Required

**Request Body:**

```json
{
  "nome_completo": "John Doe",
  "email": "john@example.com",
  "telefone": "912345678",
  "morada": "Rua Example, 123",
  "data_nascimento": "1990-01-01",
  "tipo_socio": "individual"
}
```

**Membership Types:**

- `individual` - Individual
- `familiar` - Family
- `estudante` - Student

**Response (201 Created):**

```json
{
  "message": "Bem-vindo sócio nº 1000!",
  "socio": {
    "id": 1,
    "user": 1,
    "username": "johndoe",
    "nome_completo": "John Doe",
    "email": "john@example.com",
    "telefone": "912345678",
    "morada": "Rua Example, 123",
    "data_nascimento": "1990-01-01",
    "tipo_socio": "individual",
    "numero_socio": 1000,
    "data_inscricao": "2025-12-03",
    "ativo": true
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Já és sócio!"
}
```

---

## Shop & Products

### List All Products

```
GET /artigos/
```

**Authentication:** Not required

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "nome": "Raquete Bullpadel Vertex 03",
    "descricao": "",
    "preco": "189.99",
    "imagem": "/imagens/artigosloja/raquete.jpg",
    "avaliacoes": [
      {
        "id": 1,
        "artigo": 1,
        "user": 1,
        "username": "johndoe",
        "estrelas": 5,
        "comentario": "Excelente raquete!",
        "data": "2025-12-03T10:30:00Z"
      }
    ],
    "avaliacao_media": 5.0,
    "numero_avaliacoes": 1
  }
]
```

---

### Create Product Review

```
POST /avaliacao/
```

**Authentication:** Required

**Request Body:**

```json
{
  "artigo": 1,
  "estrelas": 5,
  "comentario": "Excelente raquete!"
}
```

**Stars:** Integer from 1 to 5

**Response (201 Created):**

```json
{
  "message": "Avaliação adicionada com sucesso!"
}
```

**Error Response (400 Bad Request):**

```json
{
  "error": "Já avaliaste este artigo!"
}
```

---

## Tournaments

### List All Tournaments

```
GET /torneios/
```

**Authentication:** Not required

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "nome": "Torneio de Natal 2025",
    "descricao": "Torneio de duplas mistas para todos os níveis.",
    "data": "2025-12-22",
    "categoria": "misto",
    "premio": "500.00",
    "inscricoes": "abertas",
    "max_equipas": 16,
    "numero_inscricoes": 5,
    "criado_em": "2025-12-03T10:30:00Z"
  }
]
```

**Categories:**

- `masculino` - Male
- `feminino` - Female
- `misto` - Mixed

**Registration Status:**

- `abertas` - Open
- `fechadas` - Closed

---

### Get Tournament Details

```
GET /torneios/{id}/
```

**Authentication:** Not required

**Response (200 OK):**

```json
{
  "id": 1,
  "nome": "Torneio de Natal 2025",
  "descricao": "Torneio de duplas mistas para todos os níveis.",
  "data": "2025-12-22",
  "categoria": "misto",
  "premio": "500.00",
  "inscricoes": "abertas",
  "max_equipas": 16,
  "numero_inscricoes": 5,
  "criado_em": "2025-12-03T10:30:00Z"
}
```

**Error Response (404 Not Found):**

```json
{
  "error": "Não encontrado"
}
```

---

### List User Tournament Registrations

```
GET /inscricoes-torneio/
```

**Authentication:** Required

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "torneio": 1,
    "torneio_nome": "Torneio de Natal 2025",
    "user": 1,
    "username": "johndoe",
    "nome_equipa": "Team Victory",
    "jogador1": "John Doe",
    "jogador2": "Jane Smith",
    "email": "john@example.com",
    "telefone": "912345678",
    "data_inscricao": "2025-12-03T10:30:00Z",
    "confirmada": false
  }
]
```

---

### Register for Tournament

```
POST /inscricoes-torneio/
```

**Authentication:** Required

**Request Body:**

```json
{
  "torneio": 1,
  "nome_equipa": "Team Victory",
  "jogador1": "John Doe",
  "jogador2": "Jane Smith",
  "email": "john@example.com",
  "telefone": "912345678"
}
```

**Response (201 Created):**

```json
{
  "message": "Inscrição da equipa \"Team Victory\" efetuada!",
  "inscricao": {
    "id": 1,
    "torneio": 1,
    "torneio_nome": "Torneio de Natal 2025",
    "user": 1,
    "username": "johndoe",
    "nome_equipa": "Team Victory",
    "jogador1": "John Doe",
    "jogador2": "Jane Smith",
    "email": "john@example.com",
    "telefone": "912345678",
    "data_inscricao": "2025-12-03T10:30:00Z",
    "confirmada": false
  }
}
```

---

### Get Tournament Registration Details

```
GET /inscricoes-torneio/{id}/
```

**Authentication:** Required (must be owner)

**Response (200 OK):**

```json
{
  "id": 1,
  "torneio": 1,
  "torneio_nome": "Torneio de Natal 2025",
  "user": 1,
  "username": "johndoe",
  "nome_equipa": "Team Victory",
  "jogador1": "John Doe",
  "jogador2": "Jane Smith",
  "email": "john@example.com",
  "telefone": "912345678",
  "data_inscricao": "2025-12-03T10:30:00Z",
  "confirmada": false
}
```

**Error Response (404 Not Found):**

```json
{
  "error": "Não encontrado"
}
```

---

### Cancel Tournament Registration

```
DELETE /inscricoes-torneio/{id}/
```

**Authentication:** Required (must be owner)

**Response (204 No Content):**

```json
{
  "message": "Inscrição cancelada"
}
```

---

## Coaches & Training

### List All Coaches

```
GET /treinadores/
```

**Authentication:** Not required

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "foto": "/imagens/treinadores/joaosilva.png",
    "especialidade": "Técnica e Tática",
    "experiencia": "10 anos",
    "certificacao": "Nível III RPT",
    "descricao": "Especialista em desenvolvimento técnico e estratégia de jogo.",
    "preco_hora": "30.00",
    "ativo": true,
    "numero_pedidos": 15
  }
]
```

---

### Get Coach Details

```
GET /treinadores/{id}/
```

**Authentication:** Not required

**Response (200 OK):**

```json
{
  "id": 1,
  "nome": "João Silva",
  "foto": "/imagens/treinadores/joaosilva.png",
  "especialidade": "Técnica e Tática",
  "experiencia": "10 anos",
  "certificacao": "Nível III RPT",
  "descricao": "Especialista em desenvolvimento técnico e estratégia de jogo.",
  "preco_hora": "30.00",
  "ativo": true,
  "numero_pedidos": 15
}
```

**Error Response (404 Not Found):**

```json
{
  "error": "Não encontrado"
}
```

---

### List User Training Requests

```
GET /pedidos-treino/
```

**Authentication:** Required

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "user": 1,
    "username": "johndoe",
    "treinador": 1,
    "treinador_nome": "João Silva",
    "nome": "John Doe",
    "email": "john@example.com",
    "telefone": "912345678",
    "nivel": "intermedio",
    "objetivo": "Melhorar técnica de direita",
    "disponibilidade": "Segundas e Quartas 18h-20h",
    "data_pedido": "2025-12-03T10:30:00Z",
    "estado": "pendente",
    "preco_hora": "30.00"
  }
]
```

**Skill Levels:**

- `iniciante` - Beginner
- `intermedio` - Intermediate
- `avancado` - Advanced

**Request Status:**

- `pendente` - Pending
- `aprovado` - Approved
- `rejeitado` - Rejected

---

### Create Training Request

```
POST /pedidos-treino/
```

**Authentication:** Required

**Request Body:**

```json
{
  "treinador": 1,
  "nome": "John Doe",
  "email": "john@example.com",
  "telefone": "912345678",
  "nivel": "intermedio",
  "objetivo": "Melhorar técnica de direita",
  "disponibilidade": "Segundas e Quartas 18h-20h"
}
```

**Response (201 Created):**

```json
{
  "message": "Pedido de treino enviado com sucesso!",
  "pedido": {
    "id": 1,
    "user": 1,
    "username": "johndoe",
    "treinador": 1,
    "treinador_nome": "João Silva",
    "nome": "John Doe",
    "email": "john@example.com",
    "telefone": "912345678",
    "nivel": "intermedio",
    "objetivo": "Melhorar técnica de direita",
    "disponibilidade": "Segundas e Quartas 18h-20h",
    "data_pedido": "2025-12-03T10:30:00Z",
    "estado": "pendente",
    "preco_hora": "30.00"
  }
}
```

---

### Get Training Request Details

```
GET /pedidos-treino/{id}/
```

**Authentication:** Required (must be owner)

**Response (200 OK):**

```json
{
  "id": 1,
  "user": 1,
  "username": "johndoe",
  "treinador": 1,
  "treinador_nome": "João Silva",
  "nome": "John Doe",
  "email": "john@example.com",
  "telefone": "912345678",
  "nivel": "intermedio",
  "objetivo": "Melhorar técnica de direita",
  "disponibilidade": "Segundas e Quartas 18h-20h",
  "data_pedido": "2025-12-03T10:30:00Z",
  "estado": "pendente",
  "preco_hora": "30.00"
}
```

**Error Response (404 Not Found):**

```json
{
  "error": "Não encontrado"
}
```

---

### Cancel Training Request

```
DELETE /pedidos-treino/{id}/
```

**Authentication:** Required (must be owner)

**Response (204 No Content):**

```json
{
  "message": "Pedido cancelado"
}
```

---

### List All Training Sessions

```
GET /sessoes-treino/
```

**Authentication:** Not required

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "pedido_treino": 1,
    "data": "2025-12-10",
    "hora": "18:00:00",
    "duracao": 60,
    "campo": 1,
    "realizada": false,
    "observacoes": ""
  }
]
```

---

### Get Training Packages

```
GET /pacotes-treino/
```

**Authentication:** Not required

**Description:** Returns hardcoded training package information

**Response (200 OK):**

```json
[
  {
    "nivel": "iniciante",
    "nome": "Iniciante",
    "preco": 30
  },
  {
    "nivel": "intermedio",
    "nome": "Intermédio",
    "preco": 40
  },
  {
    "nivel": "avancado",
    "nome": "Avançado",
    "preco": 50
  }
]
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request that creates a resource
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid request data or validation error
- `401 Unauthorized` - Authentication required or invalid credentials
- `404 Not Found` - Resource not found

Error responses typically include an `error` field with a descriptive message in Portuguese.

---

## Common Request Headers

```
Content-Type: application/json
X-CSRFToken: <token from /api/csrf-token/>
```

## Common Fetch Options

```javascript
{
  method: 'POST', // or GET, DELETE, etc.
  credentials: 'include', // REQUIRED for session authentication
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken // Required for POST/PUT/DELETE
  },
  body: JSON.stringify(data) // Not needed for GET
}
```

---

## Notes

1. **CSRF Protection**: All state-changing requests (POST/PUT/DELETE) require a CSRF token. Get it from `/api/csrf-token/` and include it in the `X-CSRFToken` header.

2. **Session-Based Authentication**: This API uses Django session authentication. Always include `credentials: 'include'` in fetch requests to send/receive cookies.

3. **CORS**: The API is configured to accept requests from `http://localhost:3000` and `http://127.0.0.1:3000`.

4. **Date/Time Formats**:

   - Dates: `YYYY-MM-DD` (e.g., "2025-12-10")
   - Times: `HH:MM:SS` (e.g., "18:00:00")
   - DateTimes: ISO 8601 format (e.g., "2025-12-03T10:30:00Z")

5. **Pagination**: Currently, all list endpoints return all results without pagination. Consider implementing pagination for production use.
