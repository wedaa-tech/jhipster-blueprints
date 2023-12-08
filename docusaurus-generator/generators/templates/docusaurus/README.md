# <%= applicationName %> prototype

This is a docusaurus application prototype, generated using WeDAA. You can find documentation and help at -
- [WeDAA Docs](https://www.wedaa.tech/docs/introduction/what-is-wedaa/)
- [Docusaurus Docs](https://docusaurus.io/docs/category/guides)

## Prerequisites

- Node version >= 18
- npm version >= 9.6

## Project Structure

This is a standard Docusaurus application, hence it follows same project structure.

```
├── blog (Blogs in Markdown files)
├── docs (Docs in Markdown files)
├── src (React pages)
├── static (static assets like images, videos, etc)
├── README.md
├── docusaurus.config.js (docusaurus project configurations)
├── package.json
└── sidebars.js (Sidebar configuration)
```

## Get Started

In the terminal, run the following command to install all the required dependencies for the Docusaurus documentation site:

```bash
npm install && npm run build
```

After the dependencies are installed, start the local development server using the following command:
```bash
npm run serve
```

Once the server is up and running, open your web browser and visit http://localhost:<%= serverPort %>/ to see the locally running Docusaurus documentation site.
