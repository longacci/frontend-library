import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BarChart from "../../components/user/BarChart";
import LineChartComponent from "../../components/user/LineChartComponent";
import PieChartComponent from "../../components/user/PieChartComponent";
import MapComponent from "../../components/user/MapComponent";
import LoadingScreen from "../../components/user/LoadingScreen";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-blue-600 hover:scale-110 transition-transform duration-200 absolute right-2 z-10`}
      style={{ ...style }}
      onClick={onClick}
    >
      ▶
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-blue-600 hover:scale-110 transition-transform duration-200 absolute left-2 z-10`}
      style={{ ...style }}
      onClick={onClick}
    >
      ◀
    </div>
  );
};

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    content: "",
  });
  const [status, setStatus] = useState(""); // Để hiển thị thông báo
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true,
    });

    const loadResources = async () => {
      try {
        const response = await axios.get(
          "https://librarybe-f7dpbmd5fte9ggd7.southeastasia-01.azurewebsites.net/transactions/topBorrow"
        );
        setMostBorrowedBooks(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi tải tài nguyên", error);
      }
    };

    loadResources();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://librarybe-f7dpbmd5fte9ggd7.southeastasia-01.azurewebsites.net/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setStatus("Thông tin của bạn đã được gửi đi!");
        setFormData({ name: "", phoneNumber: "", email: "", content: "" }); // Reset form
      } else {
        setStatus("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };
  // Hàm xử lý khi click vào cuốn sách
  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`); // Điều hướng đến trang chi tiết sách
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="text-sky-500 flex flex-col overflow-hidden">
      <section>
        <main
          className="bg-cover bg-center bg-no-repeat w-full h-screen flex flex-col justify-center items-center px-40 py-5 text-center"
          style={{ backgroundImage: `url('/assets/images/home.png')` }}
          data-aos="fade-up"
        >
        <h1 className="text-6xl font-bold text-[#6e6060] pb-12">
      Mỗi Cuốn Sách, Một Hành Trình
    </h1>
    <p className="text-[#6e6060] text-2xl leading-relaxed max-w-lg italic mb-5">
      Cùng sách, bạn sẽ bước vào những chuyến phiêu lưu kỳ thú và mở mang trí óc với những câu chuyện đầy cảm hứng.
    </p>
    {/* Button */}
    <button
      className="bg-[#5babd5] text-white mb-12 px-6 py-4 border border-gray-400 rounded font-bold mt-5 w-40 transition-all duration-300 hover:bg-[#3394c7]  hover:scale-105"
      data-aos="zoom-in"
      onClick={() => navigate("/category")}
    >
      MƯỢN NGAY
    </button>
  </main>
</section>



      {/* Collections */}
      <section>
        <div className="px-8 py-5">
          <h2
            className="text-4xl font-bold text-center mb-5"
            data-aos="fade-right"
          >
            Danh sách được mượn nhiều
          </h2>
          <p
            className="text-xl text-gray-600 text-center mb-10"
            data-aos="fade-right"
          >
            Những cuốn sách được yêu thích nhất tại thư viện.
          </p>
          <div
            className="relative rounded-lg p-5 shadow-lg"
            data-aos="fade-right"
          >
            <Slider {...settings}>
              {mostBorrowedBooks.map((book, index) => (
                <div
                  key={index}
                  className="px-4 py-4 relative group overflow-hidden rounded-lg shadow-lg flex flex-col h-[450px] hover:shadow-lg hover:scale-110 transition-transform duration-300" // chiều cao cố định
                  onClick={() => handleBookClick(book._id)} //click vào cuốn sách thì hiển thị chi tiết cuốn sách đó
                >
                  <div className="w-full h-[300px] relative flex-shrink-0">
                    <img
                      src={book.img}
                      alt={book.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                    />
                    {/* <div className="absolute inset-0 bg-gray-900 bg-opacity-30 opacity-0 group-hover:opacity-100 transition duration-300"></div> */}
                  </div>
                  <div className="p-4 bg-white flex flex-col justify-between flex-grow">
                    <p className="text-sm text-gray-500">{book.bookId} - {book.author}</p>
                    <h3 className="text-lg text-black font-semibold">{book.title}</h3>
                    <p className="text-sm text-gray-400">
                      Số lượt mượn:{" "}
                      <span className="font-bold">{book.borrowCount}</span>
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Thống kê Section */}
      <section>
  <div className="w-[90%] mx-auto" data-aos="fade-right">
    <h2 className="text-4xl font-bold text-center mb-5 mt-10 border-gray-300 pb-4">
      Thống kê
    </h2>
    <div className="flex gap-5 mt-16">
      <div
        className="flex-[60%] bg-white rounded shadow-lg h-[70vh] p-5"
        data-aos="fade-up"
      >
        <BarChart />
      </div>
      <div
        className="flex-[40%] rounded p-5 flex items-center shadow-lg justify-center bg-cover bg-center text-center"
        style={{
          backgroundImage: `url('/assets/images/bgthongke.png')`, // Thêm hình nền vào đây
        }}
        data-aos="fade-left"
      >
        <p className="text-2xl italic text-[#6e6060]">
          Số lượng mượn sách tại thư viện khác nhau theo thể loại, phản ánh sở thích đa dạng của độc giả. Tiểu thuyết và sách lãng mạn được mượn nhiều nhờ tính giải trí, trong khi sách nghiên cứu và học thuật có giá trị cao với sinh viên, giới nghiên cứu. Sách thiếu nhi và kỹ năng sống thu hút phụ huynh, người làm giáo dục. Sự khác biệt này giúp thư viện điều chỉnh tài liệu và dịch vụ phù hợp.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Thống kê 2 Section */}
      <section>
  <div className="w-[90%] mx-auto mt-10" data-aos="fade-up">
    <div className="flex gap-5 mt-16 ">
      <div
        className="flex-[60%] bg-white rounded shadow-lg h-[70vh] p-5"
        data-aos="fade-up"
      >
        <LineChartComponent />
      </div>
      <div
        className="flex-[40%] rounded p-5 flex items-center shadow-lg justify-center bg-cover bg-center text-center"
        style={{
          backgroundImage: `url('/assets/images/bgthongke.png')` // Thêm hình nền vào đây
        }}
        data-aos="fade-left"
      >
        <p className="text-2xl italic text-[#6e6060]">
          Thư viện của chúng tôi không chỉ là nơi lưu trữ sách, mà còn là nơi khơi nguồn cảm hứng cho tất cả độc giả. Từ những cuốn sách khoa học đến tiểu thuyết hay văn học thiếu nhi, chúng tôi cam kết mang lại nguồn tri thức vô tận cho mọi lứa tuổi.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Thống kê 3 Section */}
      <section>
        <div className="w-[90%] mx-auto mt-10" data-aos="fade-up">
          <div className="flex gap-5 mt-16">
            <div
              className="flex-[60%] bg-white rounded shadow-lg h-[70vh] p-5"
              data-aos="fade-up"
            >
              <PieChartComponent />
            </div>
            <div
        className="flex-[40%] rounded p-5 flex items-center shadow-lg justify-center bg-cover bg-center text-center"
        style={{
          backgroundImage: `url('/assets/images/bgthongke.png')`,height: `363px !important` // Thêm hình nền vào đây
        }}
        data-aos="fade-left"
      >
        <p className="text-2xl italic text-[#6e6060] ">
          Số lượng mượn sách tại thư viện khác nhau theo thể loại, phản ánh sở thích đa dạng của độc giả. Tiểu thuyết và sách lãng mạn được mượn nhiều nhờ tính giải trí, trong khi sách nghiên cứu và học thuật có giá trị cao với sinh viên, giới nghiên cứu. Sách thiếu nhi và kỹ năng sống thu hút phụ huynh, người làm giáo dục. Sự khác biệt này giúp thư viện điều chỉnh tài liệu và dịch vụ phù hợp.
        </p>
      </div>
          </div>
        </div>
      </section>

      {/* Liên hệ Section */}
      <section>
        <div className="flex flex-col items-center justify-start px-8 py-10 min-h-screen bg-gray-50">
          <h1
            className="text-2xl font-bold bg-[#0abaff] text-white px-6 py-3 rounded-md text-center shadow-lg mb-10"
            data-aos="fade-up"
          >
            LIÊN HỆ VỚI CHÚNG TÔI
          </h1>

          <div className="flex flex-row justify-between w-full max-w-6xl gap-8">
            {/* Form điền thông tin */}
            <form
              className="flex flex-col w-full lg:w-1/2 bg-white p-6 rounded-md shadow-lg"
              data-aos="fade-up"
              onSubmit={(e) => handleSubmit(e)}
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Họ tên:"
                className="w-full p-3 mb-4 rounded-md border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Số điện thoại:"
                className="w-full p-3 mb-4 rounded-md border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email:"
                className="w-full p-3 mb-4 rounded-md border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Gửi cho chúng tôi:"
                className="w-full p-3 mb-4 rounded-md border border-gray-300 bg-gray-100 h-36 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              ></textarea>
              <button
                type="submit"
                className="w-full px-5 py-3 text-lg font-semibold text-white bg-[#0abaff] rounded-md hover:bg-green-600 transition-shadow shadow-md"
              >
                Gửi đi
              </button>
            </form>

            {/* Bản đồ */}
            <div className="w-full lg:w-1/2 bg-gray-100 rounded-md shadow-lg overflow-hidden">
              <div
                className="h-[400px] flex items-center justify-center"
                data-aos="fade-up"
              >
                <MapComponent />
              </div>
            </div>
          </div>

          {/* Hiển thị thông báo trạng thái */}
          {status && (
            <p className="text-green-500 text-lg mt-4" data-aos="fade-up">
              {status}
            </p>
          )}
        </div>
        {/* Nút Scroll to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          ⬆
        </button>
      </section>
    </div>
  );
}

export default HomePage;
