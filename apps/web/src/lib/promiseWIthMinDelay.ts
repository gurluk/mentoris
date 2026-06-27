export async function promiseWithMinDelay<T>(
  fn: () => Promise<T>,
  minDelay = 1000,
): Promise<T> {
  const [result] = await Promise.all([
    fn(),
    new Promise((resolve) => setTimeout(resolve, minDelay)),
  ]);

  return result;
}
