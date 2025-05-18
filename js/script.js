// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out'
});

// Navbar scroll effect
const navbarScrollHandler = () => {
    const navbar = document.querySelector('.navbar');
    window.scrollY > 50 
        ? navbar.classList.add('scrolled')
        : navbar.classList.remove('scrolled');
};
window.addEventListener('scroll', navbarScrollHandler);

// Smooth scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        
        const offset = 70;
        const position = target.offsetTop - offset;
        
        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });
        
        // Update URL hash
        history.pushState(null, null, href);
    });
});

// Back to Top Button
const backToTopHandler = () => {
    const backToTop = document.querySelector('.back-to-top');
    window.pageYOffset > 300 
        ? backToTop.style.display = 'block'
        : backToTop.style.display = 'none';
};

window.addEventListener('scroll', backToTopHandler);
document.querySelector('.back-to-top').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Project Modal Handler
const initProjectModals = () => {
    const projectModal = document.getElementById('projectModal');
    if (!projectModal) return;

    const basePath = 'images/';
    const imgElement = document.querySelector('.modal-project-image');
    const techContainer = document.querySelector('.modal-project-tech');
    const linksContainer = document.querySelector('.modal-project-links');

    const getImageWithCacheBust = (filename) => {
        return `${basePath}${filename}?v=${Date.now()}`;
    };

    const updateModalContent = (data) => {
        // Update konten utama
        document.getElementById('projectModalLabel').textContent = data.title;
        document.querySelector('.modal-project-description').textContent = data.description;
        document.querySelector('.modal-project-date').textContent = data.date;

        // Handle gambar
        imgElement.src = getImageWithCacheBust(data.image);
        imgElement.alt = data.title;
        
        // Error handling
        imgElement.onerror = () => {
            console.error('Gagal memuat gambar:', imgElement.src);
            imgElement.src = `${basePath}image-error.jpg`;
            imgElement.alt = 'Gambar tidak tersedia';
        };

        // Update teknologi
        techContainer.innerHTML = data.tech.map(t => 
            `<span class="badge bg-dark me-1 mb-1">${t}</span>`
        ).join('');

        // Update links
        linksContainer.innerHTML = '';
        
        if(data.demo && data.demo !== '#') {
            linksContainer.innerHTML += `
                <a href="${data.demo}" 
                   class="btn btn-primary btn-sm me-2 mb-2"
                   target="_blank"
                   rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt me-1"></i> Demo
                </a>`;
        }
        
        if(data.repo) {
            linksContainer.innerHTML += `
                <a href="${data.repo}" 
                   class="btn btn-outline-dark btn-sm mb-2"
                   target="_blank"
                   rel="noopener noreferrer">
                    <i class="fab fa-github me-1"></i> Repository
                </a>`;
        }
    };

    projectModal.addEventListener('show.bs.modal', (event) => {
        const trigger = event.relatedTarget;
        const projectData = {
            title: trigger.dataset.title,
            image: trigger.dataset.image,
            description: trigger.dataset.description,
            tech: JSON.parse(trigger.dataset.tech),
            date: trigger.dataset.date,
            demo: trigger.dataset.demoLink,
            repo: trigger.dataset.repoLink
        };
        updateModalContent(projectData);
    });
};

// Contact Form Handler
const initContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Mengirim...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                alert('Pesan berhasil dikirim!');
                form.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            alert('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Kirim Pesan';
        }
    });
};

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    initProjectModals();
    initContactForm();
});