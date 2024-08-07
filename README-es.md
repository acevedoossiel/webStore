# Web Store (plantilla)
README disponible en [English](README.md)

![License](https://img.shields.io/github/license/acevedoossiel/webStore)

![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)


## Descripcion
Este repositorio proporciona una plantilla para construir una aplicación web usando Node.js con Express para el backend, MongoDB para la base de datos y React para el frontend

## Prerequisitos
- Node v20.16.0
- pnpm/npm (preferentemente pnpm) 
- MongoDB

## Instalacion
```bash
# Clonar repositorio
  git clone https://github.com/acevedoossiel/webStore.git

# Instalar dependencias de backend
  cd server
  pnpm install

# Instalar dependencias de frontend
  cd cliente
  pnpm install

# Variables de entorno
 - Crear un archivo `.env`  en el directorio "cliente" y agregar las variables:
    * PORT=4200

```
## Uso
```bash
# Iniciar el servidor backend usando
  cd server
  pnpm run start:dev

# Iniciar el frontend
  cd cliente
  pnpm start
```

## Licencia
Este proyecto tiene una licencia de tipo MIT - ver [LICENCIA](LICENSE) para los detalles.
