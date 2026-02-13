export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            screens: {
                'lg-land': { raw: '(min-width: 900px) and (orientation: landscape) and (max-height: 900px)' },
            },
        },
    },
    plugins: [],
};
