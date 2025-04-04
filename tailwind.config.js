/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#fde7ec",
                    100: "#fbcfd8",
                    200: "#f8a5b4",
                    300: "#f47b90",
                    400: "#f1526d",
                    500: "#de4c73", // Base color
                    600: "#c74466",
                    700: "#b03b59",
                    800: "#99324c",
                    900: "#82293f",
                    950: "#6b202f",
                },
                secondary: {
                    50: "#eef9fa",
                    100: "#d7f1f5",
                    200: "#b1dce3",
                    300: "#8ac6d1",
                    400: "#63b0bf",
                    500: "#4a97a6", // Adjusted for consistency
                    600: "#3b7b86",
                    700: "#2d5f66",
                    800: "#1f4346",
                    900: "#112727",
                    950: "#081313",
                },
            },
        },
    },
    plugins: [],
};
