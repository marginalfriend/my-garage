export default {
	apps: [
		{
			name: 'gk5-garage-backend',
			cwd: '/root/my-garage',
			script: '/root/my-garage/server.js',
			env: {
				NODE_ENV: 'development',
				PORT: 3000
			},
			env_production: {
				NODE_ENV: 'production',
				PORT: 3000
			}
		},
		{
			name: 'gk5-garage-frontend',
			cwd: '/root/my-garage',
			script: '/root/my-garage/node_modules/.bin/serve',
			args: 'dist -l 5173',
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
};
