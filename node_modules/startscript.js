let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 5000); // Change slide every 2 seconds (2000 milliseconds)
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function toggleTip(tip) {
    const tipDetails = tip.querySelector('.tip-details');
    tipDetails.classList.toggle('show');
}
