module.exports = {
	apps: [
		{
			name: 'gk5-garage-backend',
			script: 'server.js',
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
			script: 'npm',
			args: 'run dev:frontend',
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
};
