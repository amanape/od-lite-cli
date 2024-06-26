import { describe, beforeAll, afterAll, it, expect, spyOn, mock, type Mock } from "bun:test";
import BunTerminalManager from "../src/bun-terminal-manager";
import type { CommandAction } from "../src/types/actions/terminal";
import { Topic } from "od-lite";
import type { CommandObservation } from "../src/types/observations/terminal";
import BunRuntime from "../src/bun-runtime";
import BunFileManager from "../src/bun-file-manager";
import type { CreateFileAction, ReadFileAction, UpdateFileAction } from "../src/types/actions/file-system";
import type { CreateFileObservation, ReadFileObservation, UpdateFileObservation } from "../src/types/observations/file-system";

let cmdSpy: Mock<any>;
let fsReadSpy: Mock<any>;
let fsCreateSpy: Mock<any>;
let fsUpdateSpy: Mock<any>;


describe('BunRuntime', () => {
  const runtime = new BunRuntime();

  beforeAll(() => {
    cmdSpy = spyOn(BunTerminalManager, "run").mockResolvedValue("file1\nfile2\nfile3\n");
    fsReadSpy = spyOn(BunFileManager, "read").mockResolvedValue("Hello, World!");
    fsCreateSpy = spyOn(BunFileManager, "create")
      .mockResolvedValueOnce("File created: _test_file2.txt (0 bytes)")
      .mockResolvedValueOnce("File created: _test_file3.txt (13 bytes)");

    fsUpdateSpy = spyOn(BunFileManager, "update").mockResolvedValue("Hello, World! Updated!");
  });

  afterAll(() => {
    // Prevent mocks from leaking into other tests
    mock.restore();
  });

  it('should convert a terminal command action into an observation', async () => {
    const action: CommandAction = {
      type: Topic.ACTION,
      data: {
        type: 'cmd',
        command: 'ls'
      }
    };

    const observation = await runtime.execute(action);
    expect(cmdSpy).toHaveBeenCalledWith('ls');

    const expectedObservation: CommandObservation = {
      type: Topic.OBSERVATION,
      data: {
        type: "cmd",
        output: "file1\nfile2\nfile3\n"
      }
    };

    expect(observation).toEqual(expectedObservation);
  });

  it('should handle errors when converting a terminal command action into an observation', async () => {
    cmdSpy.mockRejectedValue(new Error('Command failed: l l'));
    const action: CommandAction = {
      type: Topic.ACTION,
      data: {
        type: 'cmd',
        command: 'l l'
      }
    };

    const observation = await runtime.execute(action);
    const expectedObservation: CommandObservation = {
      type: Topic.OBSERVATION,
      data: {
        type: "cmd",
        error: true,
        output: "Command failed: l l"
      }
    };

    expect(observation).toEqual(expectedObservation);
  });

  it('should convert a file system read action into an observation', async () => {
    const action: ReadFileAction = {
      type: Topic.ACTION,
      data: {
        type: 'read',
        path: '_test_file1.txt'
      }
    }

    const observation = await runtime.execute(action);
    expect(fsReadSpy).toHaveBeenCalledWith('_test_file1.txt');

    const expectedObservation: ReadFileObservation = {
      type: Topic.OBSERVATION,
      data: {
        type: "read",
        output: "Hello, World!"
      }
    };

    expect(observation).toEqual(expectedObservation);
  });

  it('should handle errors when converting a file system read action into an observation', async () => {
    fsReadSpy.mockRejectedValue(new Error('File not found'));
    const action: ReadFileAction = {
      type: Topic.ACTION,
      data: {
        type: 'read',
        path: '_test_file4.txt'
      }
    }

    const observation = await runtime.execute(action);
    const expectedObservation: ReadFileObservation = {
      type: Topic.OBSERVATION,
      data: {
        type: "read",
        output: "File not found",
        error: true,
      }
    };

    expect(observation).toEqual(expectedObservation);
  });

  it('should convert a file system create action into an observation', async () => {
    const action: CreateFileAction = {
      type: Topic.ACTION,
      data: {
        type: 'create',
        path: '_test_file2.txt',
      }
    }

    const observation = await runtime.execute(action);
    expect(fsCreateSpy).toHaveBeenCalledWith('_test_file2.txt', undefined);

    const expectedObservation: CreateFileObservation = {
      type: Topic.OBSERVATION,
      data: {
        type: "create",
        output: "File created: _test_file2.txt (0 bytes)"
      }
    };

    expect(observation).toEqual(expectedObservation);

    /* with content */
    const actionWithContent: CreateFileAction = {
      type: Topic.ACTION,
      data: {
        type: 'create',
        path: '_test_file3.txt',
        content: 'Hello, World!'
      }
    }

    const observationWithContent = await runtime.execute(actionWithContent);
    expect(fsCreateSpy).toHaveBeenCalledWith('_test_file3.txt', 'Hello, World!');

    const expectedObservationWithContent: CreateFileObservation = {
      type: Topic.OBSERVATION,
      data: {
        type: "create",
        output: "File created: _test_file3.txt (13 bytes)"
      }
    };

    expect(observationWithContent).toEqual(expectedObservationWithContent);
  });

  it('should handle errors when converting a file system create action into an observation', async () => {
    fsCreateSpy.mockRejectedValue(new Error('File already exists'));
    const action: CreateFileAction = {
      type: Topic.ACTION,
      data: {
        type: 'create',
        path: '_test_file2.txt',
      }
    }

    const observation = await runtime.execute(action);
    const expectedObservation: CreateFileObservation = {
      type: Topic.OBSERVATION,
      data: {
        type: "create",
        output: "File already exists",
        error: true,
      }
    };

    expect(observation).toEqual(expectedObservation);
  });

  it('should convert a file system update action into an observation', async () => {
    const action: UpdateFileAction = {
      type: Topic.ACTION,
      data: {
        type: 'update',
        path: '_test_file1.txt',
        content: 'Hello, World! Updated!'
      }
    }

    const observation = await runtime.execute(action);
    expect(fsUpdateSpy).toHaveBeenCalledWith('_test_file1.txt', 'Hello, World! Updated!');

    const expectedObservation: UpdateFileObservation = {
      type: Topic.OBSERVATION,
      data: {
        type: "update",
        output: "Hello, World! Updated!"
      }
    };

    expect(observation).toEqual(expectedObservation);
  });

  it('should handle errors when converting a file system update action into an observation', async () => {
    fsUpdateSpy.mockRejectedValue(new Error('File not found'));
    const action: UpdateFileAction = {
      type: Topic.ACTION,
      data: {
        type: 'update',
        path: '_test_file4.txt',
        content: 'Hello, World! Updated!'
      }
    }

    const observation = await runtime.execute(action);
    const expectedObservation: UpdateFileObservation = {
      type: Topic.OBSERVATION,
      data: {
        type: "update",
        output: "File not found",
        error: true,
      }
    };

    expect(observation).toEqual(expectedObservation);
  });
});
