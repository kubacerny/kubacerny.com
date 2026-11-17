# kubacerny.com — web

Osobní web Jakuba Černého — AI Engineer & Fullstack Developer. Postavený na **Astro 6 + React 19 + Tailwind v4 + MDX**. Provozuje Artewu s.r.o. (truhlářská divize má vlastní web na artewu.com).

## 📁 Struktura projektu

```text
/
├── _server/                      # konfigurace webserverů pro deploy
│   ├── nginx/kubacerny.com.conf
│   └── apache/kubacerny.com.conf
├── bin/
│   ├── deploy.sh                 # deploy skript (nginx/apache detekce)
│   └── process-photos.mjs        # zmenšení fotek před commitem
├── public/                       # statika kopírovaná 1:1 (favicon apod.)
├── src/
│   ├── assets/                   # obrázky importované do .astro/.tsx
│   ├── components/
│   │   ├── BlogCard.astro        # karta projektu v portfoliu
│   │   ├── CtaBanner.astro       # CTA blok na službových stránkách
│   │   ├── Footer.astro
│   │   └── Header.tsx            # navigace (React, dropdown Služby, mobile hamburger)
│   ├── content/
│   │   └── blog/                 # 👉 zde se zakládají portfolio příspěvky (.mdx)
│   ├── content.config.ts         # schema content collections
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── categories.ts         # číselník kategorií portfolia
│   │   └── img.ts
│   ├── pages/
│   │   ├── index.astro           # úvodní stránka
│   │   ├── sluzby/
│   │   │   ├── index.astro       # rozcestník služeb
│   │   │   ├── kubernetes.astro
│   │   │   ├── elasticsearch-rag.astro
│   │   │   ├── spark-data-engineering.astro
│   │   │   └── vyvoj-na-miru.astro
│   │   ├── cenik.astro
│   │   ├── kontakt.astro
│   │   └── portfolio/
│   │       ├── index.astro       # výpis projektů s filtrem
│   │       └── [...slug].astro   # detail projektu
│   └── styles/global.css         # Tailwind v4 + brand theme (modrá + cyan akcent)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## ✍️ Jak přidat portfolio příspěvek

Příspěvky leží v **`src/content/blog/`** jako MDX (URL je `/portfolio/<slug>`). Schema je v [src/content.config.ts](src/content.config.ts).

Podporujeme dva tvary — funguje obojí, slug v URL je stejný:

**A) Krátký post bez vlastních příloh** — jediný soubor:

```text
src/content/blog/nazev-prispevku.mdx
```

**B) Post s vlastními obrázky** — vlastní složka (doporučeno):

```text
src/content/blog/nazev-prispevku/
├── index.mdx
├── detail-1.jpg
└── detail-2.jpg
```

V MDX se na lokální obrázky odkážeš relativně:

```mdx
![Architektura řešení](./detail-1.jpg)
```

### Povinné frontmatter pole

```mdx
---
title: "RAG agent nad interní dokumentací"
description: "Krátký popis pod nadpis, do náhledové karty i meta description."
date: 2026-01-15
category: "ai"                 # "ai" | "infrastruktura" | "vyvoj"
cover: ./photo-01.jpg          # lokální obrázek (vedle index.mdx) NEBO URL
gallery:                       # volitelné, ukáže se dole jako galerie
  - ./photo-01.jpg
  - ./photo-02.jpg
tags: ["RAG", "Elasticsearch"] # volitelné
---
```

Kategorie a jejich popisky (včetně odkazu na související službu) se definují v [src/lib/categories.ts](src/lib/categories.ts).

`cover` a položky v `gallery` můžou být buď **relativní cesta** na obrázek
vedle `index.mdx` (`./photo-01.jpg`) — Astro je sám zoptimalizuje a hashne —
nebo **absolutní URL** na externí obrázek (`https://…`).

> 💡 Velké fotky před commitem zmenši skriptem
> [`bin/process-photos.mjs`](bin/process-photos.mjs) (resize na 1800 px,
> auto-rotace dle EXIF, JPEG 82). Stačí složku s originály dát do
> `src/tmp_realizace_photos/<slug>/` a spustit `node bin/process-photos.mjs`.

Nový příspěvek se sám objeví na `/portfolio`, ve filtru podle kategorie a v sekci „Z portfolia" na homepage (3 nejnovější).

## 🧞 Příkazy

Vše z rootu projektu:

| Příkaz           | Co dělá                                                  |
| :--------------- | :------------------------------------------------------- |
| `pnpm install`   | Nainstaluje závislosti                                   |
| `pnpm dev`       | Dev server na `localhost:4321` (HMR)                     |
| `pnpm build`     | Produkční build do `./dist/`                             |
| `pnpm preview`   | Lokální preview produkčního buildu                       |
| `pnpm deploy`    | Nasadí konfiguraci webserveru (vyžaduje sudo, viz níže)  |
| `pnpm astro ...` | Astro CLI (`astro add`, `astro check`, …)                |

> **Pozn.:** Když přidáš MDX soubor / upravíš `content.config.ts`, dev server **restartuj** — content collection se inicializuje při startu.

## 🚀 Nasazení na server

Předpokládá se, že na serveru je `nginx` **nebo** `apache2` (skript si detekuje, který) a uživatel má `sudo`.

```bash
# 1. checkout do /srv/www
cd /srv/www
git clone <repo-url> kubacerny.com
cd kubacerny.com

# 2. závislosti + build
pnpm install
pnpm build

# 3. nasazení webserver configu (vyžádá si sudo)
pnpm deploy
```

Co skript [bin/deploy.sh](bin/deploy.sh) udělá:

1. Ověří existenci `dist/index.html`.
2. Detekuje webserver podle `/etc/nginx/sites-available` nebo `/etc/apache2/sites-available`.
3. Vezme `_server/<nginx|apache>/kubacerny.com.conf`, nahradí v něm `__WEBROOT__` skutečnou cestou k `dist/` a zapíše do `sites-available/`.
4. Předchozí verzi zazálohuje jako `*.bak.<timestamp>`.
5. Vytvoří/aktualizuje symlink v `sites-enabled/`.
6. Otestuje syntaxi (`nginx -t` / `apache2ctl configtest`).
7. Reloadne službu (`systemctl reload nginx|apache2`).

### Pro Apache jednorázově povol moduly

```bash
sudo a2enmod rewrite headers expires deflate
sudo systemctl reload apache2
```

### HTTPS přes Let's Encrypt

Po prvním nasazení (config zatím poslouchá jen na portu 80):

```bash
# nginx
sudo certbot --nginx -d kubacerny.com -d www.kubacerny.com
# nebo apache
sudo certbot --apache -d kubacerny.com -d www.kubacerny.com
```

Certbot si konfigurák sám upraví a obnovu si zařídí systémovým timerem.

### Aktualizace obsahu (běžný redeploy)

```bash
cd /srv/www/kubacerny.com
git pull
pnpm install   # jen pokud se měnily závislosti
pnpm build
# pnpm deploy NEPOTŘEBUJEME — webserver servíruje stejný dist/
```

Webserver ukazuje na `dist/`, takže stačí znovu sestavit. `pnpm deploy` voláme jen když se mění **konfigurace webserveru** v `_server/`.

## 🎨 Design tokens

Brand paleta a fonty se ladí v [src/styles/global.css](src/styles/global.css) v bloku `@theme`:

- **`brand-*`** — hluboká modrá (důvěryhodnost, stabilita). `brand-600` a tmavší jsou bezpečné pro text na bílé (WCAG AA).
- **`accent-*`** — cyan akcent (svěžest, flexibilita). Používat střídmě: ikony, zvýraznění, detaily. Na bílé používat `accent-600`.
- Nadpisy: **Space Grotesk** (přes utility `font-serif`), text: **Inter**.

Pak jsou dostupné jako `bg-brand-700`, `text-accent-600` apod. v celé aplikaci.
