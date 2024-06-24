export const parse = (response: string | undefined | null) => {
  const regex = /<execute_command>(.*?)<\/execute_command>/;
  const match = response?.match(regex);

  return match?.[1];
};
