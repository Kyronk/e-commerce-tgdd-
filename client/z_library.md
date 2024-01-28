# các thư viện cài đặt react js
    npm install -D tailwindcss , npx tailwindcss init : tải thư viện tailwindcss
    * module của tailwind
    npm i @tailwindcss/line-clamp

    react-router-dom 
    redux-persist
    react-toastify
    moment
    axios : https://axios-http.com/docs/interceptors
    
    react-slick: để làm cái tick tick next trang: đi kèm theo thằng này npm install slick-carousel
    
    sweetalert2 : tạo ra model thông báo
    
    use-react-router-breadcrumbs : tạo ra link phân loại

    react-image-magnify: hover zoom ảnh

    react-masonry-css : làm lưới list sản phẩm
    
    @tailwindcss/forms : bổ sung thêm cho tailwind

    moment: ???

    clsx : viết logic if else vào css of taiwind
    
    react-spinners : làm cái loading xoay xoay

    react-hook-form : xử lý form nhanh hơn
    
    @tinymce/tinymce-react & mce tiny : https://www.tiny.cloud/my-account/integrate/#html : cái này để tạo mẫu doc trên trang desc thông tin của sản phẩm,...

    dompurify : tinymce tạo text <p> nội dung </p>, dompurify giúp chuyển ra và hiẻn thị lại 

    npm i @paypal/react-paypal-js : làm cái thanh toán.

    npm i react-confetti : hiệu ứng chúc mừng (ví dụ như làm cho ứng dụng test, kết quả game, hoàn thành một cái gì đó....)
    npm i react-use : cài thêm chung vs thằng react confetti

    

# lỗi out không cài được thư viện
    - Do thư viện không còn được hỗ trợ
    - Do phiên bản react quá cao 18 19 and after ...
    & how to fix
    npm i <name package> --legacy-peer-deps 
    or npm i <name > --force

# tips create project với redux toolkit
    npx create-react-app my-app --template redux