import { defineConfig } from "vite";

export default defineConfig({
  root: ".", // Root directory for the project
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        games: "games.html",
        register: "register.html",
        login: "login.html",
        challenges: "challenges.html",
        playground: "playground.html",
      },
    },
  },
});
