document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  const indicatorsContainer = document.querySelector('.carousel-indicators');
  let slidesToShow = 1; // Số lượng slide hiển thị
  let slidesToMove = 1; // Số lượng slide di chuyển mỗi lần nhấp

  // Lấy kích thước của một slide
  const getSlideWidth = () => slides[0].getBoundingClientRect().width;

  // Cập nhật vị trí của các slide
  const updateSlidePositions = () => {
    const slideWidth = getSlideWidth();
    slides.forEach((slide, index) => {
      slide.style.left = (slideWidth + 10) * index + 'px'; // 10px margin
    });
  };

  // Cập nhật số lượng slide hiển thị và tạo các indicator
  const updateDisplay = () => {
    if (window.innerWidth > 1200) {
      slidesToShow = 5;
    } else if (window.innerWidth >= 700) {
      slidesToShow = 3;
    } else {
      slidesToShow = 1;
    }
    slidesToMove = 1; // Di chuyển 1 slide mỗi lần nhấp
    createIndicators();
    updateSlidePositions();
    updateButtonState();
  };

  // Di chuyển đến slide mục tiêu
  const moveToSlide = (currentSlide, targetSlide) => {
    if (currentSlide !== targetSlide) {
      track.style.transition = 'transform 0.5s ease-in-out'; // Đảm bảo chuyển tiếp mượt mà
      track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
      currentSlide.classList.remove('current-slide');
      targetSlide.classList.add('current-slide');
      updateButtonState();
      updateIndicators();
    }
  };

  // Di chuyển một số lượng slide cụ thể
  const moveSlidesBy = (currentSlide, numberOfSlides) => {
    const slideWidth = getSlideWidth();
    const currentIndex = slides.indexOf(currentSlide);
    const newIndex = Math.max(
      0,
      Math.min(slides.length - slidesToShow, currentIndex + numberOfSlides)
    );
    const targetSlide = slides[newIndex];
    moveToSlide(currentSlide, targetSlide);
  };

  // Cập nhật trạng thái các nút prev và next
  const updateButtonState = () => {
    const currentSlide = track.querySelector('.current-slide');
    const currentIndex = slides.indexOf(currentSlide);
    prevButton.disabled = currentIndex <= 0;
    nextButton.disabled = currentIndex >= slides.length - slidesToShow;
  };

  // Cập nhật trạng thái các indicator
  const updateIndicators = () => {
    const currentSlide = track.querySelector('.current-slide');
    const currentIndex = slides.indexOf(currentSlide);
    const indicators = Array.from(indicatorsContainer.children);
    const currentIndicatorIndex = Math.floor(currentIndex / slidesToShow);

    indicators.forEach((indicator, index) => {
      if (index === currentIndicatorIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  };

  // Tạo các indicator dựa trên số lượng slide và kích thước màn hình
  const createIndicators = () => {
    indicatorsContainer.innerHTML = '';
    const numIndicators = Math.ceil(slides.length / slidesToShow);

    for (let i = 0; i < numIndicators; i++) {
      const indicator = document.createElement('button');
      indicator.classList.add('carousel-indicator');
      indicator.addEventListener('click', () => {
        const currentSlide = track.querySelector('.current-slide');
        const targetIndex = i * slidesToShow;
        moveToSlide(currentSlide, slides[targetIndex]);
      });
      indicatorsContainer.appendChild(indicator);
    }

    updateIndicators();
  };

  // Xử lý sự kiện nhấp nút prev
  prevButton.addEventListener('click', () => {
    const currentSlide = track.querySelector('.current-slide');
    moveSlidesBy(currentSlide, -slidesToMove); // Di chuyển 1 slide về trước
  });

  // Xử lý sự kiện nhấp nút next
  nextButton.addEventListener('click', () => {
    const currentSlide = track.querySelector('.current-slide');
    moveSlidesBy(currentSlide, slidesToMove); // Di chuyển 1 slide về sau
  });

  // Khởi tạo slide đầu tiên, tạo indicators và cập nhật trạng thái nút
  slides[0].classList.add('current-slide');
  updateDisplay();

  // Cập nhật khi thay đổi kích thước màn hình
  window.addEventListener('resize', updateDisplay);
});
