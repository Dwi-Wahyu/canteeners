module.exports = {
  apps: [
    {
      name: "presensi-skytel",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 5002,
      },
    },
  ],
};
