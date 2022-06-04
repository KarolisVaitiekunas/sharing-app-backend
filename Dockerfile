FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/screen-share"

RUN npm install
RUN npm install prisma@^3.13.0 -g

COPY . .

EXPOSE 3001


# RUN prisma generate
# RUN chmod +x ./startup.sh
# CMD ["./startup.sh"]
