/**
 * Test cho utils/storage.js — lớp bọc mỏng quanh chrome.storage.sync mà gần như mọi
 * content script đều dùng.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { createChromeStub, runInSandbox } from "./helpers/extension-context.mjs";

const loadStorage = () => {
  const stub = createChromeStub();
  const { evaluate } = runInSandbox("utils/storage.js", { chrome: stub.chrome });
  return {
    ...stub,
    setToStorage: evaluate("setToStorage"),
    getFromStorage: evaluate("getFromStorage"),
  };
};

test("setToStorage ghi giá trị vào chrome.storage.sync", () => {
  const { setToStorage, syncStore } = loadStorage();

  setToStorage("FAP_1", true);

  assert.equal(syncStore.get("FAP_1"), true);
});

test("setToStorage ghi đè giá trị cũ của cùng một key", () => {
  const { setToStorage, syncStore } = loadStorage();

  setToStorage("LANG", "/_locales/vi/messages.json");
  setToStorage("LANG", "/_locales/en/messages.json");

  assert.equal(syncStore.get("LANG"), "/_locales/en/messages.json");
});

test("getFromStorage trả về đúng giá trị đã ghi", async () => {
  const { setToStorage, getFromStorage } = loadStorage();

  setToStorage("STUDENT_CAMPUS", 3);

  assert.equal(await getFromStorage("STUDENT_CAMPUS"), 3);
});

test("getFromStorage trả về undefined với key chưa từng được ghi", async () => {
  const { getFromStorage } = loadStorage();

  assert.equal(await getFromStorage("KHONG_TON_TAI"), undefined);
});

test("getFromStorage trả về Promise (thenable) để gọi được bằng await", () => {
  const { getFromStorage } = loadStorage();

  // Promise sinh trong sandbox thuộc realm khác nên không dùng `instanceof` được.
  assert.equal(typeof getFromStorage("FAP_1").then, "function");
});

test("giá trị boolean false được giữ nguyên, không bị nhầm thành undefined", async () => {
  const { setToStorage, getFromStorage } = loadStorage();

  setToStorage("FAP_5", false);

  assert.equal(await getFromStorage("FAP_5"), false);
});
