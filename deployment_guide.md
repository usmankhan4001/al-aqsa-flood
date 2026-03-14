# Deployment Guide: Dokploy + Cloudflare Tunnel (Wildcard)

This guide outlines how to deploy your application to **Dokploy** and expose it using a **Cloudflare Tunnel** with **Wildcard Domain** support.

## Phase 1: Dokploy Application Setup

1.  **Deploy the App**: 
    - In Dokploy, create a new Application from your GitHub repo.
    - Set the **Build Type** to **Docker** (it will use the `Dockerfile` already in the repo).
    - Under **Network**, ensure the application is listening on port **80** (internal Nginx port).
    - **Crucial**: Dokploy typically assigns a domain like `app.dokploy.example.com`. Note down the internal service name or the IP/Port where Dokploy exposes the app.

2.  **Internal Domain**:
    - Assign a internal-only domain in Dokploy if needed (e.g., `al-aqsa.internal`). Dokploy's Traefik will handle this.

## Phase 2: Cloudflare Tunnel Setup

1.  **Create a Tunnel**:
    - Go to the **Cloudflare Zero Trust** dashboard.
    - Navigate to **Networks** > **Tunnels**.
    - Click **Create a Tunnel** and follow the instructions to install `cloudflared` on your server (the same one running Dokploy).

2.  **Add Public Hostnames**:
    - In your Tunnel configuration, go to the **Public Hostname** tab.
    - **Wildcard Entry**:
        - Subdomain: `*`
        - Domain: `yourdomain.com`
        - Service: `http://localhost:80` (or the specific port/IP Dokploy uses for its main entry point/Traefik).
    - **Main Entry Entry**:
        - Subdomain: (empty)
        - Domain: `yourdomain.com`
        - Service: `http://localhost:80`.

## Phase 3: Cloudflare DNS Configuration

1.  **Wildcard CNAME**:
    - In the Cloudflare DNS dashboard for `yourdomain.com`, add a CNAME record:
        - Name: `*`
        - Target: `[your-tunnel-id].cfargotunnel.com`
    - Also add a CNAME for the root:
        - Name: `@`
        - Target: `[your-tunnel-id].cfargotunnel.com`

## Phase 4: Dokploy Domain Mapping

1.  **Map the Wildcard**:
    - Back in Dokploy, go to your application settings.
    - Add the specific domain you want to use (e.g., `al-aqsa.yourdomain.com`).
    - Dokploy's Traefik will recognize the Host header coming through the tunnel and route it to your app.

---

### Troubleshooting 502 Errors

If you see a 502 Bad Gateway:
1.  **Verify Service URL**: Ensure the Tunnel "Service" URL matches the exact address/port where Dokploy is listening. If Dokploy is on a custom Docker network, you might need to use the container name.
2.  **Traefik Port**: Dokploy usually uses Traefik as a reverse proxy on port 80/443. Your tunnel should point to the server's port 80/443.
3.  **No-TLS**: Since Cloudflare Tunnel provides the encryption, you can point the tunnel to the `http` entry point of Dokploy.
