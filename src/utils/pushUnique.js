/**
 * Push phần tử mới vào mảng mà không bị trùng dựa trên key định danh
 * @param {Array} array - Mảng gốc
 * @param {Array} newItems - Mảng phần tử mới cần thêm
 * @param {string} key - Tên thuộc tính định danh (vd: "_id" hoặc "id")
 * @param {boolean} [reverse=true] - Nếu true, push giá trị mới lên đầu mảng, false thì push cuối mảng
 * @returns {Array} - Mảng mới đã loại bỏ phần tử trùng
 */
export function pushUnique(array, newItems, key, reverse = false) {
  const existingKeys = new Set(array.map((item) => item[key]));
  const filtered = newItems.filter((item) => !existingKeys.has(item[key]));

  return reverse
    ? [...filtered, ...array] // mới lên đầu
    : [...array, ...filtered]; // mới xuống cuối
}
