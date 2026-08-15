/**
 * Kiểm tra tính toàn vẹn của manifest.json.
 *
 * Chrome từ chối nạp cả extension nếu manifest trỏ tới một file không tồn tại, và lỗi đó
 * chỉ lộ ra khi cài thủ công. Test này bắt lỗi ngay ở khâu commit.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import { readExtensionJson, resolveExtensionPath } from "./helpers/extension-context.mjs";

const manifest = readExtensionJson("manifest.json");

/** Mọi đường dẫn file mà manifest tham chiếu, kèm nhãn để thông báo lỗi dễ đọc. */
const referencedFiles = () => {
  const files = [
    ["action.default_popup", manifest.action?.default_popup],
    ["options_page", manifest.options_page],
    ["background.service_worker", manifest.background?.service_worker],
  ];

  manifest.content_scripts?.forEach((entry, index) => {
    entry.js?.forEach((file) => files.push([`content_scripts[${index}].js`, file]));
    entry.css?.forEach((file) => files.push([`content_scripts[${index}].css`, file]));
  });

  manifest.web_accessible_resources?.forEach((entry, index) => {
    entry.resources?.forEach((file) =>
      files.push([`web_accessible_resources[${index}].resources`, file]));
  });

  return files.filter(([, file]) => Boolean(file));
};

test("manifest dùng Manifest V3", () => {
  assert.equal(manifest.manifest_version, 3);
});

test("version theo định dạng Chrome chấp nhận (1-4 số, cách nhau bởi dấu chấm)", () => {
  assert.match(manifest.version, /^\d+(\.\d+){0,3}$/);
});

test("mọi file được manifest tham chiếu đều tồn tại", () => {
  const missing = referencedFiles()
    .filter(([, file]) => !fs.existsSync(resolveExtensionPath(file)))
    .map(([label, file]) => `${label}: ${file}`);

  assert.deepEqual(missing, [], `manifest trỏ tới file không tồn tại:\n${missing.join("\n")}`);
});

test("default_locale có thư mục messages.json tương ứng", () => {
  assert.ok(manifest.default_locale, "manifest phải khai báo default_locale");
  assert.ok(
    fs.existsSync(resolveExtensionPath(`_locales/${manifest.default_locale}/messages.json`)),
    `thiếu _locales/${manifest.default_locale}/messages.json`);
});

test("mọi content script đều khai báo ít nhất một match pattern", () => {
  manifest.content_scripts?.forEach((entry, index) => {
    assert.ok(
      Array.isArray(entry.matches) && entry.matches.length > 0,
      `content_scripts[${index}] không có matches`);
  });
});

test("match pattern đúng cú pháp <scheme>://<host><path>", () => {
  const invalid = [];
  manifest.content_scripts?.forEach((entry, index) => {
    entry.matches.forEach((pattern) => {
      if (!/^(\*|https?|file|ftp):\/\/([^/]+)\/.*$/.test(pattern) && pattern !== "<all_urls>") {
        invalid.push(`content_scripts[${index}]: ${pattern}`);
      }
    });
  });

  assert.deepEqual(invalid, [], `match pattern sai cú pháp:\n${invalid.join("\n")}`);
});

test("content script nào dùng jQuery thì phải nạp utils/jquery.js trước", () => {
  const offenders = [];

  manifest.content_scripts?.forEach((entry, index) => {
    const files = entry.js ?? [];
    const jqueryIndex = files.findIndex((file) => file.includes("jquery"));
    files.forEach((file, position) => {
      const source = fs.readFileSync(resolveExtensionPath(file), "utf8");
      const usesJQuery = /(^|[^\w$])\$\(/.test(source);
      if (usesJQuery && (jqueryIndex === -1 || jqueryIndex > position)) {
        offenders.push(`content_scripts[${index}]: ${file}`);
      }
    });
  });

  assert.deepEqual(offenders, [],
    `script dùng $() nhưng jQuery chưa được nạp trước:\n${offenders.join("\n")}`);
});

test("script nào gọi getFromStorage/setToStorage thì phải nạp utils/storage.js trước", () => {
  const offenders = [];

  manifest.content_scripts?.forEach((entry, index) => {
    const files = entry.js ?? [];
    const storageIndex = files.findIndex((file) => file.includes("utils/storage.js"));
    files.forEach((file, position) => {
      const source = fs.readFileSync(resolveExtensionPath(file), "utf8");
      const usesStorage = /(get|set)(From|To)Storage\s*\(/.test(source);
      if (usesStorage && (storageIndex === -1 || storageIndex > position)) {
        offenders.push(`content_scripts[${index}]: ${file}`);
      }
    });
  });

  assert.deepEqual(offenders, [],
    `script dùng storage helper nhưng utils/storage.js chưa được nạp trước:\n${offenders.join("\n")}`);
});

test("permissions chỉ chứa quyền thực sự đang dùng", () => {
  // Chrome Web Store từ chối extension xin quyền không dùng tới; giữ danh sách này khớp
  // với thực tế và cập nhật có chủ đích khi thêm quyền mới.
  assert.deepEqual(
    [...manifest.permissions].sort(),
    ["activeTab", "contextMenus", "declarativeContent", "storage", "tabs"]);
});
