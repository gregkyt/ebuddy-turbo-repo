function normalize(value: number, min: number, max: number) {
  if (max === min) return 1; // avoid 0 division
  return (value - min) / (max - min);
}

function findMax(list: Record<string, any>[], key: string) {
  return Math.max(...list.map((item) => item[key] || 1));
}

function findMin(list: Record<string, any>[], key: string) {
  return Math.min(...list.map((item) => item[key] || 0));
}

export { normalize, findMin, findMax };
