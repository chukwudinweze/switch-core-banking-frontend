export const delayResponse = (secs: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, secs);
  });
};
