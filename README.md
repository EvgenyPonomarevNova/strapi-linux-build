# Strapi 4 — CMS build workspace

A Strapi CMS workspace with configuration, content APIs and build troubleshooting utilities.

## Stack

Strapi 4.24.1, TypeScript, React 18 and SQLite dependencies. The package currently declares Node.js 18–20; this is a historical project constraint, not a recommendation for a new deployment.

## Local development

Copy `.env.example` to an ignored `.env`, fill in your own development values, then:

```sh
npm ci
npm run develop
```

- `npm run build` — build the admin interface.
- `npm start` — start the built application.
- `src/` — application content and extensions.
- `config/` — server and plugin configuration.

## Status

A retained CMS workspace. Review its older dependency versions before considering a new deployment. No credentials are supplied by this README.

---

[Evgeny Ponomarev](https://github.com/EvgenyPonomarevNova/EvgenyPonomarevNova)
