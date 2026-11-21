import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CODE_POINTS = 280;

const LINES: readonly string[] = [
  "The loaves cool under linen.",
  "The house is asleep.",
  "All night the clay oven gives its warmth back to the room.",
  "Beneath us, for four billion years,",
  "earth has carried whole oceans",
  "through the dark between the stars,",
  "so gently that water in a glass on the table",
  "never stirs.",
];

function buildEntryText(lines: readonly string[]): string {
  const text: string = lines.join("\n");
  const codePoints: number = Array.from(text).length;
  if (codePoints < 1 || codePoints > MAX_CODE_POINTS) {
    throw new Error(`Entry length ${codePoints} outside 1..${MAX_CODE_POINTS} code points`);
  }
  if (Buffer.byteLength(text, "utf8") < 1) {
    throw new Error("Entry UTF-8 byte length must be positive");
  }
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only whitespace");
  }
  return text;
}

function main(): void {
  const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outputDir, { recursive: true, mode: 0o755 });
  const targetPath: string = join(outputDir, "entry.txt");
  const content: string = buildEntryText(LINES);
  writeFileSync(targetPath, content, { encoding: "utf8", mode: 0o644 });
  try {
    chmodSync(targetPath, 0o644);
  } catch {
    // Ignore chmod errors on non-POSIX filesystems while keeping sandbox output 0644 on Linux.
  }
}

main();
