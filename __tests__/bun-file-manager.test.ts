import { describe, beforeAll, afterAll, it, expect } from "bun:test";
import { unlink } from "node:fs/promises";
import BunFileManager from "../src/bun-file-manager";

describe('BunFileManager', () => {
  beforeAll(async () => {
    // Create a file for testing
    const file = Bun.file('_test_file1.txt');
    await Bun.write(file, 'Hello, World!');
  });

  afterAll(async () => {
    // Remove the file after testing 
    const f1 = Bun.file('_test_file1.txt');
    const f2 = Bun.file('_test_file2.txt');
    const f3 = Bun.file('_test_file3.txt');
  
    if (await f1.exists()) await unlink('_test_file1.txt');
    if (await f2.exists()) await unlink('_test_file2.txt');
    if (await f3.exists()) await unlink('_test_file3.txt');
  });

  it('should read a file and return its contents', async () => {
    const result = await BunFileManager.read('_test_file1.txt');
    expect(result).toBe('Hello, World!');
  });

  it('should create a file and return a success message', async () => {
    const result = await BunFileManager.create('_test_file2.txt');
    expect(result).toBe('File created: _test_file2.txt (0 bytes)');

    const resultWithContents = await BunFileManager.create('_test_file3.txt', 'Hello, World!');
    expect(resultWithContents).toBe('File created: _test_file3.txt (13 bytes)');
  });

  it('should update a file and return the new contents', async () => {
    const result = await BunFileManager.update('_test_file1.txt', 'Hello, World! Updated!');
    expect(result).toBe('Hello, World! Updated!');
  });
});
