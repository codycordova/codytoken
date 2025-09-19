module.exports = {
	apps: [
		{
			name: 'next-app',
			script: 'node_modules/next/dist/bin/next',
			args: 'start -p 3000',
			env: {
				NODE_ENV: 'production'
			}
		},
		{
			name: 'ws-server',
			script: 'node',
			args: 'dist/ws/server.js',
			env: {
				NODE_ENV: 'production',
				WS_PORT: process.env.WS_PORT || '3030'
			}
		}
	]
};
