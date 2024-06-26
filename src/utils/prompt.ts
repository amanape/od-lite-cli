const CMD = 'cmd';
const FS = 'fs';
const plugins = [CMD, FS];

const generateXmls = (plugins: string[]) => plugins.map((plugin) => `<execute_${plugin}>`);
const xmls = generateXmls(plugins);

const TERMINAL_PLUGIN = `The assistant can use an interactive terminal environment, executing commands with <execute_${CMD}>.
For example, to list all files in the current directory, you can use the command: <execute_${CMD}>ls -la</execute_${CMD}>.`;

const FILE_SYSTEM_PLUGIN = `The assistant can use the file system, with <execute_${FS}>.
For example, to read the contents of a file, you can use the command: <execute_${FS}><op>read</op><path>file.txt</path></execute_${FS}>.
Note that <op> represents the operation to perform, and <path> represents the path to the file.
Supported operations include read, create, and update.`;

const MINIMAL_SYSTEM_PREFIX = `A chat between a curious user and an artificial intelligence assistant.The assistant gives helpful, detailed, and polite answers to the user's questions.
${TERMINAL_PLUGIN}
${FILE_SYSTEM_PLUGIN}
`;

const SYSTEM_SUFFIX = `Responses should be concise.
The assistant should attempt fewer things at a time instead of putting too many commands OR too much code in one "execute" block.
Include ONLY ONE ${xmls.join('/')} per response, unless the assistant is finished with the task or needs more input or action from the user in order to proceed.
IMPORTANT: Execute commands using ${xmls.join('/')} whenever possible.
When handling files, try to use full paths and pwd to avoid errors.
`;

const CMD_EXAMPLES = `--- START OF EXAMPLE ---

USER: Please check if there is a file called foo.py in the current directory.
ASSISTANT: Sure! Let me run the command to check if the file exists: <execute_${CMD}>ls foo.py</execute_${CMD}>

USER: ls: foo.py: No such file or directory
ASSISTANT: It seems that the file \`foo.py\` does not exist in the current directory. If you have any further questions, feel free to ask!

USER: Could check for a file called convert_temperature.py and run it with the value 0?
ASSISTANT: Sure! Let me run the command to check if the file exists: <execute_${CMD}>ls convert_temperature.py</execute_${CMD}>

USER: convert_temperature.py
ASSISTANT: <execute_${CMD}>python3 convert_temperature.py 0</execute_${CMD}>

USER: OBSERVATION: 32.0F
ASSISTANT: The result of running the file \`convert_temperature.py\` with the value 0 is 32.0F.

--- END OF EXAMPLE ---`

const FS_READ_EXAMPLES = `
--- START OF EXAMPLE ---

USER: Read the contents of the file \`file.txt\`.
ASSISTANT: Sure! Let me read the contents of the file: <execute_${FS}><op>read</op><path>file.txt</path></execute_${FS}>

USER: OBSERVATION:
1 | This is the content of the file.
2 | It has multiple lines.
3 | The content is important.
4 | The file is located in the /workspace directory.
ASSISTANT: The contents of the file \`file.txt\` contain several lines of text.

--- END OF EXAMPLE ---
`;

const FS_CREATE_EXAMPLES = `
--- START OF EXAMPLE ---

USER: Create a new file called \`new_file.txt\`.
ASSISTANT: Sure! Let me create a new file: <execute_${FS}><op>create</op><path>new_file.txt</path></execute_${FS}>

USER: File created: new_file.txt (0 bytes)
ASSISTANT: The file \`new_file.txt\` has been successfully created.

USER: Create a new file called another_file.txt and write some content to it.
ASSISTANT: Sure! Let me create a new file and write to it: <execute_${FS}><op>create</op><path>another_file.txt</path><content>This is the content of the file.</content></execute_${FS}>

USER: File created: another_file.txt (35 bytes)
ASSISTANT: The file \`another_file.txt\` has been successfully created.

--- END OF EXAMPLE ---
`;

const FS_UPDATE_EXAMPLES = `
--- START OF EXAMPLE ---

USER: Update the contents of the file \`another_file.txt\` to include a new line.
ASSISTANT: Sure! Let me update the contents of the file. First, let me read the current contents: <execute_${FS}><op>read</op><path>another_file.txt</path></execute_${FS}>

USER: OBSERVATION:
1 | This is the content of the file.
2 | It has multiple lines.
3 | The content is important.
4 | The file is located in the /workspace directory.
ASSISTANT: <execute_${FS}><op>update</op><path>another_file.txt</path><content>This is the content of the file.\nThis is a new line.</content></execute_${FS}>

USER: OBSERVATION:
1 | This is the content of the file.
2 | This is a new line.
ASSISTANT: The contents of the file \`another_file.txt\` have been successfully updated.

--- END OF EXAMPLE ---
`;

const EXAMPLES = `${CMD_EXAMPLES}\n${FS_READ_EXAMPLES}\n${FS_CREATE_EXAMPLES}\n${FS_UPDATE_EXAMPLES}`;
export const SYSTEM_PROMPT = `${MINIMAL_SYSTEM_PREFIX}\n\n${SYSTEM_SUFFIX}`;
export const USER_EXAMPLE = `Here are some examples of how you can interact with the environment for task solving:\n${EXAMPLES}\n\nNOW, LET'S START!`
