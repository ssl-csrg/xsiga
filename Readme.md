# XSIGA

Un proyecto de información semántica y social sobre el Sistema de Información de Gestión Académica de la Universidad Técnica Federico Santa María

## Acerca de

SIGA es un software de gestión de información académica para alumnos y profesores de la universidad. Su principal objetivo es controlar la inscripción de asignaturas y mantener el avance curricular de los alumnos. A grandes rasgos, estas son metas que SIGA alcanza con éxito y la intención de este proyecto no es criticar las decisiones de diseño tomadas a lo largo de su desarrollo.

XSIGA (por SIGA Extendido) es un proyecto independiente que tiene por objetivo entregarle a los estudiantes información adicional a la que presta el sistema, ingresada y calificada por los mismos estudiantes. Un aporte a la interacción de los usuarios con la plataforma y con el resto del estudiantado. Esta información se inyecta sobre la información existente en el sistema, de modo de ser útil en el contexto.

## Obtener el software

La última versión estable de la extensión para Google Chrome o Chromium se encuentra disponible de forma gratuita en [Chrome Webstore](https://chrome.google.com/webstore/detail/xsiga/nnffngnnipoccomecgokkoghkbabhpdc). También puede seguir las instrucciones de la siguiente sección para obtener una versión desempaquetada, lo que le permitirá utilizar las nuevas características antes de que estén disponibles en la tienda.

## Aviso Legal

Este software es un trabajo independiente creado por y para estudiantes. No cuenta con el apoyo o la autorización de ninguna autoridad de la Universidad Técnica Federico Santa María.

Los principios de su desarrollo son los siguientes:

* El software no interferirá ni remplazará ninguna interacción normal del usuario con SIGA.
* El software no almacenará ningún tipo de información personal o de identificación del usuario.

Todo el código fuente de la aplicación se encuentra disponible para su escrutinio por parte de los estudiantes en pos de que estos principios se cumplan siempre.

## Requisitos para el Desarrollo

La extensión debe correr sobre cualquier versión moderna de Chrome o Chromium, pero se recomienda una versión sobre v44, para aprovechar las mejoras en términos de empaquetamiento.

Para construir la extensión, se necesita un entorno NodeJS v0.12.7 o superior. Al clonar el repositorio, vaya al directorio y ejecute

    npm install -g gulp
    npm install
    gulp

Esto creará la carpeta `dist/unpacked`, que puede ser cargada en el modo de desarrollador de Google Chrome para poder utilizar la extensión sin empaquetar.

## Colaboración

XSIGA es un proyecto que queda en manos de todos los alumnos de la UTFSM. Para colaborar en el desarrollo del software, se puede *forkear* este repositorio e ingresar sus modificaciones a través de *pull request*, las que serán revisadas siguiendo los parámetros establecidos en el [documento de colaboración](CONTRIBUTING.md) y luego añadidas al proyecto final que será distribuído a través de Chrome Webstore.
