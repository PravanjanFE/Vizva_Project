```jsx
<Prompt
  title="sorry this is not allowed"
  message="the operation you are performing isnt a valid one"
  text="click here"
  onClick={() => alert("hehehe")}
  closeable={false}
/>
```

- **title**: this is the title of the prompt
- **message**: a short description
- **text**: the button text in the prompt. if not provided, the prompt will be rendered without a button and will be "CLOSEABLE"
- **href**: a href to be passed if you want a link button
- **onClick**: a function passed if you want a regular button
- **closeable**: indicate if the prompt should be closeable by clicking on the background or the close button

### WORTHY OF CONSIDERATION

- if a href and onClick props is passed, the href prop will be favored over the onClick prop
- the prompt is CLOSEABLE by default
- if a prompt is declared non-closeable, a click on the button closes the prompt
- if no text props is passed, the prompt cannot be declared non-closeable
