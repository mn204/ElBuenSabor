
# 🍽️ El Buen Sabor - Backend

Sistema integral de gestión para un emprendimiento gastronómico con delivery, que moderniza la atención al cliente y optimiza las operaciones internas del negocio. Desarrollado como **proyecto final académico**.

---

## 🧠 Descripción General

Este backend gestiona operaciones clave como pedidos, facturación, autenticación, notificaciones en tiempo real y estadísticas, brindando soporte completo a la aplicación web de **El Buen Sabor**, tanto para clientes como para empleados y administradores.

---

## 🛠️ Tecnologías utilizadas

- Java 17  
- Spring Boot 3  
- Spring Security  
- Spring Data JPA  
- Gradle  
- MySQL  
- Firebase Authentication  
- MapStruct  
- Cloudinary  
- Mercado Pago - Checkout Pro  
- Apache POI (Excel)  
- OpenPDF (PDF)  
- Swagger (en desarrollo)  
- Lombok  
- Bootstrap - React-Bootstrap *(lado frontend complementario)*

---

## 🧩 Estructura del proyecto

```
📦 src
├── 📁 controller         → Maneja las solicitudes HTTP (REST API)
│   └── 📁 advice         → Manejo global de errores y excepciones
├── 📁 service            → Lógica de negocio
│   └── 📁 impl           → Implementaciones concretas
├── 📁 repository         → Acceso a la base de datos (JPA)
├── 📁 model              → Entidades del dominio
├── 📁 dto                → Transferencia de datos entre capas
├── 📁 mapper             → Mapeos con MapStruct
├── 📁 exceptions         → Excepciones personalizadas
├── 📁 security           → Seguridad y autenticación vía Firebase
```
---

## 🚀 Instalación y ejecución

### 1. Base de datos

- Iniciar MySQL  
- Crear la base de datos: `buen_sabor2`

### 2. Configuración

Editar el archivo `src/main/resources/application.properties` con:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/buen_sabor2?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update

spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
server.port=8080
```

⚠️ Ajustar usuario y contraseña según configuración local.

### 3. Firebase

Colocar el archivo `firebase-service-account-buen-sabor.json` en:

```
src/main/resources/firebase/
```

### 4. Build y ejecución

```bash
./gradlew build
./gradlew bootRun
```

### 5. Carga de datos

Ejecutar los siguientes scripts SQL en orden:

- `script_datos1.sql`  
- `script_datos2.sql`  
- `script_datos3.sql`  
- `script_datos4.sql`

---

## 📚 Documentación de la API

🔧 En desarrollo  
Integración con Swagger UI para documentación interactiva.

---

## 📈 Módulos implementados

- Gestión de usuarios y roles  
- Paneles separados para administrador, empleados y clientes  
- Gestión de productos, insumos, categorías  
- Carrito y pedidos  
- Facturación (PDF)  
- Exportación de datos (Excel)  
- Estadísticas  
- Gestión de cocina y delivery  
- Promociones  

---

## 👥 Autores

- Lucas Gonzalez  
- Juan Cruz Gonzalez  
- Manuel Rodríguez  
- Sebatian Luna  
- Juan Cruz Vargas  

---

## 🧪 Cuentas de prueba

### Administradores
- `admin@buensa.com` / `123456`  
- `mln204manutup@gmail.com` / `123456`

### Sucursal 1
- Cajero: `cajero@buensa.com` / `123456`  
- Cocinero: `cocinero@buensa.com` / `123456`  
- Delivery: `delivery@buensa.com` / `123456`  

### Sucursal 2
- Cajero: `cajero2@buensa.com` / `123456A.a`  
- Cocinero: `cocinero2@buensa.com` / `123456A.a`  
- Delivery: `delivery2@buensa.com` / `123456A.a`

### Clientes
- `clientebuensabor@gmail.com` / `123456`  
- `luis@hotmail.com` / `123456A.a`  
- `max@hotmail.com` / `123456A.a`

---

## 🤝 Contribuciones

1. Realizar un fork del repositorio  
2. Crear rama:  
```bash
git checkout -b feature/nueva-funcionalidad
```
3. Commit de los cambios:  
```bash
git commit -m 'Agregar nueva funcionalidad'
```
4. Push a la rama:  
```bash
git push origin feature/nueva-funcionalidad
```
5. Crear Pull Request

---

## 📄 Licencia

Desarrollado como proyecto académico  
**Laboratorio de Computación 4 - UTN**
