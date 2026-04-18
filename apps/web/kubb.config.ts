import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginFaker } from "@kubb/plugin-faker";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";
import "dotenv/config";

const apiUrl =
  (globalThis as any).process?.env?.VITE_API_URL || "http://localhost:3333";

export default defineConfig({
  root: ".",
  input: {
    path: apiUrl + "/docs/openapi.json",
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
      group: {
        type: "tag",
      },
      enumType: "asConst",
    }),
    pluginClient({
      importPath: "@/lib/axiosInstance",
      output: { path: "clients" },
      group: {
        type: "tag",
      },
    }),
    pluginReactQuery({
      output: { path: "hooks" },
      client: {
        importPath: "@/lib/axiosInstance",
      },
      group: {
        type: "tag",
      },
      query: {
        methods: ["get"],
      },
      mutation: {
        methods: ["delete", "post", "patch", "put"],
      },
    }),
    pluginZod({
      output: { path: "zod" },
      group: {
        type: "tag",
      },
    }),
    pluginFaker({
      output: { path: "mocks" },
      group: {
        type: "tag",
      },
    }),
    pluginMsw({
      output: { path: "msw" },
      group: {
        type: "tag",
      },
    }),
  ],
});
