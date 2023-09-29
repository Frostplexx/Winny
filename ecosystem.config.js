module.exports = {
  apps : [{
    name: 'Winny',
    script: './compiled/main.js',
    watch: '.',
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    }
  }],
  deploy : {
    production : {
      user : 'ubuntu',
      host : ['129.152.14.237'],
      ref  : 'origin/main',
      repo : 'https://github.com/Frostplexx/Winny.git',
      path : '/home/ubuntu/Winny',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
