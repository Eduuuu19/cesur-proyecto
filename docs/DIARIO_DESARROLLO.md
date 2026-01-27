# Diario del PI - Konta
Fecha: 25/01/2026 - Configuración Inicial
Problemas encontrados
**Error de conexión JDBC:** DBeaver me daba error de "Public Key Retrieval".
   - Solución: Modifiqué el driver property `allowPublicKeyRetrieval=true`.
**Permisos en Git:** Github me daba error 403 al hacer push.
   - Solución: Generé un Token de Acceso Personal (PAT) y configuré el `credential.helper` en Linux.
Avances
- Docker Compose creado y funcionando (MySQL).
- Base de datos 'konta_db' conectada en DBeaver.
- Tabla 'clientes' creada con Script SQL.
- Repositorio subido a GitHub.
