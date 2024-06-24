# od-lite-usage

## Description

This project demonstrates how to use the `od-lite` package to create an autonomous AI agent through a CLI. It is for demonstration purposes and only has handlers to write to the terminal, and read a file in the current directory.

## Usage

Please set the `OPENAI_API_KEY` environment variable to your OpenAI API key.

`.env.local`

```sh
OPENAI_API_KEY=your-api-key
```

## Note

The current implementation of the terminal and file managers that allow for the AI agent to interact are implemented using [`bun`](https://bun.sh/) API. If you wish to use `node` instead, you can create a new terminal and file manager that uses the `node` API.

## Running the CLI

To run the CLI, simply run the `index.ts` file.

```sh
bun index.ts
```
