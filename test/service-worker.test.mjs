/**
 * Test cho service/service-worker.js — nơi đặt giá trị mặc định khi cài extension.
 *
 * Sai sót ở đây rất khó phát hiện: người dùng cài xong thấy extension "im lặng không chạy"
 * mà không có thông báo lỗi nào.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import {
  createChromeStub,
  resolveExtensionPath,
  runInSandbox,
} from "./helpers/extension-context.mjs";

/** Nạp service worker rồi giả lập sự kiện onInstalled. */
const installWith = ({ uiLanguage = "vi", reason = "install" } = {}) => {
  const stub = createChromeStub({ uiLanguage });
  runInSandbox("service/service-worker.js", { chrome: stub.chrome });
  stub.fireInstalled({ reason });
  return stub;
};

test("service worker đăng ký listener onInstalled ngay khi nạp", () => {
  const stub = createChromeStub();
  runInSandbox("service/service-worker.js", { chrome: stub.chrome });

  // fireInstalled chỉ có tác dụng nếu listener đã được đăng ký lúc nạp script
  stub.fireInstalled({ reason: "install" });

  assert.ok(stub.syncStore.size > 0, "không có giá trị mặc định nào được ghi");
});

test("LANG mặc định trỏ tới file messages.json có thật trong extension", () => {
  for (const [uiLanguage, expected] of [
    ["vi", "/_locales/vi/messages.json"],
    ["en", "/_locales/en/messages.json"],
  ]) {
    const { syncStore } = installWith({ uiLanguage });
    const lang = syncStore.get("LANG");

    assert.equal(lang, expected);
    assert.ok(
      fs.existsSync(resolveExtensionPath(lang)),
      `LANG mặc định trỏ tới file không tồn tại: ${lang}`);
  }
});

test("mọi công tắc tính năng đều có giá trị mặc định sau khi cài", () => {
  const { syncStore } = installWith();

  const expectedKeys = [
    "K", "STUDENT_CAMPUS",
    "FAP_1", "FAP_2", "FAP_3", "FAP_4", "FAP_5",
    "EDN_1", "EDN_2", "CMS_1",
    "CRS_1", "CRS_2", "CRS_3",
    "FLM_1", "FLM_2", "FLM_3",
    "DNG_1", "OCD_1", "OJT_1", "LBR_1",
    "LANG", "DefaultNonGPA",
  ];

  const missing = expectedKeys.filter((key) => !syncStore.has(key));
  assert.deepEqual(missing, [], `thiếu giá trị mặc định: ${missing.join(", ")}`);
});

test("danh sách môn không tính GPA mặc định không rỗng", () => {
  const { syncStore } = installWith();

  const defaultNonGPA = syncStore.get("DefaultNonGPA");
  assert.ok(Array.isArray(defaultNonGPA));
  assert.ok(defaultNonGPA.length > 0);
});

test("subjects và subjectsName là hai mảng song song cùng độ dài", () => {
  const { localStore } = installWith();

  const codes = localStore.get("subjects");
  const names = localStore.get("subjectsName");

  assert.ok(Array.isArray(codes) && codes.length > 0);
  assert.equal(names.length, codes.length,
    "lệch độ dài sẽ khiến gợi ý môn học hiển thị sai tên");
});

test("listCurriculum và listCurriculumName là hai mảng song song cùng độ dài", () => {
  const { localStore } = installWith();

  const codes = localStore.get("listCurriculum");
  const names = localStore.get("listCurriculumName");

  assert.ok(Array.isArray(codes) && codes.length > 0);
  assert.equal(names.length, codes.length);
});

test("danh sách môn học không chứa phần tử rỗng", () => {
  const { localStore } = installWith();

  // Mảng đến từ sandbox nên dùng so sánh độ dài; deepEqual sẽ vướng khác biệt prototype.
  const emptyCodes = localStore.get("subjects").filter((code) => !code || !code.trim());
  const emptyNames = localStore.get("subjectsName").filter((name) => !name || !name.trim());

  assert.equal(emptyCodes.length, 0, `có mã môn rỗng: ${[...emptyCodes].join(", ")}`);
  assert.equal(emptyNames.length, 0, `có tên môn rỗng: ${[...emptyNames].join(", ")}`);
});

test("bản cập nhật (reason=update) không ghi đè cấu hình người dùng", () => {
  const { syncStore, localStore } = installWith({ reason: "update" });

  assert.equal(syncStore.size, 0);
  assert.equal(localStore.size, 0);
});
