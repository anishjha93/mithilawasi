#!/bin/bash

# Mithila Heritage - Server Setup Script
# Run this on your fresh Ubuntu 20.04/22.04 VM

# 1. Update System
echo "Updating system..."
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js (v20)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install Nginx and Certbot
echo "Installing Nginx and Certbot..."
sudo apt install -y nginx certbot python3-certbot-nginx

# 4. Install PM2
echo "Installing PM2..."
sudo npm install -g pm2

# 5. Setup Project
echo "Setting up project..."
# Assumes you are already in the project directory (mithila)
npm install
echo "Building Next.js app..."
npm run build

# 6. Start with PM2
echo "Starting application..."
pm2 start npm --name "mithila" -- start
pm2 save
pm2 startup | tail -n 1 | bash

# 7. Configure Nginx
echo "Configuring Nginx..."
read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME

sudo tee /etc/nginx/sites-available/mithila > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Site
sudo ln -sf /etc/nginx/sites-available/mithila /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and Restart Nginx
sudo nginx -t
sudo systemctl restart nginx

# 8. SSL Setup
echo "Starting SSL setup..."
echo "Ensure your DNS A record points to this server's IP address!"
read -p "Are your DNS records propagated? (y/n) " DNS_READY

if [ "$DNS_READY" == "y" ]; then
    sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME
else
    echo "Skipping SSL setup. Run 'sudo certbot --nginx' manually later."
fi

echo "Setup Complete! Visit https://$DOMAIN_NAME"
