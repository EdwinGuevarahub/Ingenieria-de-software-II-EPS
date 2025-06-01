# Usar una imagen de Node.js para el entorno de React
FROM node:24-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar dependencias de componentes de React
RUN npm install @mui/x-date-pickers dayjs @mui/material @emotion/react @emotion/styled

# Instalar dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto en el que React corre
EXPOSE 3000

# Suprimir advertencias de deprecación
ENV NODE_OPTIONS="--no-deprecation"

# Comando para iniciar la aplicación en el puerto 80
CMD ["npm", "start"]
