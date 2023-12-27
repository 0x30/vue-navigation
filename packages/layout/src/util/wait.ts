const wait = (time: number) => {
  if (time === 0) return Promise.resolve();
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, time);
  });
};

export { wait };
