# Konta - Sistema de Gestión Financiera y Facturación.

Bienvenido/a al repositorio oficial de **Konta**, un proyecto desarrollado como Trabajo de Fin de Grado para el grado superior de Desarrollo de Aplicaciones Multiplataforma (DAM). 

Konta es una aplicación web (SaaS) diseñada para facilitar la contabilidad y la gestión diaria de autónomos y pequeñas empresas. Permite llevar un control exhaustivo del ciclo de ingresos y gastos de forma centralizada y segura.

## Tecnologías Utilizadas.

El proyecto sigue una arquitectura separada (Frontend y Backend) comunicada mediante una API RESTful.

**Backend (Servidor y API):**
* Java 17
* Spring Boot 3.x
* Spring Security & JSON Web Tokens (JWT) para autenticación.
* Spring Data JPA (Hibernate)
* Maven

**Frontend (Interfaz de Usuario):**
* React.js (construido con Vite)
* JavaScript / JSX
* CSS puro

**Base de Datos:**
* MySQL 8.x

## Características Principales (Módulos).

* **Autenticación Segura:** Sistema de login y registro protegido con tokens JWT.
* **Dashboard Interactivo:** Panel de mandos con KPIs mensuales y gráficos anuales del rendimiento económico.
* **Gestión de Maestros:** Módulo CRUD completo para administrar Clientes y Proveedores de forma individualizada por usuario.
* **Ingresos y Gastos:** Creación y gestión de **Presupuestos**, **Facturas Emitidas** y **Facturas Recibidas**.
  * Auto-cálculo de totales según la base imponible e IVA.
  * Control de estados (Pagada, Pendiente, Vencida).
* **Búsqueda Avanzada:** Filtrado inteligentes.

## Requisitos Previos.

Para ejecutar este proyecto en tu entorno local, necesitarás tener instalado:
* [Java Development Kit (JDK) 17] o superior.
* [Node.js] Versión 18 o superior y npm.
* Un servidor de base de datos **MySQL** ejecutándose en el puerto 3306.

## Instrucciones de Instalación y Ejecución.

Sigue estos pasos para arrancar el proyecto en tu máquina local.

### 1. Configuración de la Base de Datos.
1. Abre tu gestor de MySQL.
2. Crea una base de datos vacía llamada `konta_db`.
3. Crea un usuario con los siguientes credenciales:
   * **Usuario:** `konta_user`
   * **Contraseña:** `konta_password`

*(Nota: Hibernate está configurado para crear y actualizar las tablas automáticamente al arrancar el servidor).*

### 2. Arrancar el Backend.
1. Abre una terminal y navega a la carpeta del backend.
2. Ejecuta el proyecto mediante tu IDE ejecutando la clase `KontaBackendApplication.java` o usa Maven ejecutando el comando: 
   `./mvnw spring-boot:run`
3. El servidor se iniciará en `http://localhost:8080`.

### 3. Arrancar el Frontend (React).
1. Abre una nueva terminal y navega a la carpeta del frontend.
2. Instala las dependencias necesarias ejecutando el comando: 
   `npm install`
3. Levanta el servidor de desarrollo ejecutando el comando: 
   `npm run dev`
4. Abre tu navegador y accede a la URL que te indique la terminal (normalmente `http://localhost:5173`).

*Desarrollado por Eduardo Astudillo para el Trabajo de Fin de Grado.*