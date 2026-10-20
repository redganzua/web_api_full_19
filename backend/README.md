# Tripleten web_project_around_express

Proyecto de configuración de un servidor utilizando **Node + Express**. Configuración de archivos en formato modular para no sobrecargar el archivo de entrada que es `app.js` utilizando carpeta de nombre convencional *"routes"* donde se encontrarán todos los `routers.js` necesarios para cualquier tipo de solicitud.

Se ha configurado una base de datos *"aroundb"* utilizando `mongoDB` y se han creado dos *collections*: *users* y *cards* que contienen la información correspondiente de cada modelo o *Schema*. La estructura del proyecto también se modificó para incluir una carpeta *models* y una carpeta *controllers*, de esta manera la carpeta *routes* simplemente se encarga de delegar las funciones de controlador *(handlers)* a *controllers*, mientras que *models* se encarga de validar los respectivos *Schemas* de cada usuario y cada tarjeta antes de procesar una solicitud de creación.

La autenticación de usuarios ya es funcional. De momento no hay ningún enlace a un dominio personalizado.