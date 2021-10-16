module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        tambo: "#A74A93",
        oxxo: "#C22521",
        listo: "#FA9E1B",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
