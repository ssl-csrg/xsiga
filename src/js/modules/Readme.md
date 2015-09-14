# Módulos XSIGA

Los módulos en este directorio son encapsulaciones y se cargan a la plataforma a través de la función `require`. El contenido mínimo de cada módulo se presenta a continuación.

## index.js

Este es el archivo base para la carga del módulo. Se requiere la siguiente estructura:

    module.exports = function(router){
      router.addRoute('cierta_ruta_de_SIGA', init);
    }

Donde init es la función que inicia la acción. De esta manera, XSIGA cargará el módulo cuando la ruta coincida con la solicitada.

## Archivos opcionales

Se puede agregar un archivo `background.js` que se adosará al script de segundo plano de la aplicación.

Todo archivo adicional dentro de la carpeta del módulo puede ser referenciado de forma relativa como si estuviese en el mismo directorio de `background.js`.

Dentro del directorio raíz existe una carpeta `/static` donde se pueden almacenar contenidos comunes para decorar los módulos, como la librería Fundation.
