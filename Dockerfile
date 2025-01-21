# Step 1: Build the application
FROM node:20.11.1-slim AS builder
WORKDIR /app

# Copy package.json separately to leverage Docker cache
COPY package.json ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
ARG ENV_NAME
COPY . .
RUN if [ "$ENV_NAME" = "production" ]; then rm .env.development && mv .env.production .env ; fi
RUN if [ "$ENV_NAME" = "develop" ]; then rm .env.production && mv .env.development .env && echo "arg: "$ENV_NAME ; fi

# Build the application
RUN yarn build && \
    # Remove dev dependencies and unnecessary files
    yarn install --production --ignore-scripts && \
    yarn cache clean && \
    rm -rf /app/src /app/tests /app/node_modules/.cache

# Step 2: Set up the production environment
FROM nginx:stable-alpine

# Copy built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Uncomment and configure the nginx configuration file if necessary
COPY .cicd/nginx.conf /etc/nginx/conf.d/default.conf

# Add a non-root user for better security
#RUN adduser -D -g '' nginxuser && \
#    chown -R nginxuser:nginxuser /usr/share/nginx/html

# Switch to the non-root user
#USER nginxuser

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
