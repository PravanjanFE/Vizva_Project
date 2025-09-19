export const sizes = {
  xs: "480",
  sm: "640",
  md: "768",
  lg: "1100", //1024
  xl: "1280",
  "2xl": "1536",
  "3xl": "1500",
};

export const breakpoint = (n) => {
  const bpArray = Object.keys(sizes).map((key) => [key, sizes[key]]);

  const [result] = bpArray.reduce((acc, [name, size]) => {
    if (n === name) return [...acc, `@media (min-width: ${size}px)`];
    return acc;
  }, []);
  return result;
};
