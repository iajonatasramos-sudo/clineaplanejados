# Clínea Planejados — Site institucional

Landing page de página única (one-page) para a marcenaria **Clínea Planejados**,
especialista em clínicas e consultórios de alto padrão em São Paulo.

## Estrutura

```
site/
├── index.html          # Página completa (HTML semântico, PT-BR)
├── styles.css          # Estilos (design system em CSS custom properties)
├── main.js             # Interações (nav, reveals, galeria/lightbox, menu mobile)
└── assets/
    ├── logo/           # Logotipo (clinea-bone.png) e favicon
    └── portfolio/      # Fotos dos projetos: daniela / evelyn / kang
```

## Como visualizar localmente

Abra o `index.html` no navegador, ou rode um servidor simples:

```bash
cd site && python3 -m http.server 8000
```

Depois acesse http://localhost:8000

## Design

- **Direção:** sofisticado e clean, monocromático (preto · cinza · branco),
  alternando seções escuras e claras para não ficar pesado.
- **Cores:** preto `#0c0c0d`, grafite `#151517`, cinza `#9b9ba1`, branco `#f2f2f3`.
- **Hero:** imagem de fundo full-bleed com texto centralizado por cima.
- **Tipografia:** Cormorant Garamond (títulos) + Jost (texto), via Google Fonts.
- **CTA principal:** Solicitar orçamento (WhatsApp).

### Trocar a imagem do hero

A imagem atual (`assets/hero/hero.jpg`) é um **placeholder de banco de imagens**,
já convertido para preto e branco. Para usar uma foto sua, substitua esse arquivo
por uma imagem horizontal (ideal ~1920px de largura). Fica melhor em tons escuros;
se quiser, deixe em preto e branco para combinar com o restante.

## Contato configurado

- WhatsApp: +55 11 94539-9139 (`https://wa.me/5511945399139`)
- Instagram: [@clinea.planejados](https://instagram.com/clinea.planejados)
- Região: São Paulo

## Publicar (hospedagem gratuita)

Por ser um site estático, pode ser publicado em segundos:

- **Netlify:** arraste a pasta `site/` em app.netlify.com/drop
- **Vercel:** `vercel` na pasta `site/`
- **GitHub Pages:** suba a pasta em um repositório e ative Pages

Para domínio próprio (ex.: `clineaplanejados.com.br`), aponte o DNS para o serviço escolhido.
