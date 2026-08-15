# FU Autokit

![Manifest Version](https://img.shields.io/badge/manifest-v3-blue)
![License](https://img.shields.io/badge/license-Apache--2.0-green)
![Version](https://img.shields.io/badge/version-3.4-orange)

**FU Autokit** là 1 extension cho các trình duyệt nhân Chromium (Chrome, Edge, Cốc Cốc, Opera, vv), giúp cho cuộc sống sinh viên trường F dễ thở hơn qua việc tiết kiệm thời gian trên hệ thống web nhà trường và 1 số trang web liên quan.

#### Đây là bộ công cụ tổng hợp từ nhiều nguồn

## Mục lục

- [Các chức năng chính](#các-chức-năng-chính)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hướng dẫn Cài đặt và Sử dụng](#hướng-dẫn-cài-đặt-và-sử-dụng)
- [Chạy test](#chạy-test)
- [Tác giả](#tác-giả)
- [Nguồn tham khảo và ghi công](#nguồn-tham-khảo-và-ghi-công)
- [Đóng góp](#đóng-góp)
- [License](#license)

## Các chức năng chính

### Hỗ trợ cho cả email FPT Edu (K18 về trước) và FE-ID (K19 trở đi)

Một tài khoản khai báo một lần, dùng chung cho toàn bộ các cổng bên dưới.

1. [FAP](https://fap.fpt.edu.vn/)
   - Tự động đăng nhập
   - Tính GPA
   - Tính điểm FE cần đạt để pass môn / đạt điểm trung bình tùy ý
   - Sắp xếp các bảng môn học, học phí
2. [CMS](https://cmshn.fpt.edu.vn/)
   - Tự động đăng nhập
   - Tool CMS cải tiến
3. [EduNext](https://fu-edunext.fpt.edu.vn/)
   - Tự động đăng nhập
4. [FLM](https://flm.fpt.edu.vn/)
   - Tự động đăng nhập
   - Tự động chuyển sang tiếng Việt
   - Thêm gợi ý khi tìm kiếm mã môn / ngành học
5. [Library](https://library.fpt.edu.vn/)
   - Tự động điền tài khoản - mật khẩu
6. [DNG](https://dng.fpt.edu.vn/Invoice)
   - Tự động điền mã số sinh viên
7. [On Campus Dormitory](https://ocd.fpt.edu.vn/)
   - Tự động đăng nhập
8. [OJTMS](https://ojt.fpt.edu.vn/)
   - Tự động đăng nhập
9. [Coursera](https://www.coursera.org/)
   - Tự động đăng nhập

### Tiện ích chung

- Chuyển nhanh sang các cổng của FPTU ngay từ popup
- Đa ngôn ngữ Việt / Anh
- Giao diện Sáng / Tối / theo Hệ thống
- Bật tắt từng tính năng riêng lẻ

### Thông tin đăng nhập được lưu ở đâu

Toàn bộ thông tin bạn nhập được lưu bằng `chrome.storage` của chính trình duyệt và chỉ dùng để điền vào form đăng nhập của các cổng tương ứng. Extension không gửi thông tin đăng nhập tới bất kỳ máy chủ nào của dự án — dự án không có máy chủ.

## Cấu trúc dự án

```
FU-Autokit/
├── .idea/            # Cấu hình JetBrains IDE (tùy chọn)
├── .vscode/          # Cấu hình VS Code (tùy chọn)
├── _locales/         # Bản dịch đa ngôn ngữ (vi, en)
├── assets/           # Icon, logo, ảnh minh họa
├── content/          # Content scripts cho từng trang web (FAP, CMS, FLM, ...)
├── popup/            # Giao diện popup của extension
├── service/          # Service worker và các script nền
├── utils/            # Thư viện dùng chung (jQuery, Bootstrap, CSS, storage helper)
├── windows/          # Cửa sổ phụ
├── test/             # Test tự động (Node test runner) — không đóng gói vào extension
├── .gitignore
├── LICENSE
├── manifest.json     # Manifest V3 khai báo permissions, content_scripts, background
├── package.json      # Chỉ phục vụ test; extension vẫn chạy không cần Node
└── README.md
```

## Hướng dẫn Cài đặt và Sử dụng

### Hướng dẫn Cài đặt

**Bước 1**: Tải mã nguồn về máy — bấm nút **Code** ở đầu trang này rồi chọn **Download ZIP**.

Hoặc nếu bạn có sẵn Git:

```bash
git clone https://github.com/TNL293107/FU-Autokit.git
```

**Bước 2**: Nhấn vào icon **Extension**, chọn **Quản lý các tiện ích**.

![hogo9espkb](https://github.com/makecolour/FU-Autokit/assets/79389129/10ba6e2a-72c1-47ea-bb4d-d91408531b2f)

**Bước 3**: Bật **Chế độ nhà phát triển** / **Developer Mode**.

![msedge_z7IEZN2sRj](https://github.com/makecolour/FU-Autokit/assets/79389129/093ef386-ff07-4d76-886e-e522564aec1e)

**Bước 4**: Nếu tải bản ZIP thì giải nén bằng [Winrar](https://www.win-rar.com/start.html?&L=0) hoặc [7-zip](https://www.7-zip.org/). Nếu dùng `git clone` thì bỏ qua bước này.

![explorer_VmMs6hHmA9](https://github.com/makecolour/FU-Autokit/assets/79389129/1ab1e7ea-c83a-48cb-93fe-99b988167442)

> Mình đang dùng 7-zip. Giải nén bẳng Winrar vẫn như thế nhé (Unzip / Extract Here)

**Bước 5**: Nhấn vào **Load Unpacked** / **Tải tiện ích đã giải nén** và chọn folder chứa `manifest.json`.

![msedge_ySpflV7rFw](https://github.com/makecolour/FU-Autokit/assets/79389129/3bf2b9e2-ada4-42cb-a76d-3ee19bc52117)

### Hướng dẫn sử dụng

**Bước 1**: Nhấn vào icon **Extension** và chọn FU Autokit ở góc trên phải của Chrome / Edge.

![HTvpDXahJq](https://github.com/makecolour/FU-Autokit/assets/79389129/913f265a-f057-4e69-8387-eef588f1cd31)

**Bước 2**: Chọn các nút mũi tên cạnh các trang để bật các tính năng mà các bạn muốn bật

![mNBmp5dWpC](https://github.com/makecolour/FU-Autokit/assets/79389129/b93423de-0c0a-4865-9e91-cbea1c949e21)

> Tip 1: Bạn cũng có thể chuyển sang các trang của FPTU qua extension này (Các nút như FAP, CMS, vv.)
   ![cknIKJvUh3](https://github.com/makecolour/FU-Autokit/assets/79389129/7f45aa65-acf8-4cff-a2e7-e66d9ef3e502)

> Tip 2: Bạn cũng có thể chọn giao diện cho Extension bằng hình bánh răng ở góc và chọn giao diện mong muốn (Sáng / Tối / Hệ thống)
   ![K3bnUJCKSb](https://github.com/makecolour/FU-Autokit/assets/79389129/747a6ebb-12d9-44b7-b3fb-1aafdaad6492)

**Bước 3**: Chọn niên khoá của bạn (**K18 trở về trước** hay **K19 trở đi**) và nhấn **Xác nhận**.

![lzNlYNCPXB](https://github.com/makecolour/FU-Autokit/assets/79389129/d28b82ed-c2fe-49cb-ab31-532fa2145bb5)

**Bước 4**: Chọn **Cơ sở đang theo học**, nhập **Mã số SV**, **Email** (mail FPT Edu hoặc Email cá nhân đã đăng ký với trường) và **Mật khẩu Library** (*nếu nhớ*).

![KbaMYfIOqY](https://github.com/makecolour/FU-Autokit/assets/79389129/dce58171-2406-4feb-b855-fb764526396e)

**Bước 5**: Bấm **Save**.

![6Y38AqHoRx](https://github.com/makecolour/FU-Autokit/assets/79389129/3489e229-28bc-487d-9401-26d2971bb426)

**Bước 6**: Và thế là xong, chúc bạn có thời gian đẹp với FU-Autokit 😎.

> Tip 3: Bạn hoàn toàn có thể tắt pop-up của Tool CMS bằng cách nhấn phím `V` trên bàn phím ![image](https://github.com/makecolour/FU-Autokit/assets/62919926/0ed1a286-a4bd-4381-b72a-86e029122777)

> Tip 4: Nếu có chức năng không hoạt động, hãy thử reload lại trang

## Tác giả

Tổng hợp và phát triển bởi [Tran Nhat Long (TNL293107)](https://github.com/TNL293107)

## Nguồn tham khảo và ghi công

Dự án này tổng hợp và kế thừa ý tưởng lẫn mã nguồn từ nhiều tác giả khác. Xin ghi nhận đầy đủ tại đây:

| Tác giả | Nguồn |
|---|---|
| SonNVQ | [FAP Auto Login](https://chromewebstore.google.com/detail/fap-auto-login/hcekfkjfkcfoeohaponopofdhogpecif?hl=vi) |
| VuHK | [FPT GPA](https://chromewebstore.google.com/detail/fpt-gpa/pieacoaichghpileamnhephkedchnlba) |
| nguyenvancaoky | [cms-tool](https://github.com/nguyenvancaokyfpt/cms-tool) |
| JSClub | [FPTU-Toolkits](https://github.com/fu-js/FPTU-Toolkits) |
| AutoEdunext | [Chrome Web Store](https://chromewebstore.google.com/detail/auto-edunext/pdpfekfaombegelehblceefphdfacpia) |
| vuduchuy | [cousera-toolkit](https://github.com/vuduchuy1120/cousera-toolkit) |
| isanchop | [stuhack](https://github.com/isanchop/stuhack) |
| makecolour | [FU-Autokit](https://github.com/makecolour/FU-Autokit) — bản gốc của dự án này |
| Không rõ tác giả | [Công cụ tính điểm FE](https://drive.google.com/file/d/1OdRFtmpg8B2c06XMEpXo4CDmSF07f01V/view?usp=sharing) |

Nếu bạn là tác giả của một phần mã nguồn trong đây và muốn được ghi công khác đi, hoặc muốn gỡ bỏ, hãy mở một issue.

## Chạy test

Extension không cần Node để chạy — `package.json` chỉ phục vụ bộ test.

```bash
npm install
npm test
```

Bộ test dùng **Node test runner** có sẵn (`node --test`), phụ thuộc dev duy nhất là `jsdom`.

| File | Kiểm tra |
|------|----------|
| `test/manifest.test.mjs` | Mọi file mà `manifest.json` tham chiếu đều tồn tại; match pattern đúng cú pháp; script dùng `$()` hoặc `getFromStorage` phải được nạp sau `jquery.js` / `storage.js` |
| `test/locales.test.mjs` | `_locales/vi` và `_locales/en` cùng tập key, không có message rỗng, placeholder đều được khai báo |
| `test/service-worker.test.mjs` | Giá trị mặc định lúc cài đặt: `LANG` trỏ tới file có thật, đủ công tắc tính năng, `subjects`/`subjectsName` cùng độ dài, bản update không ghi đè cấu hình |
| `test/storage.test.mjs` | `setToStorage` / `getFromStorage` với `chrome.storage.sync` giả lập |
| `test/fap-calculate-fe.test.mjs` | Công thức tính điểm FE cần để qua môn, chạy trên trang FAP mô phỏng bằng jsdom + jQuery của extension |

Content script vốn là classic script chạy trong trang web, không phải ES module. Test nạp chúng
vào sandbox (`node:vm`) hoặc jsdom kèm API `chrome` giả — xem `test/helpers/extension-context.mjs`.

## Đóng góp

Bạn có thể thoải mái đóng góp cho dự án. Bất kể đóng góp nào đến dự án nào đều được trân trọng.

## License

Dự án được bảo vệ bởi license Apache-2.0 - Xem thêm chi tiết tại [LICENSE](LICENSE).
