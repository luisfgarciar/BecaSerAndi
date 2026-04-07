# Beca Ser ANDI — Animation Playground 🎓

Una animación web interactiva que representa el camino de aprendizaje de un estudiante hasta obtener la **Beca Ser ANDI**.

## Demo

Abrí `index.html` en tu navegador. Sin servidor, sin dependencias.

## Qué vas a aprender

| Concepto | Dónde aparece |
|---|---|
| Estructura HTML semántica | `index.html` |
| Variables CSS y animaciones (`@keyframes`) | `style.css` |
| Promesas y `async/await` | `script.js` |
| Manipulación del DOM | `script.js` |
| Diseño responsivo básico | `style.css` |

## Estructura del proyecto

```
BecaSerAndi/
├── index.html   # Estructura de la página
├── style.css    # Estilos y animaciones
├── script.js    # Lógica de la animación
└── README.md    # Este archivo
```

## Cómo funciona

1. Al hacer clic en **Iniciar**, el personaje recorre tres etapas.
2. Cada etapa usa una **Promise** que espera a que la transición CSS termine.
3. Al llegar a la meta, se dispara la animación de confetti generada dinámicamente con JS.

## Retos para extenderlo

- [x] Agregar sonidos con la Web Audio API
- [x] Guardar el progreso en `localStorage`
- [x] Hacer cada etapa interactiva (mini-quiz antes de avanzar)
- [x] Publicarlo en **GitHub Pages** (Settings → Pages → Deploy from branch `main`)
- [x] Reemplazar el emoji por un sprite animado con CSS

## Publicar en GitHub Pages

```bash
# En la configuración del repo → Pages → Source: main / root
# La URL quedará: https://<tu-usuario>.github.io/BecaSerAndi
```
