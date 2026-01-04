export async function readContentFromFile(filePath: string): Promise<string> {
  try {
    const data = await Deno.readTextFile(filePath);
    return data;
  } catch (error) {
    console.error(`Failed to read file at ${filePath}:`, error);
    throw error;
  }
}