# Check available disk space
MIN_SPACE_MB=500
available_space=$(df -m /var/www | awk 'NR==2 {print $4}')
if [ $available_space -lt $MIN_SPACE_MB ]; then
    echo "Not enough disk space. Required: ${MIN_SPACE_MB}MB, Available: ${available_space}MB"
    exit 1
fi

# Install Deps
echo "Installing dependencies..."
npm install || { echo "Failed to install dependencies"; exit 1; }

# Clean dist
echo "Cleaning dist directory..."
rm -rf dist

# Build
echo "Building application..."
npm run build || { echo "Failed to build application"; exit 1; }

# Clean exposed nginx file
echo "Cleaning nginx directory..."
rm -rf /var/www/gk5-garage/*

# Copy built output
echo "Copying build files to nginx directory..."
cp -r ./dist/* /var/www/gk5-garage/

echo "Restarting Nginx"
sudo systemctl restart nginx || { echo "Failed to restart Nginx"; exit 1; }

echo "Restarting PM2"
pm2 restart ecosystem.config.cjs || { echo "Failed to restart PM2"; exit 1; }

echo "Deployment completed successfully!"