export const setAttributes = (
  el: unknown,
  attrs: { [key: string]: string }
) => {
  for (var key in attrs) {
    (el as HTMLElement).setAttribute(key, attrs[key]);
  }
};

export const fadeInElement = (time: number, el: unknown): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      (el as HTMLElement).style.opacity = "1";
      resolve();
    }, time);
  });
};
