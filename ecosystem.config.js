module.exports = {
    apps: [
        {
            name: 'paddle-gateway-dev',
            script: 'npm',
            args: 'run dev',
            watch: true,
            env: {
                NODE_ENV: 'production',
            },
            merge_logs: true,
        }
    ]
};
