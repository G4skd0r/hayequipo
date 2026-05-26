{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # Hay Equipo \'97 Web institucional\
\
Sitio de Fundaci\'f3n Hay Equipo (formaci\'f3n de l\'edderes con vocaci\'f3n p\'fablica en Argentina).\
\
## Stack\
- Next.js 14 (App Router) + TypeScript\
- Tailwind CSS (clases custom definidas en tailwind.config.ts)\
- Google Sheets como DB (solo formulario de contacto, v\'eda lib/sheets.ts)\
- Deploy en Vercel (push a main = redeploy autom\'e1tico)\
\
## Estado\
- Donaciones: bot\'f3n "Pr\'f3ximamente" (Mercado Pago se activa m\'e1s adelante, no tocar)\
- Formulario Sumate: funcional, guarda en Google Sheets\
\
## Paleta (clases Tailwind custom)\
- he-negro #161616 / he-blanco #F2EDEB / he-amarillo #FFBE00 / he-rojo #ED615F / he-celeste #23A1D5\
- Uso: text-he-negro, bg-he-blanco, border-he-rojo, text-he-negro/70 (opacidad)\
- Identidad: negro dominante, resaltado amarillo (.he-highlight), sol garabateado\
\
## Mapa de archivos\
- app/page.tsx \uc0\u8594  Home\
- app/nosotros/page.tsx \uc0\u8594  Nosotros\
- app/sumate/page.tsx \uc0\u8594  Sumate\
- app/globals.css \uc0\u8594  estilos globales y .he-highlight\
- components/Sun.tsx \uc0\u8594  sol SVG\
- components/Header.tsx, Footer.tsx, SeccionDonacion.tsx, DonacionModal.tsx, FormularioSumate.tsx\
\
## Reglas de trabajo\
- Respuestas concisas, sin explicaciones largas salvo que las pida\
- Espa\'f1ol rioplatense\
- Un commit al final de cada tarea, no por cada archivo\
- No tocar lib/sheets.ts ni el flujo de donaciones salvo pedido expl\'edcito}