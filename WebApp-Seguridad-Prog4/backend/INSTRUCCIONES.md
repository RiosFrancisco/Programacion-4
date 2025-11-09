# 📚 Trabajo Práctico: Seguridad en Aplicaciones Web

## 🎯 Objetivo

Tu misión es corregir todas las vulnerabilidades de seguridad en esta aplicación web. La aplicación ha sido diseñada intencionalmente con 8 vulnerabilidades críticas que debes identificar y solucionar.

## 🚀 Comenzando

### 1. Instalar dependencias y ejecutar la aplicación

```bash
# Ejecutar con Docker
docker-compose up --build

# O ejecutar localmente
cd backend
npm install
npm start
```

### 2. Ejecutar los tests de seguridad

```bash
cd backend
npm run test:security
```

**IMPORTANTE:** Todos los tests fallarán inicialmente (❌). Tu objetivo es hacer que todos pasen (✅).

## 🔒 Vulnerabilidades a Corregir

### 1. **Brute Force** 
- **Problema**: No hay límite en los intentos de login
- **Objetivo**: Implementar rate limiting y protección contra fuerza bruta
- **Tests**: `01-brute-force.test.js`

### 2. **Command Injection**
- **Problema**: El servidor ejecuta comandos sin validar la entrada
- **Objetivo**: Validar y sanitizar entradas, usar métodos seguros
- **Tests**: `02-command-injection.test.js`

### 3. **CSRF (Cross-Site Request Forgery)**
- **Problema**: No hay protección contra peticiones falsificadas
- **Objetivo**: Implementar tokens CSRF
- **Tests**: `03-csrf-protection.test.js`

### 4. **File Inclusion (LFI)**
- **Problema**: Permite acceso a archivos fuera del directorio permitido
- **Objetivo**: Validar rutas y restringir acceso
- **Tests**: `04-file-inclusion.test.js`

### 5. **File Upload**
- **Problema**: No valida tipo ni contenido de archivos
- **Objetivo**: Implementar validación estricta de archivos
- **Tests**: `05-file-upload.test.js`

### 6. **Insecure CAPTCHA**
- **Problema**: CAPTCHA predecible y reutilizable
- **Objetivo**: Implementar CAPTCHA seguro con expiración
- **Tests**: `06-insecure-captcha.test.js`

### 7. **SQL Injection**
- **Problema**: Concatenación directa de SQL
- **Objetivo**: Usar consultas parametrizadas
- **Tests**: `07-sql-injection.test.js`

### 8. **Blind SQL Injection**
- **Problema**: Permite inferir información mediante respuestas
- **Objetivo**: Respuestas genéricas y rate limiting
- **Tests**: `08-blind-sql-injection.test.js`

## 📋 Proceso de Trabajo

1. **Ejecutar un test específico**:
   ```bash
   npx jest __tests__/security/01-brute-force.test.js
   ```

2. **Ver las instrucciones**: Cada archivo de test incluye instrucciones detalladas

3. **Implementar la corrección**: Modifica el código en `/controllers`, `/routes`, etc.

4. **Verificar**: Ejecuta el test nuevamente hasta que pase

5. **Continuar**: Repite con la siguiente vulnerabilidad

## 🛠️ Herramientas y Librerías Útiles

Las siguientes librerías ya están incluidas en `package.json`:

- **express-rate-limit**: Para limitar intentos
- **helmet**: Headers de seguridad
- **express-validator**: Validación de entrada
- **csurf**: Protección CSRF

## 📁 Estructura del Proyecto

```
backend/
├── __tests__/
│   ├── security/          # Tests de seguridad
│   └── run-security-tests.js
├── config/                # Configuraciones
├── controllers/           # Lógica de negocio (vulnerabilidades aquí)
├── routes/                # Definición de rutas
├── middleware/            # Middleware personalizado
└── server.js              # Entrada principal
```

## ✅ Criterios de Evaluación

1. **Tests Pasando**: Todos los tests de seguridad deben pasar
2. **Implementación Correcta**: Las soluciones deben seguir buenas prácticas
3. **No Romper Funcionalidad**: La aplicación debe seguir funcionando
4. **Documentación**: Comentarios explicando las correcciones

## 💡 Tips

- Lee cuidadosamente las instrucciones en cada test
- No todas las soluciones requieren código nuevo, algunas solo necesitan configuración
- Prueba la aplicación manualmente además de los tests
- Consulta la documentación de las librerías de seguridad

## 🏆 Objetivo Final

```bash
npm run test:security

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

## ⚠️ Importante

- **NO** subas este código vulnerable a producción
- **NO** uses estas técnicas vulnerables en proyectos reales
- Este es un entorno de aprendizaje controlado

¡Buena suerte! 💪
