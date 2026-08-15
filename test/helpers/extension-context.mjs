/**
 * Tiện ích dùng chung cho test: nạp file của extension (vốn là classic script chạy
 * trong trang web hoặc service worker) vào một môi trường giả lập của Node.
 *
 * Extension không dùng ES module nên không thể `import` trực tiếp — thay vào đó ta đọc
 * mã nguồn rồi chạy trong một sandbox có sẵn API `chrome` giả.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

export const resolveExtensionPath = (relativePath) =>
  path.join(ROOT, relativePath.replace(/^\.?\//, ""));

export const readExtensionFile = (relativePath) =>
  fs.readFileSync(resolveExtensionPath(relativePath), "utf8");

export const readExtensionJson = (relativePath) =>
  JSON.parse(readExtensionFile(relativePath));

/**
 * API `chrome` giả, lưu dữ liệu trong bộ nhớ.
 *
 * @param {{uiLanguage?: string}} [options]
 * @returns {{chrome: object, syncStore: Map<string, unknown>, localStore: Map<string, unknown>,
 *            fireInstalled: (details: object) => void}}
 */
export const createChromeStub = ({ uiLanguage = "vi" } = {}) => {
  const syncStore = new Map();
  const localStore = new Map();
  const installedListeners = [];

  const areaFor = (store) => ({
    set: (items) => {
      for (const [key, value] of Object.entries(items)) {
        store.set(key, value);
      }
      return Promise.resolve();
    },
    get: (keys, callback) => {
      const requested = Array.isArray(keys) ? keys : [keys];
      const result = {};
      for (const key of requested) {
        if (store.has(key)) {
          result[key] = store.get(key);
        }
      }
      if (callback) {
        callback(result);
      }
      return Promise.resolve(result);
    },
  });

  const chrome = {
    storage: { sync: areaFor(syncStore), local: areaFor(localStore) },
    runtime: {
      getURL: (relativePath) => `chrome-extension://test-id${relativePath}`,
      onInstalled: {
        addListener: (listener) => installedListeners.push(listener),
      },
    },
    i18n: { getUILanguage: () => uiLanguage },
  };

  return {
    chrome,
    syncStore,
    localStore,
    fireInstalled: (details) => installedListeners.forEach((listener) => listener(details)),
  };
};

/**
 * Chạy một script của extension trong sandbox Node (không có DOM).
 *
 * @param {string} relativePath đường dẫn tương đối từ gốc repo
 * @param {object} [globals] biến toàn cục bổ sung cấp cho script
 * @returns {{context: object, evaluate: (expression: string) => unknown}}
 *   `evaluate` chạy tiếp biểu thức trong cùng sandbox — cần thiết vì khai báo `const`/`let`
 *   ở cấp cao nhất không trở thành thuộc tính của đối tượng global.
 */
export const runInSandbox = (relativePath, globals = {}) => {
  const context = vm.createContext({ console, setTimeout, clearTimeout, ...globals });
  vm.runInContext(readExtensionFile(relativePath), context, { filename: relativePath });
  return {
    context,
    evaluate: (expression) => vm.runInContext(expression, context),
  };
};
