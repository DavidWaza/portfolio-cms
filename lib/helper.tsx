export const sanitizeFileName = (name: string) => {
  return name
    .replace(/[^\w.-]+/g, "_") // replace all invalid characters
    .replace(/_+/g, "_"); // collapse multiple underscores
};
