export async function ensureDir(path: string) {
  await Deno.mkdir(path, { recursive: true }).catch(() => {});
}

export async function writeTextFile(path: string, content: string) {
  await Deno.writeTextFile(path, content);
}
