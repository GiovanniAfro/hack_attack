# Use the official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install BootstrapVue and Bootstrap
RUN npm install bootstrap-vue-next bootstrap

# Copy the application code
COPY . .

# # Build the application
# RUN npm run build

# # Install serve to serve the built app
# RUN npm install -g serve

# Expose port 5000
EXPOSE 5173

# Start the app
CMD ["npm", "run", "dev"]
