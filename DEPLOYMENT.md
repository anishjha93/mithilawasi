# Deploying Mithila Heritage to Google Cloud Platform (GCP)

This guide outlines the steps to deploy your Next.js application to a GCP Compute Engine VM instance, served via Nginx with a free SSL certificate from Let's Encrypt.

## Prerequisites
1.  **Google Cloud Account**: Active account with billing enabled.
2.  **Domain Name**: Purchased from a registrar (e.g., Google Domains, GoDaddy).
3.  **SSH Access**: Ability to SSH into your VM (GCP Console provides a browser-based SSH terminal).

---

## Step 1: Create a VM Instance
1.  Go to the **Google Cloud Console** > **Compute Engine** > **VM instances**.
2.  Click **Create Instance**.
3.  **Name**: `mithila-web-server` (or your choice).
4.  **Region**: Select a region close to your target audience (e.g., `asia-south1` for Mumbai).
5.  **Machine Type**: `e2-medium` (2 vCPU, 4GB memory) is recommended for Next.js builds. You can downgrade to `e2-micro` later if traffic is low, but builds might fail on micro instances due to low RAM.
6.  **Boot Disk**:
    *   Operating System: **Ubuntu**
    *   Version: **Ubuntu 20.04 LTS** or **22.04 LTS**
    *   Disk Size: **20 GB** (Standard Persistent Disk)
7.  **Firewall**: Check both boxes:
    *   [x] Allow HTTP traffic
    *   [x] Allow HTTPS traffic
8.  Click **Create**.

## Step 2: Configure Static IP (Optional but Recommended)
1.  Go to **VPC Network** > **External IP addresses**.
2.  Find the IP address attached to your new VM.
3.  Click "Ephemeral" and change it to **Static**.
4.  Name it (e.g., `mithila-ip`).

## Step 3: DNS Setup
1.  Go to your Domain Registrar's dashboard.
2.  Create an **A Record**:
    *   **Host/Name**: `@` (root)
    *   **Value**: Your VM's External IP Address.
3.  Create a **CNAME Record** (optional for www):
    *   **Host/Name**: `www`
    *   **Value**: Your domain name (e.g., `mithilaheritage.com`).

---

## Step 4: Server Setup (Automated)

1.  SSH into your VM (click the **SSH** button in the GCP Console).
2.  Run the following commands to download and execute the setup script.
    *   *Note: Replace `your-repo-url` with your actual GitHub repository URL.*

```bash
# Update and install git
sudo apt update && sudo apt install -y git

# config git
git config --global user.name "Anish Jha"
git config --global user.email "anishjha93@gmail.com"

# Clone your repository
git clone https://github.com/anishjha93/mithilalegacy.git mithila

# Enter the directory
cd mithila

# Create the setup script
nano setup.sh
```

3.  Paste the content of the `setup.sh` script (provided below) into the editor.
4.  Save and exit (Ctrl+O, Enter, Ctrl+X).
5.  Make it executable and run it:

```bash
chmod +x setup.sh
./setup.sh
```

---

## Step 5: Manual Nginx & SSL Configuration (If Script Fails)

If you prefer to do it manually or if the script encounters issues:

### 1. Install Dependencies
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### 2. Build and Start Application
```bash
cd ~/mithila
npm install
npm run build
pm2 start npm --name "mithila" -- start
pm2 save
pm2 startup
```

### 3. Configure Nginx
Create a config file: `sudo nano /etc/nginx/sites-available/mithila`

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com; # REPLACE THIS

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/mithila /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Setup SSL
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Updating the Site
When you push changes to GitHub, update the server by running:

```bash
cd ~/mithila
git pull
npm install
npm run build
pm2 restart mithila
```

## Troubleshooting

### SSL Error: "Timeout during connect (likely firewall problem)"
If Certbot fails with this error, it means the Google Cloud Firewall is blocking the connection.
1.  Go to **GCP Console** > **VM instances**.
2.  Click on your instance configuration (the name).
3.  Click **Edit** at the top.
4.  Scroll down to **Firewall**.
5.  Ensure **Allow HTTP traffic** and **Allow HTTPS traffic** are checked.
6.  Click **Save**.
7.  Run the SSL command again: `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`

### Advanced Firewall Checks
If the GCP Firewall is enabled but it still fails:
1.  **Check Internal Firewall (UFW)**:
    Run this on the VM: `sudo ufw status`
    If it says "active", run: `sudo ufw allow 'Nginx Full'`
2.  **Verify Nginx is Listening**:
    Run: `curl -I http://localhost`
    If you see `HTTP/1.1 200 OK` (or 301/404), Nginx is working locally, so the issue is definitely the external GCP Firewall.
