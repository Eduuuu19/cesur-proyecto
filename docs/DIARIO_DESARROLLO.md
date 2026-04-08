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
- 
## [06-02-2026] - CRUD Completo de Clientes
### Avances
- Implementado método `addCliente` (POST) para ver fichas individuales.
- Implementado método `getClientes` (GET) para ver fichas de todos los registros.
- Implementado método `getClienteById` (GET) para ver fichas individuales.
- Implementado método `deleteCliente` (DELETE) para eliminar registros.
- Implementado método `updateCliente` (PUT) para modificar datos existentes.
- Pruebas: Verificado el ciclo completo (Crear -> Leer -> Editar -> Borrar) usando Browser y Terminal (Curl).
- Documentación de la API actualizada con los nuevos endpoints.

## [10-03-2026] - CRUD Completo de Proveedores
### Avances
- Creación de la Entidad `Proveedor` basada en el diccionario de datos.
- Creación del `ProveedorRepository` para la persistencia con JPA/Hibernate.
- Implementación de la capa de lógica de negocio en `ProveedorService`.
- Desarrollo del `ProveedorController` con los 5 endpoints del CRUD (`GET`, `POST`, `PUT`, `DELETE`).
- Pruebas de funcionamiento superadas (creación e inserción en MySQL comprobada vía terminal y navegador).

## [11-03-2026] - CRUD Completo del módulo de ingresos y gastos.
### Avances
- Configuración de `application.properties` (update/create) para sincronizar base de datos.
- Implementado CRUD completo para `Presupuesto` con relación `@ManyToOne` hacia `Cliente`.
- Implementado CRUD completo para `FacturaEmitida` con relación `@ManyToOne` hacia `Cliente`.
- Implementado CRUD completo para `FacturaRecibida` con relación `@ManyToOne` hacia `Proveedor`.
- Pruebas de integración superadas validando la inserción de datos anidados (JSON) mediante API REST.

## [12-03-2026] - Control de Calidad, Validaciones y Lógica de Negocio
### Problemas encontrados
1. **Mensajes de validación ocultos**: Al probar una petición incorrecta, Spring Boot bloqueaba el JSON pero devolvía un Error 400 genérico, ocultando los mensajes personalizados
   - Solución: Implementación de una clase global con @RestControllerAdvice para capturar la excepción MethodArgumentNotValidException y extraer los mensajes en un formato JSON limpio.
2. **Excepciones de integridad en la base de datos no controladas**: Al intentar insertar facturas con un número duplicado o al intentar borrar clientes con facturas asociadas, la base de datos bloqueaba la acción y el servidor devolvía un Error 500 incomprensible.
   - Ampliación del GlobalExceptionHandler para atrapar DataIntegrityViolationException. Se implementó lógica para leer la causa específica del error de MySQL y devolver un código HTTP 409 (Conflict) con un mensaje amigable.
3. **Hibernate no aplicaba nuevas restricciones estructurales**: Al añadir la regla '@Column(unique = true)' a un campo que ya existía en la base de datos, la configuración ddl-auto=update la ignoraba para no romper datos existentes.
   - Solución: Borrado manual de las tablas ('DROP TABLE') mediante script SQL en DBeaver para forzar a Spring Boot a reconstruir el esquema desde cero aplicando los candados de seguridad.
### Avances
- Instalada dependencia `spring-boot-starter-validation`.
- Aplicadas reglas de validación en Entidades (`@NotBlank`, `@NotNull`, `@Positive`, `@Email`).
- Implementada restricción de formato estricto (`@Pattern`) para los Estados en Maestros y Facturación.
- Implementada restricción de unicidad (`unique = true`) para los números de presupuestos y facturas.
- Creación de `GlobalExceptionHandler` (`@RestControllerAdvice`) para capturar errores de validación y devolver respuestas limpias (HTTP 400).
- Refactorización de la lógica de negocio en los `Services`: los totales de presupuestos y facturas ahora se calculan automáticamente en el servidor a partir de la Base Imponible y el % de IVA aportados, aplicando el Principio DRY.
- Configuración de políticas CORS globales mediante la clase CorsConfig (implementando WebMvcConfigurer) para permitir el futuro consumo de la API desde aplicaciones Frontend. 
- Creación de consultas personalizadas (Derived Queries) en los Repositories para permitir la búsqueda y filtrado por estado y por NIF (findByEstado, findByClienteNif y findByProveedorNif). 
- Integración de la interfaz Sort de Spring Data en Controladores, Servicios y Repositorios para habilitar la ordenación dinámica de datos (ascendente y descendente) directamente desde la URL.

## [13-03-2026] - Implementación del Modelo de Usuarios y Relaciones de Propiedad
### Avances
- Creación de la entidad principal `Usuario` reflejando estrictamente los atributos definidos en el Diccionario de Datos del proyecto (`id_usuario`, `nombreUsuario`, `email`, `telefono`, `password`, `avatar` y `rol`).
- Creación de `UsuarioRepository` implementando el uso de la clase `Optional` de Java (`findByEmail`) para prevenir errores de tipo `NullPointerException` durante el futuro proceso de autenticación de credenciales.
- Refactorización estructural del modelo de datos para cumplir con el Modelo de Relaciones y Cardinalidad: Implementación de la relación `@ManyToOne` en las entidades `Cliente`, `Proveedor`, `Presupuesto`, `FacturaEmitida` y `FacturaRecibida`.
- Enlace efectivo de todas las tablas de Maestros, Ingresos y Gastos con la tabla `usuarios` mediante la restricción de clave foránea `id_usuario`, garantizando que ninguna operación económica quede huérfana en el sistema.

## [14-03-2026] - Seguridad y JWT
### Problemas encontrados
1. **Bloqueo en rutas públicas (Error 403):** Al intentar probar el registro desde Postman, Spring Security me bloqueaba la petición constantemente.
   - *Solución:* Tuve que poner explícitamente `requestMatchers("/api/auth/**").permitAll()` antes de decirle al sistema que requiriera autenticación para el resto de la API.
### Avances
- Configuración base de Spring Security implementada.
- Lógica de generación y validación de tokens JWT terminada.
- Endpoints de login y registro funcionando y probados en Postman.

## [16-03-2026] - CRUD completo y privacidad de datos
### Problemas encontrados
1. **Bucle infinito al devolver JSON:** Al hacer un GET de los clientes, la consola empezó a lanzar errores `StackOverflowError`
   - *Solución:* Añadí la anotación `@JsonIgnore` en la entidad para cortar la serialización recursiva de la librería Jackson.
2. **Error de clave foránea al guardar:** Me daba `DataIntegrityViolationException` al intentar guardar un cliente porque el `id_usuario` llegaba nulo.
   - *Solución:* Creé un método `getUsuarioAutenticado()` para extraer el email directamente del token (`SecurityContextHolder`) y asignar el usuario por código antes de hacer el `save()`.
### Avances
- Terminados los controladores, servicios y repositorios de todos los módulos operativos (Maestros, Ingresos, Gastos).
- Consultas JPA modificadas (ej. `findByEstadoAndUsuario`) para garantizar que nadie pueda acceder a datos de otra cuenta.

## [17-03-2026] - Refactorización de filtros y configuración CORS
### Problemas encontrados
1. **Error 400 en búsquedas vacías:** Al pasar las rutas a `@RequestParam` para unificar los filtros, si enviaba la petición sin parámetros el servidor lanzaba un error 400 Bad Request.
   - *Solución:* Añadí la propiedad `(required = false)` a las anotaciones para que los filtros sean opcionales y el endpoint no explote si no le mando nada.
### Avances
- Limpieza de controladores: he pasado a una arquitectura de "ventanilla única" para encadenar múltiples filtros en una misma ruta.
- Creación de la clase `CorsConfig` para abrir los puertos al futuro Frontend (React/Angular/Vue) y permitir el paso de credenciales de sesión.

## [18-03-2026] - Dashboard, Motor Analítico y Administrador
### Problemas encontrados
1. **El servidor no arrancaba:** Spring Boot me lanzaba un `PropertyReferenceException` diciendo que no encontraba la propiedad 'state' en la entidad Cliente.
   - *Solución:* Como Spring Data JPA deriva las consultas del nombre del método, tiene que coincidir exactamente con la variable. Tenía `findByState...` pero la variable en Java era `estado`. Lo cambié a `findByEstadoAndUsuario`.
### Avances
- Servicio del Dashboard creado: he usado Java Streams para agrupar, filtrar y sumar las facturas por meses, generando directamente los arrays de datos que necesitará el frontend para dibujar las gráficas.
- Módulo de administración terminado: añadida la propiedad `estado` a los usuarios para que el rol ADMIN pueda bloquear cuentas y activar el "Modo Mantenimiento".

## [23-03-2026] - Inicialización del Frontend y Arquitectura CSS
### Avances
- Creación del proyecto Frontend utilizando React y Vite para una compilación rápida.
- Limpieza de archivos base y estructuración de carpetas siguiendo el patrón de Diseño Atómico (`components/atoms`, `pages`, `assets`).
- Definición de la arquitectura de estilos: Se opta por **CSS Modules** para garantizar el aislamiento de estilos por componente y evitar colisiones de clases.
- Creación del sistema de diseño global en `index.css`: Definición de variables CSS (Custom Properties) para la paleta de colores corporativa (primarios, neutros/grises, alertas) y tipografía base.

## [25-03-2026] - Desarrollo de Componentes Atómicos (UI Kit)
### Avances
- Creación del componente reutilizable `InputField.jsx`: Incorpora lógica interna para gestionar su propio estado (visibilidad de contraseña con iconos dinámica) y recibe funciones del componente padre (`onClear`) para limpiar el texto.
- Implementación visual de campos obligatorios vs opcionales mediante la prop `isRequired`, renderizando dinámicamente el asterisco rojo.
- Desarrollo de componentes atómicos adicionales: `Button.jsx`, `Checkbox.jsx` (para la opción "Recuérdame") y `FormLegend.jsx`.

## [26-03-2026] - Ensamblaje de Pantallas de Autenticación y Enrutamiento
### Avances
- Construcción de la `LoginPage` ensamblando los átomos previamente creados, manteniendo el componente limpio de lógica CSS y etiquetas HTML puras.
- Construcción de la `RegisterPage` demostrando la escalabilidad del diseño atómico.
- Configuración del enrutador principal en `App.jsx` utilizando `react-router-dom`, estableciendo las rutas `/login` y `/register`, y un redireccionamiento por defecto.
- Instalación de la librería externa `react-phone-number-input` para gestionar de forma estandarizada y profesional la selección de prefijos telefónicos internacionales en el formulario de registro.

## [07-04-2026] - Dashboard, Visualización de Datos y Arquitectura Atómica
### Problemas encontrados
1. **Componente `Cell` obsoleto en Recharts:** Al intentar pintar las barras de forma individual, la consola mostraba un error de *deprecation* y el navegador se quedaba en blanco.
   - *Solución:* Se eliminó el uso de `<Cell />` y se pasó la propiedad `fill` directamente dentro del objeto de datos, cumpliendo con los estándares de la versión 4.0 de la librería.
2. **Desbordamiento de texto en Sidebar colapsado:** Al minimizar la barra, los textos de los enlaces se amontonaban o se cortaban de forma antiestética.
   - *Solución:* Se envolvieron los textos en condicionales de React (`!isCollapsed && ...`) y se aplicó `overflow: hidden` y `white-space: nowrap` en el CSS para asegurar una transición limpia.
### Avances
- **Implementación de Recharts:** Integración de la librería `recharts` para la visualización de datos. Se han creado gráficos de área para la evolución diaria de ingresos y gastos, y gráficos de barras comparativos para beneficios y balance anual.
- **Diseño del Layout y Sidebar Retráctil:** Implementación de la estructura base de la aplicación (`MainLayout`) que integra una barra lateral funcional. Se incluyó lógica para que los acordeones de "Maestros" e "Ingresos" abran automáticamente la barra si esta se encuentra minimizada.
- **Creación de la Barra Superior (Header):** Desarrollo de la cabecera global que contiene el buscador, la información del usuario y el acceso al perfil, manteniendo la coherencia visual en toda la plataforma.
- **Maquetación Integral del Panel de Control:** Ensamblaje final de la pantalla de Dashboard, combinando las tarjetas de resumen con KPIs financieros, selectores de fecha y la lógica de visualización de gráficos dinámicos.
- **Estilización Avanzada con CSS Modules:** Uso de variables globales de CSS y transiciones suaves para la animación de la barra lateral y el diseño de la interfaz.

## [08-04-2026] - Paginación Dinámica y Expansión de Vistas de Gestión
### Avances
- **Lógica de Paginación en DataTable:** Implementación de lógica matemática en el componente maestro para segmentar datos en grupos de 10 registros. Se añadieron controles de navegación dinámica (flechas y números) con validaciones de seguridad (`Math.max` / `Math.min`) para evitar navegación fuera de límites.
- **Creación de FacturasEmitidasPage, PresupuestosPage y FacturasRecibidasPage:** Expansión del sistema mediante la reutilización del componente `DataTable`. Se configuraron las columnas específicas para presupuestos y facturas emitidas y recibidas, demostrando la eficiencia del diseño modular.
- **Refactorización de Rutas:** Configuración de los nuevos endpoints en `App.jsx` para dar soporte a la navegación completa entre las secciones de Ingresos y Gastos.
- **Ajustes de UI/UX y Accesibilidad:** Mejora del contraste visual en el Sidebar mediante el uso de selectores CSS específicos para sub-enlaces activos, garantizando la legibilidad del texto sobre los fondos destacados.
