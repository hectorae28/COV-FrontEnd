# COV Frontend

Este proyecto está planeado para efectuar la reestructuración de la página del colegio de odontólogos de Venezuela.

## Stack

 - "react": "^19.0.0"
 - "react-dom": "^19.0.0"
 - "next": "15.2.0"

## Comandos de interés

Para iniciar el proyecto colocarse en la raíz de la carpeta donde se clonó el repositorio y ejecutar el siguiente comando: `docker-compose up --build` y entrar en la dirección: `http://localhost:3000`

En caso de querer refrescar los contenedores (eliminar y volver a crearlos), ejecutar: `docker-compose down` `docker-compose up --build`

Crea un archivo `.env` basado en el ejemplo (si existe) o con las siguientes variables mínimas:
   ```
    NEXT_PUBLIC_BACK_HOST=http://localhost:8000
    NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
    AUTH_API_URL=http://localhost:8000/api/v1/usuario/token/
    NEXTAUTH_SECRET=e67b6c5a3f7e4e91b2c9d3f9a5d9f1e4798c7a5c0e2f3d4b5a6c7e8f9d0b1a2c
    AUTH_API_URL_REFRESH=http://localhost:8000/api/v1/usuario/token/refresh/
    NEXT_REDIRECT=http://localhost:3000/
    NEXTAUTH_URL=http://localhost:3000
   ```
