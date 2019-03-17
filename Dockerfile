# --- Release with Alpine ----
FROM node:10-alpine
# Create app directory
WORKDIR /app

COPY package*.json ./

# Install app dependencies
RUN npm install --only=production

COPY src /app 
#CMD ["serve", "-s", "dist", "-p", "8080"]

EXPOSE 8080

CMD ["node", "app.js"]