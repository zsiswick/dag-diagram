export const setAttributes = (
  el: unknown,
  attrs: { [key: string]: string }
) => {
  for (var key in attrs) {
    (el as HTMLElement).setAttribute(key, attrs[key]);
  }
};
