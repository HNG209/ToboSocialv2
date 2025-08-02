/**
 * Push phần tử mới vào mảng mà không bị trùng dựa trên key định danh
 * @param {Array} array - Mảng gốc
 * @param {Array} newItems - Mảng phần tử mới cần thêm
 * @param {string} key - Tên thuộc tính định danh (vd: "_id" hoặc "id")
 * @returns {Array} - Mảng mới đã loại bỏ phần tử trùng
 */
export function pushUnique(array, newItems, key) {
  const existingKeys = new Set(array.map((item) => item[key]));
  const filtered = newItems.filter((item) => !existingKeys.has(item[key]));
  return [...array, ...filtered];
}
