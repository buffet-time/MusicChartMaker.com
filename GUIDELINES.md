# Code Style Guidelines

General guidelines for contributing

Heavily preferred for you to use VSCode so ESLint, Prettier, and Volar (vue 3 tool) work properly

## JS

- use Array functions instead of standard `for` loops
- The way ESLint should in general be followed
  - usage of `!` to ensure something exists is intended to only be used with an ESLint ignore to make sure 100% you know what you're doing
  - Explicit `any` is allowed if it can be justified. Implicit never allowed.

## CSS

(This is also a hierarchy, prefer using no computation if possible.)

- If you don't need to compute anything use UnoCSS classes.

- If you need to do computation ([docs here](https://vuejs.org/guide/essentials/class-and-style.html))
  - but Tailwind classes still work use Class Bindings\
    `:class="blah"`

  - and Tailwind classes don't work use Style Bindings\
    `:style=""`

## HTML

- Don't ever use `<br>`

- If there is an element that can be used instead of `<div>` use it.
