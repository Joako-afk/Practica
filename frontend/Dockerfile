FROM node:22-alpine

WORKDIR /app

# Dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Vite por defecto corre en 5173
EXPOSE 5173

# Dev server de Vite accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
