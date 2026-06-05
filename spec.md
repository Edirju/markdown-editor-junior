# 01 - Editor de texto MArkdown Interactivo

Actúa como un Senior Software Architect y experto en el ecosistema de CodeMirror 6 y Astro. Tu objetivo es redactar un documento de especificación técnica detallado para desarrollar un "Clon de Editor de Obsidian" utilizando Spec-Driven Development (SDD).

## Contexto del Proyecto

Queremos un editor de texto Markdown interactivo integrado en una isla de Astro (React + TypeScript). La característica principal es el "Live Preview": el editor debe renderizar visualmente el Markdown (ocultar símbolos #, **, etc.) en tiempo real, excepto en la línea donde se encuentra el cursor del usuario.

## Estructura tecnológica obligatoria

- Framework: Astro (Arquitectura de islas).
- Editor Core: CodeMirror 6 (Modular).
- Estado Global: Nanostores (comunicación entre el editor y la UI de Astro).
- Estilos: Tailwind CSS + CSS Puro para el scroll y el renderizado sintáctico.

Por favor, genera la especificación técnica incluyendo los siguientes apartados:

1. Arquitectura de Componentes: Define la jerarquía entre AppLayout.astro, EditorIsland.tsx y cómo se inicializan las extensiones de CodeMirror.
2. Lógica del Live Preview (The Core): Explica detalladamente cómo usar ViewPlugin, Decorations y StateFields de CodeMirror 6 para identificar nodos del syntaxTree y aplicar clases de CSS que oculten la sintaxis Markdown basándose en la posición del cursor (selection.main.head).
3. Sistema de Extensiones: Diseña un sistema modular donde cada función (Headers, Bold/Italic, Task Lists, Wiki-links) sea una extensión independiente. Define la interfaz de estas extensiones.
4. Gestión de Estado (Schema): Define el esquema de las Nanostores para:  

-- El contenido del documento actual.
-- Metadatos de la nota (título, fecha).
-- Estado de la interfaz (modo lectura vs modo edición).

5. Especificación de Estilos: Define una convención de nombres de clases CSS (ej. cm-md-header) y cómo Tailwind se integrará con el "Theme" de CodeMirror para permitir temas Dark/Light.

6. Estrategia de Persistencia: Define un service layer para guardar los cambios en localStorage o IndexedDB de forma asíncrona (Debounce).

7. Hoja de Ruta de Implementación (Fases):

- Fase 1: Setup y Editor básico.
- Fase 2: Motor de Live Preview (Hiding/Showing logic).
- Fase 3: Renderizado de Widgets (Checkboxes y Links).
- Fase 4: Optimización de rendimiento (Viewport rendering).

El tono debe ser técnico, preciso y orientado a objetos, asegurando que el código resultante sea escalable y fácil de testear.
