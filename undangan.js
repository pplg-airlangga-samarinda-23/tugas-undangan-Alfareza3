document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.querySelector('.carousel');
  const images = carousel.querySelectorAll('img');
  const prevBtn = carousel.querySelector('.prev');
  const nextBtn = carousel.querySelector('.next');
  let currentIndex = 0;

  function showImage(index) {
    images[currentIndex].classList.remove('active');
    images[index].classList.add('active');
    currentIndex = index;
  }

  prevBtn.addEventListener('click', function () {
    let index = currentIndex - 1;
    if (index < 0) index = images.length - 1;
    showImage(index);
  });

  nextBtn.addEventListener('click', function () {
    let index = currentIndex + 1;
    if (index >= images.length) index = 0;
    showImage(index);
  });
});