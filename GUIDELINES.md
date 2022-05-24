# Code Style Guidelines

General guidelines for contributing

## JS

- use Array functions instead of standard `for` loops

## CSS

(This is also a hierarchy, prefer using no computation if possible.)

- If you don't need to compute anything use Tailwind classes.

- If you need to do computation ([docs here](https://vuejs.org/guide/essentials/class-and-style.html))

  - but Tailwind classes still work use Class Bindings\
    `:class="blah"`

  - and Tailwind classes don't work use Style Bindings\
    `:style=""`

## HTML

- Don't ever use `<br>`

- If there is an element that can be used instead of `<div>` use it.
