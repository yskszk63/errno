import errno from "../mod.ts";

const libc = Deno.dlopen('libc.so.6', {
  "close": {
    parameters: ["i32"],
    result: "i32",
  },
});
const n = libc.symbols.close(-2);
if (n !== -1) {
  throw new Error('no error occurred.');
}
if (errno() !== 9) {
  throw new Error('no badf occurred.');
}
console.log("OK!");
