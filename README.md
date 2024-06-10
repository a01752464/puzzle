# Proyecto: Escape Room Virtual

## Descripción General

Este proyecto es una aplicación web de un Escape Room Virtual, diseñada para guiar a los usuarios a través de una serie de tareas y desafíos. Los jugadores deben registrarse, completar una serie de pasos narrativos y resolver un enigma para avanzar. La aplicación utiliza tecnologías web modernas como HTML, CSS, JavaScript y Node.js, con una base de datos MySQL para almacenar información del usuario.

## Notas Importantes: si revisan el codigo el dia lunes 10 de Junio es muy posible que tenga mi servidor de aws prendido para que funcione como me API y base de datos, de cualquier maner esos dos archivos estan incluidos en el src.

## Estructura del Proyecto

### Archivos Principales
- **index.html**: Página principal con el formulario de registro.
- **bp.html**: Página de la narración con la animación de partículas.
- **key.html**: Página intermedia que muestra un iframe durante 7 segundos.
- **fp.html**: Página donde el usuario ingresa un código.
- **podium.html**: Página que muestra el podio de ganadores.
- **styles.css**: Archivo CSS para el diseño de las páginas.
- **script.js**: Archivo JavaScript que maneja la lógica del cliente.
- **server.js**: Archivo Node.js que maneja las rutas y conexiones de la base de datos.

### Base de Datos
- **escape_room.sql**: Script SQL para la creación de la base de datos y la tabla `clientes`.

## Funcionalidades Clave

### Registro de Usuarios
- El usuario se registra ingresando su nombre completo, edad y teléfono.
- La información del usuario se almacena en la base de datos MySQL.

### Control de Tiempo
- El tiempo que toma un usuario para resolver el enigma es capturado y almacenado en la base de datos.

### Podio
- La página del podio muestra a los tres mejores jugadores y la posición actual del usuario.

### Visualización
- Las páginas utilizan iframes y animaciones CSS para mejorar la experiencia del usuario.

## Configuración e Instalación

### Requisitos
- Node.js
- MySQL

### Instrucciones

1. **Clonar el repositorio**:
   ```bash
   git clone <URL_del_repositorio>
   cd <nombre_del_repositorio>

2. **Instalar dependencias**:
   ```bash
   npm install
   
3. **Configurar Base de dato**:
   Crear la base de datos y la tabla usando el script "clientes-2.sql".
   Configurar las variables de entorno para el usuario y la contraseña de MySQL.
   
4. **Configurar Servidor**:
   Cargar el api  de "api.js" en localhost para un puerto especifico
   Configurar las variables de entorno para el usuario y la contraseña de MySQL.
   
5. **Prende el live preview de inde.html**:
   Aqui es donde comienza la aventura
   Encuentra el codigo que esconde el tesoro
## P.D.
Mucha Suerte

   
   
