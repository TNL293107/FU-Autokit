/**
 * Kiểm tra hai bộ ngôn ngữ vi/en khớp nhau.
 *
 * Các content script đọc nhãn theo dạng `label.<key>.message`; thiếu một key ở một ngôn ngữ
 * sẽ gây TypeError ngay trên trang FAP mà không có thông báo nào cho người dùng.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { readExtensionJson } from "./helpers/extension-context.mjs";

const vi = readExtensionJson("_locales/vi/messages.json");
const en = readExtensionJson("_locales/en/messages.json");

test("vi và en có cùng tập key", () => {
  const missingInEn = Object.keys(vi).filter((key) => !(key in en));
  const missingInVi = Object.keys(en).filter((key) => !(key in vi));

  assert.deepEqual(missingInEn, [], `thiếu ở _locales/en: ${missingInEn.join(", ")}`);
  assert.deepEqual(missingInVi, [], `thiếu ở _locales/vi: ${missingInVi.join(", ")}`);
});

test("mọi entry đều có trường message không rỗng", () => {
  for (const [locale, messages] of [["vi", vi], ["en", en]]) {
    for (const [key, entry] of Object.entries(messages)) {
      assert.equal(typeof entry.message, "string",
        `${locale}/${key} thiếu trường message`);
      assert.notEqual(entry.message.trim(), "",
        `${locale}/${key} có message rỗng`);
    }
  }
});

test("placeholder $x$ dùng trong message phải được khai báo", () => {
  for (const [locale, messages] of [["vi", vi], ["en", en]]) {
    for (const [key, entry] of Object.entries(messages)) {
      const used = [...entry.message.matchAll(/\$([A-Za-z0-9_]+)\$/g)].map((m) => m[1].toLowerCase());
      const declared = Object.keys(entry.placeholders ?? {}).map((name) => name.toLowerCase());
      for (const placeholder of used) {
        assert.ok(declared.includes(placeholder),
          `${locale}/${key} dùng placeholder $${placeholder}$ nhưng không khai báo`);
      }
    }
  }
});
