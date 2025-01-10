export const objectKeys = (obj) => Object.keys(obj);
export const objectValues = (obj) => Object.values(obj);

export const calculateSkip = (page, limit) =>
  ((page <= 0 ? 1 : parseInt(page)) - 1) * parseInt(limit);

export const calculatePaginationProps = (count, limit) => {
  const safeCount = parseInt(count ?? 0);
  const totalPages = Math.ceil(safeCount / parseInt(limit));

  return { totalItems: safeCount, totalPages };
};
