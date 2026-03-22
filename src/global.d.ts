declare module "node:fs" {
  export const promises: {
    mkdir(path: string, options?: { recursive?: boolean | undefined }): Promise<void>;
    mkdtemp(prefix: string): Promise<string>;
    readdir(path: string): Promise<string[]>;
    readFile(path: string, encoding: string): Promise<string>;
    rm(path: string, options?: { recursive?: boolean | undefined; force?: boolean | undefined }): Promise<void>;
    writeFile(path: string, data: string, encoding: string): Promise<void>;
    rename(oldPath: string, newPath: string): Promise<void>;
  };
}

declare module "node:path" {
  export function basename(path: string): string;
  export function dirname(path: string): string;
  export function join(...segments: string[]): string;
  export function resolve(...segments: string[]): string;
}

declare module "node:child_process" {
  export function execFile(
    file: string,
    args: string[],
    callback: (error: Error | null, stdout: string, stderr: string) => void
  ): void;
}

declare module "node:util" {
  export function promisify(
    fn: (
      file: string,
      args: string[],
      callback: (error: Error | null, stdout: string, stderr: string) => void
    ) => void
  ): (file: string, args: string[]) => Promise<{ stdout: string; stderr: string }>;
}

declare module "node:test" {
  export default function test(name: string, fn: () => void | Promise<void>): void;
}

declare module "node:assert/strict" {
  const assert: {
    equal(actual: unknown, expected: unknown): void;
    deepEqual(actual: unknown, expected: unknown): void;
    ok(value: unknown): void;
  };

  export default assert;
}

declare module "node:os" {
  export function tmpdir(): string;
}

declare type Buffer = {
  toString(encoding?: string): string;
};

declare const process: {
  argv: string[];
  exit(code?: number): never;
  exitCode: number | undefined;
  cwd(): string;
  stdin: {
    setRawMode(enabled: boolean): void;
    resume(): void;
    pause(): void;
    on(event: "data", listener: (input: Buffer) => void | Promise<void>): void;
  };
  stdout: {
    write(chunk: string): void;
  };
};

declare const console: {
  log(message?: unknown): void;
};
