module.exports = {
  apps: [
    {
      name: "task-management-agusp",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
