export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            screens: {
                'lg-land': { raw: '(min-width: 700px) and (orientation: landscape)' },
            },
        },
    },
    plugins: [],
};
