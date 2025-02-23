export default {
	apps: [
		{
			name: 'gk5-garage-backend',
			cwd: '/root/my-garage',
			script: '/usr/bin/node',
			args: 'server.js',
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
			script: '/usr/bin/npx',
			args: 'serve dist -l 5173',
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
};
