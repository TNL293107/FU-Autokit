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
- [Tác giả](#tác-giả)
- [Đóng góp](#đóng-góp)
- [License](#license)

## Các chức năng chính
### Hỗ trợ cho cả email FPT Edu (K18 về trước) và FE-ID (K19 trở đi)

1. [FAP](https://fap.fpt.edu.vn/)
   - Tự động đăng nhập [^1]
   - Tự động hoàn thành đánh giá giảng viên [^2]
   - Tính GPA [^3]
   - Tính điểm FE cần đạt để pass môn/đạt điểm trung bình tùy ý [^4]
   - Sắp xếp các bảng môn học, học phí
2. [CMS](https://cmshn.fpt.edu.vn/)
   - Tự động đăng nhập
   - Tool CMS cải tiến [^5]
3. [EduNext](https://fu-edunext.fpt.edu.vn/)
   - Tự động đăng nhập
   - Tự động Grade on Groupmates [^6]
4. [FLM](https://flm.fpt.edu.vn/)
   - Tự động đăng nhập
   - Tự động chuyển sang tiếng Việt
   - Thêm gợi ý khi tìm kiếm mã môn/ngành học
5. [Library](https://library.fpt.edu.vn/)
   - Tự động điền tài khoản - mật khẩu
6. [DNG](https://dng.fpt.edu.vn/Invoice)
   - Tự động điền mã số sinh viên
7. [Coursera](https://www.coursera.org/)
   - Tự động đăng nhập
   - Lấy link chấm điểm [^7]
   - Tự động chấm điểm [^7]
8. [Studocu](https://www.studocu.com/) [^8]
   - Xóa bỏ paywall
   - Hỗ trợ download file
9. [On Campus Dormitory](https://ocd.fpt.edu.vn/)
   - Tự động đăng nhập
10. [OJTMS](https://ojt.fpt.edu.vn/)
    - Tự động đăng nhập

*Và còn nhiều tính năng khác chờ bạn khám phá...*

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
├── windows/          # Cửa sổ phụ (Coursera helper window)
├── .gitignore
├── LICENSE
├── manifest.json     # Manifest V3 khai báo permissions, content_scripts, background
└── README.md
```

## Hướng dẫn Cài đặt và Sử dụng
### Hướng dẫn Cài đặt

**Bước 1**: Tải xuống [bản release mới nhất](https://github.com/TNL293107/FU-Autokit/releases/latest).

![msedge_jGKu8NKwLP](https://github.com/makecolour/FU-Autokit/assets/79389129/0e821939-826f-4fca-a7a4-c13dd640852d)

**Bước 2**: Nhấn vào icon **Extension**, chọn **Quản lý các tiện ích**.

![hogo9espkb](https://github.com/makecolour/FU-Autokit/assets/79389129/10ba6e2a-72c1-47ea-bb4d-d91408531b2f)

**Bước 3**: Bật **Chế độ nhà phát triển** / **Developer Mode**.

![msedge_z7IEZN2sRj](https://github.com/makecolour/FU-Autokit/assets/79389129/093ef386-ff07-4d76-886e-e522564aec1e)

**Bước 4**: Giải nén các tệp sử dụng [Winrar](https://www.win-rar.com/start.html?&L=0) hoặc [7-zip](https://www.7-zip.org/).

![explorer_VmMs6hHmA9](https://github.com/makecolour/FU-Autokit/assets/79389129/1ab1e7ea-c83a-48cb-93fe-99b988167442)

> Mình đang dùng 7-zip. Giải nén bẳng Winrar vẫn như thế nhé (Unzip / Extract Here)

**Bước 5**:  Nhấn vào **Load Unpacked** / **Tải tiện ích đã giải nén** và chọn folder bạn vừa mới giải nén.

![msedge_ySpflV7rFw](https://github.com/makecolour/FU-Autokit/assets/79389129/3bf2b9e2-ada4-42cb-a76d-3ee19bc52117)

### Hướng dẫn sử dụng
**Bước 1**:  Nhấn vào icon **Extension** và chọn FU Autokit ở góc trên phải của Chrome / Edge.

![HTvpDXahJq](https://github.com/makecolour/FU-Autokit/assets/79389129/913f265a-f057-4e69-8387-eef588f1cd31)

**Bước 2**: Chọn các nút mũi tên cạnh các trang để bật các tính năng mà các bạn muốn bật

![mNBmp5dWpC](https://github.com/makecolour/FU-Autokit/assets/79389129/b93423de-0c0a-4865-9e91-cbea1c949e21)

> Tip 1: Bạn cũng có thể chuyển sang các trang của FPTU qua extension này (Các nút như FAP, CMS, vv.)
   ![cknIKJvUh3](https://github.com/makecolour/FU-Autokit/assets/79389129/7f45aa65-acf8-4cff-a2e7-e66d9ef3e502)

> Tip 2: Bạn cũng có thể chọn giao diện cho Extension bằng hình bánh răng ở góc và chọn giao diện mong muốn (Sáng / Tối / Hệ thống)
   ![K3bnUJCKSb](https://github.com/makecolour/FU-Autokit/assets/79389129/747a6ebb-12d9-44b7-b3fb-1aafdaad6492)

**Bước 3**:  Chọn niên khoá của bạn (**K18 trở về trước** hay **K19 trở đi**) và nhấn **Xác nhận**.

![lzNlYNCPXB](https://github.com/makecolour/FU-Autokit/assets/79389129/d28b82ed-c2fe-49cb-ab31-532fa2145bb5)

**Bước 4**: Chọn **Cơ sở đang theo học**, nhập **Mã số SV**, **Email** (mail FPT Edu hoặc Email cá nhân đã đăng ký với trường) và **Mật khẩu Library** (*nếu nhớ*).

![KbaMYfIOqY](https://github.com/makecolour/FU-Autokit/assets/79389129/dce58171-2406-4feb-b855-fb764526396e)

**Bước 5**: Bấm **Save**.

![6Y38AqHoRx](https://github.com/makecolour/FU-Autokit/assets/79389129/3489e229-28bc-487d-9401-26d2971bb426)

**Bước 6**: Và thế là xong, chúc bạn có thời gian đẹp với FU-Autokit 😎.

>Tip 3: Bạn hoàn toàn có thể tắt pop-up của Tool CMS bằng cách nhấn phím `V` trên bàn phím ![image](https://github.com/makecolour/FU-Autokit/assets/62919926/0ed1a286-a4bd-4381-b72a-86e029122777)

>Tip 4: Nếu có chức năng không hoạt động, hãy thử reload lại trang

## Tác giả

Tổng hợp và phát triển bởi [Tran Nhat Long (TNL293107)](https://github.com/TNL293107)

## Đóng góp
Bạn có thể thoải mái đóng góp cho dự án. Bất kể đóng góp nào đến dự án nào đều được trân trọng.

## License
Dự án được bảo vệ bởi license Apache-2.0 - Xem thêm chi tiết tại [LICENSE](LICENSE).

[^1]: Credit goes to [SonNVQ](https://chromewebstore.google.com/detail/fap-auto-login/hcekfkjfkcfoeohaponopofdhogpecif?hl=vi)
[^2]: Credit goes to [JSClub](https://github.com/fu-js/FPTU-Toolkits?tab=readme-ov-file#usage)
[^3]: Credit goes to [VuHK](https://chromewebstore.google.com/detail/fpt-gpa/pieacoaichghpileamnhephkedchnlba)
[^4]: Credit goes to [Unknown](https://drive.google.com/file/d/1OdRFtmpg8B2c06XMEpXo4CDmSF07f01V/view?usp=sharing)
[^5]: Credit goes to [nguyenvancaoky](https://github.com/nguyenvancaokyfpt/cms-tool)
[^6]: Credit goes to [AutoEdunext](https://chromewebstore.google.com/detail/auto-edunext/pdpfekfaombegelehblceefphdfacpia?fbclid=IwAR0ByrWCd7IOiTeT5FsueP3m2VhmCFXHjd6D2kVUrfQK-sYZSr7oquOm4lQ)
[^7]: Credit goes to [vuduchuy](https://github.com/vuduchuy1120/cousera-toolkit/tree/main)
[^8]: Credit goes to [isanchop](https://github.com/isanchop/stuhack)
