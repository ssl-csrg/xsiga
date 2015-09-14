# XSIGA

Colección de utilidades para mejorar el Sistema de Gestión Académica de la Universidad Técnica Federico Santa María.

## Introducción

Durante años, la única interfaz a disposición de los alumnos y profesores de la UTFSM para administrar sus ramos ha sido SIGA, un software que sufre de una mala estructuración, lo que lo hace difícil de mantener y mejorar.

SIGA no tiene un API abierto y de hecho, es muy probable que ni siquiera tenga un API cerrado, por lo tanto cualquier información disponible es la que ofrece el mismo sistema, el cual es muy difícil de explorar.

XSIGA (por SIGA Extendido) es un proyecto independiente que tiene por objetivo completar la interfaz de SIGA con herramientas que no hayan sido implementadas y que se pueden crear usando la información existente en la pantalla del usuario.

## Modulos Disponibles

Cada módulo extiende una capacidad actual del sistema y por lo tanto lleva su nombre.

### Avace Curricular

En este módulo, el alumno cuenta con una opción para calcular su **prioridad académica** y simular una prioridad un semestre que tiene calificaciones pendientes.

Para utilizarlo, presiona el botón "Calcular Prioridad" que aparecerá al costado de la opción "Imprimir".

## Requisitos para el Desarrollo

Se necesita un entorno NodeJS v0.12.7 o superior. Al clonar el repositorio, vaya al directorio y ejecute

    npm install
    gulp

Esto creará la carpeta `dist/unpacked-dev`, que puede ser utilizada en el modo de desarrollador de Google Chrome para poder probar la extensión.

Para construir la extensión para su distribución, si cuenta con la llave de distribución, se puede ejecutar el comando

    gulp build:chrome

Lo que creará el archivo `.crx` distribuíble dentro de la carpeta `dist`.

> El archivo que permite la construcción del distribuible de la extensión se encuentra en este momento en poder de [Pablo Albornoz](https://www.github.com/fixmycode). Si usted desea construir su propio distribuíble, ejecute el comando `openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt > xsiga-key.pem` para generar una llave.

## Colaboración

XSIGA es un proyecto que queda en manos de todos los alumnos de la UTFSM. Para colaborar en este proyecto, se puede *forkear* este repositorio e ingresar sus modificaciones a través de *pull request*, las que serán revisadas y luego añadidas al proyecto final que será distribuído a través de Github y las distintas webstores.

Miembros de SSL pueden editar directamente el proyecto, pero sirvase a mostrar sus avances a través de *branching* antes de unirlos a la rama estable.

El proyecto inicialmente está enfocado en Google Chrome pero es preferible encapsular el código de forma que desarrollar extensiones para Firefox o Safari sea sencillo en el futuro.

En cuanto a estilo de programación, para una mejor comprensión entre programadores, se utilizará la [guía de estilo de Javascript](https://google.github.io/styleguide/javascriptguide.xml) de Google como base.

## Qué Sigue?

Algunas ideas que representan un objetivo interesante para continuar este proyecto son:

 * Inscripción de ramos en paralelos no disponibles.
 * Vista imprimible para el horario personal.
 * Calificación pública de profesores (a la RateMyProfessor).

Desafíos técnicos:

 * Permitir al usuario controlar la activación de características.
 * Carga automática de módulos (subpackaging?).
 * Sandboxing de los scripts de segundo plano.
 * Testing e integración continua.

## Créditos

 * Chrome Extension Make Script by [Salsita Software](https://github.com/salsita)
