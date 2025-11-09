# Aplicación Vulnerable - Práctica de Seguridad Web

Esta aplicación ha sido diseñada específicamente para enseñar sobre vulnerabilidades comunes en aplicaciones web. **NO DEBE SER USADA EN PRODUCCIÓN**.

## 🚨 ADVERTENCIA

Esta aplicación contiene vulnerabilidades intencionales con fines educativos. Los estudiantes deben:
1. Identificar las vulnerabilidades
2. Entender cómo explotarlas
3. Aprender a corregirlas

## ⚡ Características Técnicas

### ✨ Frontend Moderno con Vite
- **Build ultra-rápido**: Vite ofrece HMR (Hot Module Replacement) instantáneo
- **TypeScript**: Tipado estático para mayor seguridad en desarrollo
- **Estructura modular**: Componentes organizados por vulnerabilidad

### 🧪 Sistema de Tests Automáticos
La aplicación incluye una suite completa de tests con Jest que verifican cada vulnerabilidad. **Todos los tests fallarán inicialmente** (aparecerán en rojo ❌). El objetivo es implementar las correcciones necesarias para que todos los tests pasen a verde ✅.

### 🏗️ Arquitectura Organizada
- **Backend**: Código fuente en `/src`, tests en `/test`
- **Frontend**: Configuración de Vite con TypeScript
- **Docker**: Entorno completamente containerizado

### Ejecutar los tests:
```bash
cd backend
npm install
npm run test:security
```

## 📋 Vulnerabilidades incluidas

1. **Brute Force**: Sin limitación de intentos de login
2. **Command Injection**: Ejecución de comandos del sistema
3. **CSRF**: Sin protección contra Cross-Site Request Forgery
4. **File Inclusion (LFI)**: Path traversal permitido
5. **File Upload**: Sin validación de archivos
6. **Insecure CAPTCHA**: Implementación débil de CAPTCHA
7. **SQL Injection**: Concatenación directa en consultas
8. **Blind SQL Injection**: Extracción de información mediante inferencia

## 🏗️ Estructura del proyecto

```
ciberseg-tp/
├── docker-compose.yml
├── README.md
├── .gitignore
├── backend/
│   ├── src/              # ⭐ Código fuente
│   │   ├── config/       # Configuraciones (DB, Multer)
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── middleware/   # Middleware de Express
│   │   ├── routes/       # Definición de rutas
│   │   ├── utils/        # Utilidades
│   │   └── server.js     # Punto de entrada
│   ├── test/             # ⭐ Suite de tests de seguridad
│   │   ├── security/     # Tests para cada vulnerabilidad
│   │   ├── setup.js      # Configuración de Jest
│   │   └── run-security-tests.js  # Runner personalizado
│   ├── files/            # Archivos de ejemplo para tests
│   ├── uploads/          # Directorio de archivos subidos
│   ├── package.json
│   ├── jest.config.js
│   ├── init.sql          # Script de inicialización DB
│   └── Dockerfile
└── frontend/
    ├── src/              # Código fuente React
    │   ├── types/        # Definiciones TypeScript
    │   ├── services/     # Servicios API
    │   ├── components/
    │   │   └── vulnerabilities/  # Componentes por vulnerabilidad
    │   ├── App.tsx
    │   ├── index.tsx
    │   └── vite-env.d.ts
    ├── index.html        # ⭐ Entrada de Vite (en raíz)
    ├── vite.config.ts    # ⭐ Configuración de Vite
    ├── package.json
    ├── tsconfig.json
    └── Dockerfile
```

## 🚀 Instalación y ejecución

### Requisitos previos
- Docker
- Docker Compose v2

### Pasos para ejecutar

1. Clona o descarga el proyecto

2. Navega al directorio del proyecto:
```bash
cd aplicacion-vulnerable
```

3. Ejecuta con Docker Compose:
```bash
docker compose up --build
```

4. Accede a la aplicación:
- **Frontend (Vite)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MySQL**: localhost:3306

### Credenciales por defecto

**Usuarios de prueba:**
- admin / admin123
- user1 / user123

**Base de datos MySQL:**
- Root: root / root123
- App user: appuser / apppass123

## 🎯 Trabajo Práctico con Tests

### Metodología TDD (Test-Driven Development)

1. **Ejecutar tests iniciales** (todos fallarán):
   ```bash
   cd backend
   npm run test:security
   ```

2. **Trabajar en cada vulnerabilidad**:
   - Los tests están en `backend/test/security/`
   - Cada test incluye instrucciones detalladas
   - Implementar las correcciones en `backend/src/` hasta que el test pase

3. **Verificar progreso**:
   - El script mostrará un resumen con el progreso
   - Objetivo: 8/8 tests pasando (100%)

### Ejemplo de flujo de trabajo:

```bash
# 1. Ver estado inicial
npm run test:security
# Resultado: 0/8 ❌

# 2. Trabajar en una vulnerabilidad específica
npx jest test/security/01-brute-force.test.js

# 3. Implementar correcciones en backend/src/...

# 4. Verificar
npm run test:security
# Resultado: 1/8 ✅
```

## 📚 Recursos recomendados

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

## 🛠️ Tips para las correcciones

### Brute Force
- Implementar rate limiting (express-rate-limit)
- Agregar CAPTCHA después de X intentos
- Bloqueo temporal de cuentas
- Logs de intentos fallidos

### Command Injection
- Validar y sanitizar entradas
- Usar funciones seguras (no exec/system)
- Implementar whitelist de comandos
- Usar child_process.spawn con argumentos

### CSRF
- Implementar tokens CSRF (csurf)
- Verificar headers Referer/Origin
- Usar SameSite cookies
- Double Submit Cookie pattern

### File Inclusion
- Validar rutas de archivos
- Usar whitelist de archivos permitidos
- Evitar path traversal
- Chroot jail para archivos

### File Upload
- Validar tipo MIME real
- Verificar extensiones (whitelist)
- Limitar tamaño
- Almacenar fuera del webroot
- Renombrar archivos
- Escanear con antivirus

### Insecure CAPTCHA
- Tokens únicos con expiración
- Una sola validación por token
- Aumentar complejidad
- Usar servicios como reCAPTCHA

### SQL Injection
- Usar prepared statements
- Parametrizar consultas
- Validar entradas
- Principio de menor privilegio
- Usar ORM (Sequelize)

## 📁 Estructura del Backend

El backend sigue una arquitectura MVC organizada con separación de código y tests:

### Código Fuente (`/src`)
- **`/src/config`**: Configuraciones de base de datos y multer
- **`/src/controllers`**: Lógica de negocio para cada vulnerabilidad
- **`/src/routes`**: Definición de endpoints de la API
- **`/src/middleware`**: Manejo de errores y otros middleware
- **`/src/utils`**: Funciones de utilidad
- **`/src/server.js`**: Punto de entrada de la aplicación

### Tests (`/test`)
- **`/test/security`**: 8 tests de seguridad (uno por vulnerabilidad)
- **`/test/setup.js`**: Configuración de Jest y mocks
- **`/test/run-security-tests.js`**: Runner personalizado con reporte visual

## 🎨 Stack Tecnológico

### Backend
- **Node.js** + **Express**: Framework web
- **MySQL**: Base de datos relacional
- **Jest** + **Supertest**: Testing
- **bcryptjs**: Hash de contraseñas
- **jsonwebtoken**: Autenticación JWT

### Frontend
- **React 18** + **TypeScript**: UI framework
- **Vite**: Build tool (HMR ultra-rápido)
- **Axios**: Cliente HTTP
- **React Router**: Routing

### DevOps
- **Docker** + **Docker Compose**: Containerización
- **Nodemon**: Auto-reload en desarrollo

## 🔧 Desarrollo Local (Sin Docker)

Si prefieres ejecutar sin Docker:

### Backend
```bash
cd backend
npm install
npm start
# Servidor en http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Vite dev server en http://localhost:3000
```

### Base de Datos
Necesitarás MySQL corriendo localmente:
```bash
# Crear base de datos
mysql -u root -p < backend/init.sql
```

Variables de entorno (crear `.env` en backend):
```env
DB_HOST=localhost
DB_USER=appuser
DB_PASSWORD=apppass123
DB_NAME=vulnerable_app
JWT_SECRET=supersecret123
```

## 🏆 Objetivo Final

El trabajo estará completo cuando:

1. Todos los tests de seguridad pasen (8/8 ✅)
2. La aplicación siga funcionando correctamente
3. Se hayan documentado las correcciones realizadas

## 📝 Comandos Útiles

### Tests
```bash
# Ejecutar todos los tests de seguridad
npm run test:security

# Ejecutar un test específico
npx jest test/security/01-brute-force.test.js

# Ejecutar tests en modo watch
npm test

# Generar reporte de cobertura
npm run test:coverage
```

### Docker
```bash
# Iniciar todos los servicios
docker compose up --build

# Iniciar solo un servicio
docker compose up frontend
docker compose up backend

# Ver logs de un servicio
docker compose logs -f backend

# Detener todos los servicios
docker compose down

# Reiniciar un servicio
docker compose restart backend
```

### Base de Datos
```bash
# Acceder a MySQL desde contenedor
docker exec -it vulnerable_mysql mysql -uappuser -papppass123 vulnerable_app

# Ver usuarios en la base de datos
docker exec vulnerable_mysql mysql -uappuser -papppass123 vulnerable_app -e "SELECT username, email FROM users;"
```

## 🆕 Cambios Recientes

### v2.0 (Actualización de Arquitectura)
- ✨ **Frontend migrado a Vite** - Build y HMR mucho más rápidos que webpack
- 🏗️ **Backend reorganizado** - Código fuente en `/src`, tests en `/test`
- 🔐 **Contraseñas corregidas** - Hashes bcrypt actualizados correctamente
- 📦 **Mejor .gitignore** - Excluye archivos de IA y temporales
- 📚 **Documentación mejorada** - CLAUDE.md para contexto de IA

### Beneficios de la actualización:
- **Vite**: Desarrollo ~10x más rápido con HMR instantáneo
- **Estructura clara**: Separación de código y tests
- **Mejor DX**: TypeScript + ESLint + mejores tipos
- **Estándares modernos**: Siguiendo mejores prácticas de la industria

## 🤝 Contribuciones

Este proyecto es con fines educativos. Si encuentras algún problema o tienes sugerencias, por favor crea un issue.

## ⚖️ Licencia

Este proyecto es solo para fines educativos. No debe ser utilizado en entornos de producción.
