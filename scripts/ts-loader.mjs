/** Titik pasang resolver — dipakai lewat `node --import ./scripts/ts-loader.mjs`. */
import { register } from "node:module";

register("./ts-resolver.mjs", import.meta.url);
