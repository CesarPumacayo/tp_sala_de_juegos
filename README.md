🎮 Sala de Juegos
--

TP #1  
Alumno: César Pumacayo  
Materia: Programación IV  
Carrera: Tecnicatura Universitaria en Programación — UTN Avellaneda  

Deploy: tp-sala-de-juegos-ivory.vercel.app

---

🛠️ Tecnologías utilizadas
--

- Angular — Framework frontend
- TypeScript — Lenguaje principal
- Supabase — Backend, autenticación y base de datos
- Vercel — Hosting y deploy
- GitHub API — Datos del alumno en la página "Quién Soy"
- Bootstrap — Diseño y estilos visuales

---

# Sprints📦 (1-4)

## Sprint #1

Creación del proyecto Angular utilizando componentes standalone y Angular Router para la navegación entre vistas.

Se desarrollaron los componentes principales:
- Login
- Registro
- Bienvenida / Home
- Quién Soy

La página "Quién Soy" consume la API pública de GitHub para mostrar:
- Nombre del alumno
- Imagen de perfil
- Ubicación
- Cantidad de repositorios públicos
- Perfil de GitHub

También se agregó:
- Explicación del juego propio
- Diseño responsive
- Favicon personalizado
- Deploy en Vercel

---

## Sprint #2



Implementación completa del sistema de autenticación utilizando Supabase Authentication.

Se desarrollaron las funcionalidades de:
- Inicio de sesión mediante email y contraseña
- Registro de usuarios
- Persistencia de sesión
- Logout

Ejemplo iniciar sesion:
~~~ 
"email":tomas@gmail.com 
"contraseña":"tomas123"
~~~ 
Además:
- El Home muestra contenido dinámico dependiendo si el usuario está logueado o no.
- Se agregaron Guards para proteger rutas privadas.
- Se implementaron botones de acceso rápido para pruebas.
- Los datos personales del usuario se almacenan en Supabase Database.
- La contraseña NO se guarda en la base de datos personalizada, únicamente en Supabase Authentication.

Datos almacenados:
- Nombre
- Apellido
- Edad
- Correo electrónico

También se implementó:
- Manejo de errores
- Mensajes dinámicos
- Signals y Computed de Angular para reactividad

---

## Sprint #3

Paquetes instalados:
~~~ 
npm install sweetalert2 
npm install bootstrap
npm install bootstrap-icons
~~~ 

Desarrollo del juego Ahorcado, mayor a menor y chat de usuarios utilizando Angular Signals y componentes standalone.

El juego permite seleccionar letras mediante botones interactivos del abecedario, sin utilizar el teclado, cumpliendo con los requisitos solicitados.

Se implementó lógica reactiva para:
- Mostrar el progreso de la palabra oculta
- Detectar letras correctas e incorrectas
- Contabilizar errores
- Detectar automáticamente victoria o derrota
- Reiniciar partidas

Además, al finalizar cada partida se guardan automáticamente en Supabase:
- Usuario que jugó
- Palabra utilizada
- Cantidad de errores cometidos
- Cantidad de letras seleccionadas
- Tiempo total de la partida
- Resultado final de la partida (ganó o perdió)

También se incorporaron:
- Estilos personalizados
- Experiencia interactiva
- Diseño responsive
- Mejoras visuales para la jugabilidad

---

## Sprint #4
Sprint #4

Implementación de la sección de Resultados globales de la Sala de Juegos.

Se creó una nueva página llamada:
~~~ 
ng g  c components/Resultados
~~~ 
En esta sección se muestran tablas dinámicas conectadas a Supabase con los resultados almacenados de cada juego:

- Ahorcado
- Mayor o Menor 🃏
- Atrapa al Emoji 😈
- Preguntados ❓

Cada tabla muestra:

- Usuario que jugó
- Puntaje / desempeño
- Errores o aciertos
- Tiempo de partida
- Fecha del resultado

Se implementaron consultas ordenadas para mostrar el ranking desde el mejor desempeño al peor utilizando:

- .order()
- Signals de Angular
- Consultas async a Supabase

Juegos :

- Ahorcado → mayor puntaje y menor cantidad de errores
- Mayor o Menor → mayor cantidad de aciertos
- Preguntados → mayor cantidad de respuestas correctas
- Juego propio → mayor cantidad de puntos

También se implementaron:

Guards de rutas
Navegación protegida, Componentes standalone, Signals y Computed para manejo reactivo del estado , Integración completa entre frontend y backend con Angular + Supabase

## Sprint #5
Incorporación de una **encuesta** con validaciones (nombre, apellido, edad entre 18 y 99 años, teléfono solo números máximo 10 dígitos, 3 preguntas con distintos controles: textbox, radiobutton y select). Respuestas guardadas en la base de datos identificando al usuario. Sección de **resultados de encuestas** visible únicamente para usuarios administradores mediante guard. **Animaciones de transición** entre componentes con fade + slide.

# SalaJuegos

This project was generated using Angular CLI version 21.2.7.

## Development server

```bash
ng serve