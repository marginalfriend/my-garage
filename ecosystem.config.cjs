module.exports = {
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
	]
};
