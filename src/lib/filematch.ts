export function fileMatch(file: string, pattern: string): boolean {
  const regex = wildcardToRegex(pattern);
  return regex.test(file);
}

function wildcardToRegex(pattern: string): RegExp {
  let regexPattern = pattern.replace(/([.+^${}()|[\]\\])/g, '\\$&');
  regexPattern = regexPattern.replace(/\*/g, '.*');
  regexPattern = regexPattern.replace(/\?/g, '.');
  regexPattern = regexPattern.replace(/\.\\\.\\\*/, '(.*/)*');
  regexPattern = regexPattern.replace(/\\{([^}]+)\\}/g, (_, group) => {
    const options = group.split(',').map((option: string) => option.trim()).join('|');
    return `(${options})`;
  });

  return new RegExp(`^${regexPattern}$`, 'i');
}
