FROM node:22-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo lo necesario para instalar dependencias
COPY package*.json ./

# Instalamos dependencias (solo producción)
RUN npm install --omit=dev

# Copiamos el resto del código
COPY . .

# Puerto donde corre tu backend (PORT = 5000 en tu .env)
ENV PORT=5000
EXPOSE 5000

# Comando de inicio
CMD ["npm", "start"]
