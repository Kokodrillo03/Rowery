module.exports = (options, webpack) => {
    const lazyImports = [
        '@nestjs/microservices/microservices-module',
        '@nestjs/websockets/socket-module',
    ];

    return {
        ...options,
        entry: './src/main.ts',  // Make sure this points to your main file
        target: 'node',
        externals: [],
        output: {
            ...options.output,
            libraryTarget: 'commonjs2',
            filename: 'main.js',
        },
        plugins: [
            ...options.plugins,
            new webpack.IgnorePlugin({
                checkResource(resource) {
                    if (lazyImports.includes(resource)) {
                        try {
                            require.resolve(resource);
                        } catch (err) {
                            return true;
                        }
                    }
                    return false;
                },
            }),
        ],
        optimization: {
            minimize: false,
            nodeEnv: false
        },
        resolve: {
            ...options.resolve,
            extensions: ['.ts', '.js', '.json'],
        },
    };
};
