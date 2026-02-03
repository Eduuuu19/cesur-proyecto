# Diario del PI - Konta
## [25/01/2026] - Configuración Inicial
### Problemas encontrados
1. **Error de conexión JDBC:** DBeaver me daba error de "Public Key Retrieval".
   - Solución: Modifiqué el driver property `allowPublicKeyRetrieval=true`.
2. **Permisos en Git:** Github me daba error 403 al hacer push.
   - Solución: Generé un Token de Acceso Personal (PAT) y configuré el `credential.helper` en Linux.
### Avances
- Docker Compose creado y funcionando (MySQL).
- Base de datos 'konta_db' conectada en DBeaver.
- Tabla 'clientes' creada con Script SQL.
- Repositorio subido a GitHub.

## [29-01-2026] - Conexión Backend y Entidades
### Problemas encontrados
1. **Error de versión Java:** IntelliJ intentaba compilar con Java 5 y daba error "target 5".
   - *Solución:* Forcé la versión 17 en el archivo `pom.xml` y sincronicé Maven.
2. **Error de Dialecto:** Hibernate fallaba al arrancar (`ClassNotFoundException`).
   - *Solución:* Eliminé la línea del dialecto antiguo en `application.properties`.

### Avances
- Conexión establecida entre Backend (Java) y Base de Datos.
- Entidad 'Cliente' creada con los mismos nombres de columna que en BBDD.
- Comprobado que la aplicación modifica la tabla automáticamente al arrancar.

## [03-02-2026] - Capa de Acceso a Datos (Repository)

### Avances
- Creado paquete `repository`.
- Implementada interfaz `ClienteRepository` que extiende de `JpaRepository`.
- Verificado que el tipo de dato de la PK en BBDD (`bigint`) coincide con Java (`Long`).
- Comprobado que la aplicación arranca e inyecta el repositorio correctamente.