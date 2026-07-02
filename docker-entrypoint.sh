set -e

npx prisma migrate deploy

exec node server.js