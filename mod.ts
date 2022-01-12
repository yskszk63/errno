// TODO errno is TLS?

const libdl = Deno.dlopen('libdl.so', {
  "dlopen": {
    parameters: ["pointer", "i32"],
    result: "pointer",
    nonblocking: false,
  },
  "dlsym": {
    parameters: ["pointer", "pointer"],
    result: "pointer",
    nonblocking: false,
  },
});

// #define RTLD_LAZY	0x00001	/* Lazy function call binding.  */
const RTLD_LAZY: number = 0x00001;

const errnoHandle = (function(): Deno.UnsafePointerView {
  const nul = new Deno.UnsafePointer(0n);
  const handle = libdl.symbols.dlopen(nul, RTLD_LAZY);
  if (!(handle instanceof Deno.UnsafePointer)) {
    throw new Error();
  }
  if (handle.value === 0n) {
    throw new Error();
  }

  const errno = Uint8Array.of(0x65, 0x72, 0x72, 0x6e, 0x6f, 0x00); // errno\0
  const herrno = libdl.symbols.dlsym(handle, errno);
  if (!(herrno instanceof Deno.UnsafePointer)) {
    throw new Error();
  }
  if (herrno.value === 0n) {
    throw new Error();
  }
  return new Deno.UnsafePointerView(herrno);
})();

export default function errno(): number {
  return errnoHandle.getInt32();
}
