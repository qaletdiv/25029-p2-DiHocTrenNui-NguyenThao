/**
 * Standard Pagination Utility
 * Extracts page and pageSize from the request query, paginates the data array,
 * and returns the expected paginated structure.
 *
 * @param {Array} data - The full array of records.
 * @param {Object} req - The Express request object.
 * @param {string} [dataKey='data'] - The key for the paginated array in the result (e.g. 'students', 'schools').
 * @returns {Object} The paginated response structure.
 */
const paginate = (data, req, dataKey = 'data') => {
  const query = req && req.query ? req.query : {};
  const pageParam = parseInt(query.page);
  const pageSizeParam = parseInt(query.pageSize);
  const total = data.length;

  let paginatedData = data;
  
  if (!isNaN(pageParam) && !isNaN(pageSizeParam)) {
    const startIndex = (pageParam - 1) * pageSizeParam;
    const endIndex = pageParam * pageSizeParam;
    paginatedData = data.slice(startIndex, endIndex);
  }

  const page = isNaN(pageParam) ? 1 : pageParam;
  const pageSize = isNaN(pageSizeParam) ? total : pageSizeParam;

  return {
    [dataKey]: paginatedData,
    total,
    page,
    pageSize,
  };
};

module.exports = {
  paginate,
};
