# Guia de Hospedagem na Hostinger (De LeOn)

O seu projeto é um site estático moderno (HTML5, CSS3, JavaScript e Assets), o que significa que ele pode ser hospedado em **qualquer plano da Hostinger** (Hospedagem Compartilhada, WordPress, Cloud ou VPS) de forma simples e direta via **Gerenciador de Arquivos** ou **FTP / Git**.

---

### Opção 1: Upload via Gerenciador de Arquivos do hPanel (Mais Rápido)

1. Acesse seu painel **Hostinger (hPanel)**: [https://hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Vá em **Sites** e clique em **Gerenciar** ao lado do seu domínio.
3. No menu lateral, clique em **Arquivos** > **Gerenciador de Arquivos** (File Manager).
4. Abra a pasta **`public_html`**.
5. Se houver um arquivo `default.php` ou de boas-vindas na pasta `public_html`, você pode removê-lo.
6. Faça o upload dos seguintes arquivos e pastas para dentro de **`public_html`**:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `.htaccess` (opcional, configurado para compressão Gzip e cache)
   - Pasta `assets/` (com todas as imagens e favicons)

---

### Opção 2: Hospedagem com Node.js na Hostinger (Se desejar rodar o `server.js`)

Se você possui um plano **VPS** ou plano de Hospedagem Hostinger com suporte a **Node.js**:
1. Faça o upload de todo o diretório do projeto (`package.json`, `server.js`, `index.html`, `styles.css`, `script.js`, pasta `assets/`).
2. No painel Node.js da Hostinger, selecione:
   - **Versão do Node**: 18 ou 20+
   - **Arquivo de Entrada (Application Startup File)**: `server.js`
3. Execute o comando `npm install` para instalar o `express`.
4. Inicie a aplicação no painel.

---

### Estrutura de Arquivos para o `public_html`:

```text
public_html/
├── .htaccess
├── index.html
├── script.js
├── styles.css
└── assets/
    ├── ai_project_1.jpg
    ├── ai_project_2.jpg
    ├── ai_project_3.jpg
    ├── favicon-32.png
    ├── favicon-192.png
    ├── favicon-512.png
    └── tablet.png
```
