export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            screens: {
                'lg-land': { raw: '(min-width: 700px) and (orientation: landscape)' },
            },
        },
    },
    plugins: [],
};
