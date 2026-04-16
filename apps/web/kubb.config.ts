import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginFaker } from "@kubb/plugin-faker";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginRedoc } from "@kubb/plugin-redoc";
import { pluginSwr } from "@kubb/plugin-swr";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";

export default defineConfig({
  root: ".",
  input: {
    path: ".",
  },
  output: {
    path: "./src/gen",
    clean: true,
    format: "auto",
    lint: "auto",
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: "models" },
    }),
    pluginClient({
      output: { path: "clients" },
    }),
    pluginReactQuery({
      output: { path: "hooks" },
    }),
    pluginSwr({
      output: { path: "hooks" },
    }),
    pluginZod({
      output: { path: "zod" },
    }),
    pluginFaker({
      output: { path: "mocks" },
    }),
    pluginMsw({
      output: { path: "msw" },
    }),
    pluginRedoc(),
  ],
});
