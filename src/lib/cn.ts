type ClassValue = string | number | null | undefined | false | ClassValue[];

export const cn = (...values: ClassValue[]): string => {
  const out: string[] = [];

  const walk = (value: ClassValue): void => {
    if (value === null || value === undefined || value === false) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    const str = String(value).trim();
    if (str.length > 0) out.push(str);
  };

  values.forEach(walk);
  return out.join(' ');
};

/** Resolve a public/ asset against the Vite base path (GitHub Pages sub-path safe). */
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
