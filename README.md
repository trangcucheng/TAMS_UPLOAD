# Phần mềm phát hiện đạo văn - TCCT

### Công nghệ sử dụng

- [ReactJs] Xây dựng web app
- Node version: 16.15.0
- Yarn version: 1.22.19

### Chạy dự án trên local

- Cài đặt dự án

```sh
// Bước 1: Di chuyển vào thư mục làm việc
cd TAMS_GUI

// Bước 2: cài đặt package thư viện
yarn install

// Bước 3: chạy ứng dụng
yarn start
```

- local app: http://localhost:3000


### Các scripts 
```sh
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject",
    "lint": "eslint src/**/*.js src/**/*.jsx",
    "lint:fix": "eslint src/**/*.js --fix"
  },
// Khởi chạy app
yarn start
### Sửa lỗi
yarn remove postcss-custom-properties
yarn add postcss-custom-properties@8.0.11

### Cấu trúc dự án
#### Thư mục gốc
- Chứa code frontend

### Quy tắc khi viết code
```
Sau đây là một số quy chuẩn đặt tên thường dùng trong dự án:
- Tên lớp đặt theo PascalCase, ví dụ: UserClass, CategoryClass…
- Tên hàm và phương thức sử dụng camelCase, ví dụ getUser, getCategory…
- Tên biến cũng sử dụng camelCase loginUser, categoryList…
- Tên hằng số thì đặc biệt, viết hoa hết và cách nhau bởi dấu gạch dưới LIST_SUBJECTS,...

```
#### Reactjs 
Gợi ý code reactjs: https://github.com/airbnb/javascript/tree/master/react

#### Copyright and license
 Code and Docs released under the MIT License.