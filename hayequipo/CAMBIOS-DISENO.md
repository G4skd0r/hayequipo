# Pase de diseño — Hay Equipo

Rama `rediseno`: pase de ingeniería de diseño sobre la web. Sin cambios de
contenido, paleta ni estructura. `main` no se tocó.

Para verlo: el preview deploy de Vercel de esta rama, o local con
`npm run dev`.

**Sin verificar localmente**: en el entorno donde se escribió esto ni `tsc`
ni `next dev` llegaron a correr (I/O frenado). El build de Vercel es la
primera validación real.

## Qué cambió

| Antes | Después | Por qué |
| --- | --- | --- |
| Ningún botón tenía `:active` | `.he-press` → `scale(0.97)` en 160ms | El feedback va en el pointer-down, no en el release. Sin esto la interfaz se siente muerta. |
| Modal aparecía y desaparecía de golpe (`if (!open) return null`) | Entrada y salida animadas, montaje sostenido durante la salida | Un elemento que se esfuma sin transición se lee como un bug. |
| — | Mobile: hoja arrastrable con velocidad, rubber-band arriba y descarte por flick | Entra y sale por el mismo camino. Al soltar, la animación sigue desde donde quedó el dedo: no hay costura entre gesto y animación. |
| Modal sin trampa de foco ni retorno del foco | Foco entra al diálogo, Tab cicla adentro, al cerrar vuelve al botón que lo abrió | Con teclado el modal era una trampa: el foco quedaba detrás del backdrop. |
| Easings por defecto de CSS (`transition`) | `--ease-out: cubic-bezier(.23,1,.32,1)`, `--ease-drawer: cubic-bezier(.32,.72,0,1)` | Las curvas nativas son blandas; no tienen la pegada que hace que se lea intencional. |
| `transition` sin propiedad (Tailwind, todo) | `transition-colors duration-150`, `transition-[filter,opacity]` | Animar propiedades sueltas evita repintados y sorpresas. |
| Header con borde fijo `border-b` | Header sticky translúcido, borde que aparece recién al scrollear | El contenido pasa por debajo del vidrio. El borde solo existe cuando hay algo que separar. |
| Nav: solo cambio de color al hover | Subrayado que crece desde el centro, con `@media (hover: hover)` | En touch el hover se dispara al tocar: falso positivo. |
| Tiers de donación: `group-hover:opacity-85` | `.he-lift`: sube 3px + sombra al hover, se hunde al presionar | La opacidad sobre un bloque de color se lee como "se apagó", no como "es tocable". |
| `letter-spacing` heredado, un solo `tracking-tight` | `.he-display` (-0.03em), `.he-h2` (-0.022em), `.he-h3` (-0.012em), `.he-body` (0) | El tracking es específico del tamaño. Un valor único siempre está mal en algún lado. |
| Títulos sin control de corte | `text-wrap: balance` en títulos, `pretty` en párrafos | Evita la viuda de una palabra sola en la última línea. |
| Hero sin entrada | Escalonado de 60ms entre eyebrow, título, bajada y botones | Cascada corta: más de ~80ms y la página se siente lenta en vez de viva. |
| Manifiesto: tipografías al azar, podía repetir la misma dos veces | Recorrido fijo por la lista + blur de 1.5px durante el ciclo | Repetir se lee como que se colgó. El blur funde una tipografía con la siguiente en vez de mostrar dos palabras superpuestas. |
| Manifiesto y sol giratorio ignoraban `prefers-reduced-motion` | Sol quieto, tipografía final directo, transiciones a fade | Menos movimiento no es cero feedback: se conservan opacidad y color, se saca el desplazamiento. |
| Sin `prefers-reduced-transparency` ni `prefers-contrast` | Header y backdrop se vuelven sólidos; campos con borde definido | Son tres señales independientes del sistema, no una sola. |
| `input:focus { outline }` | `:focus-visible` en todos los controles | El anillo es para quien navega con teclado, no un castigo para quien hace click. |
| Bandera desde `cdn.jsdelivr.net` (twemoji) | `/bandera-ar.svg` local | Un request a un tercero en el medio de un `<h2>`, con lo que eso implica en render y privacidad. |
| Botón "Enviando..." cambiaba de ancho | `min-w-[220px]` + crossfade con blur (`.he-swap`) | El botón cambiaba de tamaño justo en el momento en que el usuario lo está mirando. |
| `select` nativo, distinto a los `input` | `.he-select` con chevron propio | Cosas que hacen lo mismo tienen que verse igual. |
| Sin `autocomplete` | `name`, `email`, `address-level1/2` | El navegador ya sabe estos datos; pedirlos de nuevo es fricción gratis. |
| Error del form sin rol | `role="alert"`, éxito con `role="status"` | El lector de pantalla no anunciaba ni el error ni el envío exitoso. |
| Sin salto al contenido | Link "Saltar al contenido" que aparece al tabular | Primera parada del teclado en cualquier página. |
| Anclas `#donar` quedaban debajo del header | `scroll-margin-top` calculado con `--he-header-h` | El header sticky se comía el título de destino. |
| — | `viewport.themeColor` | En mobile la barra del navegador toma el color del fondo. |

## Notas

- **Hero desktop sin CTA.** En mobile hay tres botones; en desktop solo un link
  chico "Quiénes somos". No lo toqué porque cambia la jerarquía del contenido,
  no el diseño — pero es el hueco más grande que quedó.
- El resaltado amarillo, la paleta, los textos y la estructura quedaron
  intactos.
- `lib/sheets.ts` y el flujo de donaciones no se tocaron.
