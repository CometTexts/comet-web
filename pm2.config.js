module.exports = {
  apps: [
    {
      name: "comet-web",
      script: "pnpm",
      args: "run deploy",
      env: {
        PORT: "4096",
      },
    },
  ],
};
