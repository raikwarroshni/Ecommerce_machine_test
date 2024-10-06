const paginationData = (limits, pageNumber) => {
  pageNumber = parseInt(pageNumber) || 1;
  limits = parseInt(limits) || 10;
  const offset = (pageNumber - 1) * limits;
  return { offset, limits };
};

export default { paginationData };
