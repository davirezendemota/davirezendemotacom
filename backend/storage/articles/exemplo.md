---
title: "Artigo de exemplo"
date: 2025-02-27T12:00:00
summary: "Um resumo curto do artigo de exemplo para a feature de artigos."
---

# Introdução

Este é um **artigo de exemplo** em Markdown, armazenado em `backend/storage/articles/`.

## Funcionalidades

- Frontmatter com `title`, `date` e `summary`
- Conteúdo em Markdown
- Slug = nome do arquivo sem `.md` (ex.: `exemplo`)

## Conclusão

O backend FastAPI sincroniza os metadados para o PostgreSQL e serve o conteúdo sob demanda.
