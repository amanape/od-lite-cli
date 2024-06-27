export const parseForCommand = (response: string | undefined | null) => {
  const regex = /<execute_cmd>(.*?)<\/execute_cmd>/;
  const match = response?.match(regex);

  return match?.[1];
};

export const parseForFs = (response: string | undefined | null) => {
  const regex = /<execute_fs>(.*?)<\/execute_fs>/s;
  const match = response?.match(regex);

  const operationRegex = /<op>(.*?)<\/op>/s;
  const operationMatch = match?.[1].match(operationRegex);

  const pathRegex = /<path>(.*?)<\/path>/s;
  const pathMatch = match?.[1].match(pathRegex);

  const contentRegex = /<content>(.*?)<\/content>/s;
  const contentMatch = match?.[1].match(contentRegex);

  return {
    operation: operationMatch?.[1],
    path: pathMatch?.[1],
    content: contentMatch?.[1],
  }
}