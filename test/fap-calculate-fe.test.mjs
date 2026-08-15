/**
 * Test cho content/fap_calculate_fe.js — tính điểm Final Exam tối thiểu để qua môn.
 *
 * Script này bám chặt vào DOM của FAP nên được nạp vào một trang jsdom mô phỏng bảng điểm
 * thật, cùng bản jQuery được đóng gói sẵn trong extension.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

import { createChromeStub, readExtensionFile } from "./helpers/extension-context.mjs";

const jquerySource = readExtensionFile("utils/jquery.js");
const scriptSource = readExtensionFile("content/fap_calculate_fe.js");

/** Một dòng điểm thường của FAP: [nhóm, tên đầu điểm, trọng số, điểm, ghi chú]. */
const gradeRow = (group, name, weight, value) =>
  `<tr><td>${group}</td><td>${name}</td><td>${weight} %</td><td>${value}</td><td></td></tr>`;

/** Dòng Final Exam: [tên đầu điểm, trọng số, điểm, ghi chú] — trọng số nằm ở cột 2. */
const finalExamRow = (weight, value = 0) =>
  `<tr><td>Final Exam</td><td>${weight} %</td><td>${value}</td><td></td></tr>`;

const buildPage = (rows) => `
  <div id="ctl00_mainContent_divGrade">
    <table>
      <caption>Grade of PRJ301</caption>
      <tbody>${rows.join("")}</tbody>
    </table>
  </div>`;

/**
 * Dựng trang FAP giả, nạp jQuery + script, trả về hàm chạy phép tính và đọc kết quả.
 *
 * Lưu ý: script chụp danh sách dòng điểm ngay lúc nạp, nên DOM phải dựng xong trước.
 */
const loadCalculator = (rows) => {
  const dom = new JSDOM(buildPage(rows), { runScripts: "outside-only" });
  const { window } = dom;

  window.eval(jquerySource);
  // main() chỉ chạy khi công tắc FAP_4 bật; tắt để test gọi calculateGrade trực tiếp.
  window.getFromStorage = () => Promise.resolve(false);
  window.chrome = createChromeStub().chrome;
  window.fetch = () => Promise.reject(new Error("không được gọi mạng trong test"));

  // `label` và `calculateGrade` là khai báo cấp cao nhất của script; eval không để lộ
  // binding `const` ra ngoài nên phải xuất chúng ngay trong cùng lần eval.
  window.eval(`${scriptSource}\n;globalThis.__fap = { calculateGrade, label };`);

  // label vốn được nạp từ messages.json qua fetch; ở đây gán thẳng nhãn tối thiểu.
  Object.assign(window.__fap.label, {
    feToPass: { message: "Điểm FE cần" },
    mark: { message: "điểm" },
    avg: { message: "Điểm mong muốn" },
    calculate: { message: "Tính" },
  });

  return {
    window,
    calculate: (target) =>
      target === undefined ? window.__fap.calculateGrade() : window.__fap.calculateGrade(target),
    result: () => window.document.getElementById("fe")?.textContent ?? "",
    resultValue: () => {
      const match = window.document.getElementById("fe")?.textContent.match(/(\d+\.\d{2})/);
      return match ? Number(match[1]) : null;
    },
  };
};

test("tính đúng điểm FE cần thiết theo trọng số các đầu điểm", () => {
  // PT 20% x 8 = 1.6 ; ASM 30% x 7 = 2.1 → đã có 3.7 ; FE chiếm 50%
  // cần (8 - 3.7) / 0.5 = 8.60
  const calculator = loadCalculator([
    gradeRow("Progress Test", "PT1", 20, 8),
    gradeRow("Assignment", "ASM1", 30, 7),
    finalExamRow(50),
  ]);

  calculator.calculate(8);

  assert.equal(calculator.resultValue(), 8.6);
});

test("kết quả không bao giờ thấp hơn 4 — điểm liệt của FE", () => {
  // Đã có 3.7/10, mục tiêu 5 → về mặt số học chỉ cần 2.6, nhưng FAP quy định
  // dưới 4 điểm FE là trượt nên phải trả về 4.00.
  const calculator = loadCalculator([
    gradeRow("Progress Test", "PT1", 20, 8),
    gradeRow("Assignment", "ASM1", 30, 7),
    finalExamRow(50),
  ]);

  calculator.calculate(5);

  assert.equal(calculator.resultValue(), 4);
});

test("mặc định tính theo mục tiêu 5 điểm khi không truyền tham số", () => {
  const calculator = loadCalculator([
    gradeRow("Progress Test", "PT1", 40, 9),
    finalExamRow(60),
  ]);

  // 9 x 0.4 = 3.6 ; (5 - 3.6) / 0.6 = 2.33 → dưới 4 nên chốt 4.00
  calculator.calculate();

  assert.equal(calculator.resultValue(), 4);
});

test("đầu điểm chưa có điểm (giá trị 0) không được tính vào tổng", () => {
  const withZero = loadCalculator([
    gradeRow("Progress Test", "PT1", 20, 8),
    gradeRow("Assignment", "ASM1", 30, 0),
    finalExamRow(50),
  ]);
  const withoutRow = loadCalculator([
    gradeRow("Progress Test", "PT1", 20, 8),
    finalExamRow(50),
  ]);

  withZero.calculate(9);
  withoutRow.calculate(9);

  assert.equal(withZero.resultValue(), withoutRow.resultValue());
});

test("dòng Final Exam không được cộng vào tổng điểm đã có", () => {
  // FE đã có điểm 10 nhưng vẫn phải bị bỏ qua khi tính tổng
  const calculator = loadCalculator([
    gradeRow("Progress Test", "PT1", 50, 6),
    finalExamRow(50, 10),
  ]);

  // chỉ tính 6 x 0.5 = 3 → (10 - 3) / 0.5 = 14.00
  calculator.calculate(10);

  assert.equal(calculator.resultValue(), 14);
});

test("kết quả hiển thị kèm nhãn đã dịch và làm tròn 2 chữ số", () => {
  const calculator = loadCalculator([
    gradeRow("Progress Test", "PT1", 20, 8),
    gradeRow("Assignment", "ASM1", 30, 7),
    finalExamRow(50),
  ]);

  calculator.calculate(8);

  assert.match(calculator.result(), /ĐIỂM FE CẦN: 8\.60 ĐIỂM/);
});

test("tính lại lần thứ hai cập nhật tại chỗ, không tạo thêm thẻ kết quả", () => {
  const calculator = loadCalculator([
    gradeRow("Progress Test", "PT1", 20, 8),
    gradeRow("Assignment", "ASM1", 30, 7),
    finalExamRow(50),
  ]);

  calculator.calculate(8);
  calculator.calculate(9);

  assert.equal(calculator.window.document.querySelectorAll("#fe").length, 1);
  assert.equal(calculator.resultValue(), 10.6);
});
