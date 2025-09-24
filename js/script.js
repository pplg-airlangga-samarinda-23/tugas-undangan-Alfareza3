document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out'
    });
    
    // Initialize Supabase
    const supabaseUrl = 'https://huqyydzuxycgndhhcyup.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1cXl5ZHp1eHljZ25kaGhjeXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NzU1MjksImV4cCI6MjA3NDI1MTUyOX0.GytO7AFUoQ20UIRSMCIJS5TLxdCF2z1VjyubJyOhiBQ';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    // Music Control
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isPlaying = true;
    
    // Autoplay background music
    bgMusic.play().catch(error => {
        console.log('Autoplay prevented:', error);
        isPlaying = false;
        updateMusicButton();
    });
    
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
        } else {
            bgMusic.play();
        }
        isPlaying = !isPlaying;
        updateMusicButton();
    });
    
    function updateMusicButton() {
        const icon = musicToggle.querySelector('i');
        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    }
    
    // Countdown Timer
    function updateCountdown() {
        const weddingDate = new Date('February 1, 2026 09:00:00').getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = "<div class='countdown-item'><span class='countdown-value'>0</span><span class='countdown-label'>Hari</span></div><div class='countdown-item'><span class='countdown-value'>0</span><span class='countdown-label'>Jam</span></div><div class='countdown-item'><span class='countdown-value'>0</span><span class='countdown-label'>Menit</span></div><div class='countdown-item'><span class='countdown-value'>0</span><span class='countdown-label'>Detik</span></div>";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('countdown').innerHTML = 
            "<div class='countdown-item'><span class='countdown-value'>" + days + "</span><span class='countdown-label'>Hari</span></div>" +
            "<div class='countdown-item'><span class='countdown-value'>" + hours + "</span><span class='countdown-label'>Jam</span></div>" +
            "<div class='countdown-item'><span class='countdown-value'>" + minutes + "</span><span class='countdown-label'>Menit</span></div>" +
            "<div class='countdown-item'><span class='countdown-value'>" + seconds + "</span><span class='countdown-label'>Detik</span></div>";
    }
    
    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // RSVP Form Submission
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpAlert = document.getElementById('rsvpAlert');
    
    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nama = document.getElementById('nama').value;
        const jumlah_tamu = document.getElementById('jumlah_tamu').value;
        const status_kehadiran = document.querySelector('input[name="status_kehadiran"]:checked').value;
        const pesan = document.getElementById('pesan').value;
        
        try {
            const { data, error } = await supabase
                .from('rsvp')
                .insert([
                    {
                        nama: nama,
                        jumlah_tamu: parseInt(jumlah_tamu),
                        status_kehadiran: status_kehadiran,
                        pesan: pesan
                    }
                ]);
            
            if (error) {
                throw error;
            }
            
            // Show success message
            rsvpAlert.className = 'alert alert-success';
            rsvpAlert.textContent = 'Terima kasih! Konfirmasi kehadiran Anda telah berhasil dikirim.';
            rsvpAlert.style.display = 'block';
            
            // Reset form
            rsvpForm.reset();
            
            // Refresh wishes list
            fetchWishes();
            
            // Hide alert after 5 seconds
            setTimeout(() => {
                rsvpAlert.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            console.error('Error submitting RSVP:', error);
            
            // Show error message
            rsvpAlert.className = 'alert alert-danger';
            rsvpAlert.textContent = 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.';
            rsvpAlert.style.display = 'block';
            
            // Hide alert after 5 seconds
            setTimeout(() => {
                rsvpAlert.style.display = 'none';
            }, 5000);
        }
    });
    
    // Fetch and display wishes
    async function fetchWishes() {
        const wishesContainer = document.getElementById('wishesContainer');
        
        try {
            const { data, error } = await supabase
                .from('rsvp')
                .select('*')
                .order('waktu_submit', { ascending: false });
            
            if (error) {
                throw error;
            }
            
            if (data.length === 0) {
                wishesContainer.innerHTML = '<div class="text-center"><p>Belum ada ucapan. Jadilah yang pertama!</p></div>';
                return;
            }
            
            let wishesHTML = '';
            
            data.forEach(wish => {
                const date = new Date(wish.waktu_submit);
                const formattedDate = date.toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                const statusClass = wish.status_kehadiran === 'Hadir' ? 'status-hadir' : 'status-tidak-hadir';
                
                wishesHTML += `
                    <div class="wish-item" data-aos="fade-up">
                        <div class="wish-header">
                            <div class="wish-name">${wish.nama}</div>
                            <div class="wish-time">${formattedDate}</div>
                        </div>
                        <div>
                            <span class="wish-status ${statusClass}">${wish.status_kehadiran}</span>
                            ${wish.jumlah_tamu > 1 ? `<span class="wish-guests"><i class="fas fa-users"></i> ${wish.jumlah_tamu} tamu</span>` : ''}
                        </div>
                        ${wish.pesan ? `<div class="wish-message">"${wish.pesan}"</div>` : ''}
                    </div>
                `;
            });
            
            wishesContainer.innerHTML = wishesHTML;
            
            // Re-initialize AOS for new elements
            AOS.refresh();
            
        } catch (error) {
            console.error('Error fetching wishes:', error);
            wishesContainer.innerHTML = '<div class="text-center"><p>Maaf, terjadi kesalahan saat memuat ucapan.</p></div>';
        }
    }
    
    // Initial fetch of wishes
    fetchWishes();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Active navigation link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
});