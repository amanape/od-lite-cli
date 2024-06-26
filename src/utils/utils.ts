export const parseForCommand = (response: string | undefined | null) => {
  const regex = /<execute_cmd>(.*?)<\/execute_cmd>/;
  const match = response?.match(regex);

  return match?.[1];
};

export const parseForFs = (response: string | undefined | null) => {
  const regex = /<execute_fs>([\s\S]*?)<\/execute_fs>/;
  const match = response?.match(regex);

  const operationRegex = /<op>(.*?)<\/op>/;
  const operationMatch = match?.[1].match(operationRegex);

  const pathRegex = /<path>(.*?)<\/path>/;
  const pathMatch = match?.[1].match(pathRegex);

  const contentRegex = /<content>(.*?)<\/content>/;
  const contentMatch = match?.[1].match(contentRegex);

  return {
    operation: operationMatch?.[1],
    path: pathMatch?.[1],
    content: contentMatch?.[1],
  }
}