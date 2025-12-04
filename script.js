/* =========================================
   1. GLOBAL UI LOGIC
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Logo Scroll
    document.querySelectorAll('.logo').forEach(l => l.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }));

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });
    }

    // Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add('show-section'); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.hidden-section').forEach((el) => observer.observe(el));

    // Build Timeline if on Certificate Page
    if (document.getElementById('certificate-timeline-container')) {
        renderTimeline();
    }
});

// Navbar Shrink
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { navbar.classList.add('sticky'); } 
    else { navbar.classList.remove('sticky'); }
});

/* =========================================
   2. BACKGROUND PARTICLES (Clean Version)
   ========================================= */
const canvas = document.getElementById("particles-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particlesArray = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = '#00f2ff';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        for (let i = 0; i < 100; i++) particlesArray.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            // Connect lines
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 242, 255, ${1 - distance / 100})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
    init();
    animate();
}

// 3. HERO PHYSICS (BOUNCERS)
const heroVisual = document.querySelector('.hero-visual');
const bouncers = document.querySelectorAll('.bouncer');

if (heroVisual && bouncers.length > 0) {
    const iconsData = [];
    const iconSize = 50; 
    const constantSpeed = 1.5; 

    bouncers.forEach((icon) => {
        let x, y, overlap;
        let attempts = 0;
        do {
            overlap = false;
            x = Math.random() * (heroVisual.offsetWidth - iconSize);
            y = Math.random() * (heroVisual.offsetHeight - iconSize);
            for (let other of iconsData) {
                let dx = x - other.x;
                let dy = y - other.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < iconSize) { overlap = true; break; }
            }
            attempts++;
        } while (overlap && attempts < 100);

        let dirX = Math.random() < 0.5 ? -1 : 1;
        let dirY = Math.random() < 0.5 ? -1 : 1;
        iconsData.push({ element: icon, x, y, dx: constantSpeed * dirX, dy: constantSpeed * dirY });
    });

    function animateBouncers() {
        const containerW = heroVisual.offsetWidth;
        const containerH = heroVisual.offsetHeight;
        
        iconsData.forEach(data => {
            data.x += data.dx; data.y += data.dy;
            if (data.x + iconSize >= containerW || data.x <= 0) data.dx = -data.dx;
            if (data.y + iconSize >= containerH || data.y <= 0) data.dy = -data.dy;
        });

        for (let i = 0; i < iconsData.length; i++) {
            for (let j = i + 1; j < iconsData.length; j++) {
                let p1 = iconsData[i]; let p2 = iconsData[j];
                let dx = p1.x - p2.x; let dy = p1.y - p2.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < iconSize) {
                    let tempDx = p1.dx; let tempDy = p1.dy;
                    p1.dx = p2.dx; p1.dy = p2.dy;
                    p2.dx = tempDx; p2.dy = tempDy;
                    let overlap = iconSize - distance;
                    let offsetX = (dx/distance)*overlap*0.5; let offsetY = (dy/distance)*overlap*0.5;
                    p1.x += offsetX; p1.y += offsetY; p2.x -= offsetX; p2.y -= offsetY;
                }
            }
        }
        iconsData.forEach(data => {
            data.element.style.left = data.x + 'px';
            data.element.style.top = data.y + 'px';
        });
        requestAnimationFrame(animateBouncers);
    }
    animateBouncers();
}

/* =========================================
   4. CERTIFICATE DATA (TIMELINE FORMAT)
   ========================================= */
const detailedCertificates = [
    {
        year: "2023–2024 CERTIFICATIONS",
        categories: [
            {
                name: "Artificial Intelligence / Data Science",
                items: [
                    { title: "Introduction to Artificial Intelligence (AI)", issuer: "IBM", date: "Apr 23, 2023", pdf: "assets/certificates/ai_ibm.pdf" },
                    { title: "Python for Data Analysis: Pandas & NumPy", issuer: "Coursera", date: "Apr 23, 2023", pdf: "assets/certificates/python_pandas.pdf" }
                ]
            },
            {
                name: "Cybersecurity",
                items: [
                    { title: "Introduction to Cybersecurity Foundations", issuer: "Infosec", date: "Jul 06, 2023", pdf: "assets/certificates/cyber_intro.pdf" }
                ]
            },
            {
                name: "Cloud Computing",
                items: [
                    { title: "AWS Cloud Practitioner Essentials", issuer: "Amazon Web Services", date: "Jul 30, 2023", pdf: "assets/certificates/aws.pdf" }
                ]
            },
            {
                name: "Health & Psychology",
                items: [
                    { title: "Mindfulness & Well-being: Foundations", issuer: "Rice University", date: "Oct 09, 2023", pdf: "assets/certificates/mindfulness.pdf" },
                    { title: "Health Behavior Change", issuer: "Yale University", date: "Oct 08, 2023", pdf: "assets/certificates/health.pdf" }
                ]
            },
            {
                name: "Finance",
                items: [
                    { title: "Personal & Family Financial Planning", issuer: "Univ. of Florida", date: "Sep 29, 2023", pdf: "assets/certificates/finance.pdf" },
                    { title: "Introduction to Time Value of Money", issuer: "Univ. of Michigan", date: "Sep 29, 2023", pdf: "assets/certificates/tvm.pdf" }
                ]
            }
        ]
    },
    {
        year: "2022 CERTIFICATIONS",
        categories: [
            {
                name: "Programming & Software",
                items: [
                    { title: "Matrix Algebra for Engineers", issuer: "HKUST", date: "Jan 26, 2022", pdf: "assets/certificates/matrix.pdf" },
                    { title: "Everyday Excel Specialization (3 Parts)", issuer: "UC Boulder", date: "Jan 25, 2022", pdf: "assets/certificates/excel_spec.pdf" },
                    { title: "Introduction to Hardware and Operating Systems", issuer: "IBM", date: "Jun 07, 2022", pdf: "assets/certificates/hardware_os.pdf" }
                ]
            },
            {
                name: "Development",
                items: [
                    { title: "Programming for Everybody (Python)", issuer: "UMich", date: "Jan 25, 2022", pdf: "assets/certificates/python_umich.pdf" },
                    { title: "Python Data Structures", issuer: "UMich", date: "Feb 10, 2022", pdf: "assets/certificates/python_ds.pdf" },
                    { title: "C++ Basics: Selection & Iteration", issuer: "Codio", date: "Jun 21, 2022", pdf: "assets/certificates/cpp.pdf" }
                ]
            },
            {
                name: "Web Development",
                items: [
                    { title: "Introduction to Web Development", issuer: "IBM", date: "Jun 19, 2022", pdf: "assets/certificates/web_ibm.pdf" }
                ]
            }
        ]
    },
    {
        year: "2022–2023 (Database & Systems)",
        categories: [
            {
                name: "Databases",
                items: [
                    { title: "Database Management Essentials", issuer: "Univ. of Colorado", date: "Apr 01, 2023", pdf: "assets/certificates/db_mgmt.pdf" },
                    { title: "Introduction to Databases", issuer: "Meta", date: "Apr 01, 2023", pdf: "assets/certificates/db_meta.pdf" }
                ]
            },
            {
                name: "Unix / Bash / System",
                items: [
                    { title: "Unix System Basics", issuer: "Codio", date: "Dec 07, 2022", pdf: "assets/certificates/unix.pdf" },
                    { title: "Shell Scripting with Bash: Basics", issuer: "Coursera", date: "Dec 04, 2022", pdf: "assets/certificates/bash.pdf" }
                ]
            }
        ]
    },
    {
        year: "2021 CERTIFICATIONS",
        categories: [
            {
                name: "Soft Skills",
                items: [
                    { title: "Emotional & Social Intelligence", issuer: "UC Davis", date: "Dec 31, 2021", pdf: "assets/certificates/emotional.pdf" }
                ]
            }
        ]
    }
];

function renderTimeline() {
    const container = document.getElementById('certificate-timeline-container');
    if (!container) return; 
    container.innerHTML = "";

    detailedCertificates.forEach(yearGroup => {
        const yearDiv = document.createElement('div');
        yearDiv.className = 'cert-year-group';
        yearDiv.innerHTML = `<h3 class="cert-year-title">${yearGroup.year}</h3>`;

        yearGroup.categories.forEach(cat => {
            const catDiv = document.createElement('div');
            catDiv.innerHTML = `<h4 class="cert-category-title">${cat.name}</h4>`;
            
            cat.items.forEach(cert => {
                const row = document.createElement('div');
                row.className = 'cert-row';
                row.onclick = () => openPdfModal(cert.pdf, cert.title);
                
                let iconClass = "fas fa-certificate";
                if(cat.name.includes("Python")) iconClass = "fab fa-python";
                if(cat.name.includes("AI")) iconClass = "fas fa-brain";
                if(cat.name.includes("Security")) iconClass = "fas fa-shield-alt";
                if(cat.name.includes("Cloud")) iconClass = "fab fa-aws";
                if(cat.name.includes("Data")) iconClass = "fas fa-database";

                row.innerHTML = `
                    <div class="cert-details">
                        <h4>${cert.title}</h4>
                        <p><span class="cert-issuer">${cert.issuer}</span> • ${cert.date}</p>
                    </div>
                    <div class="cert-mini-thumb">
                        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#112240; color:#64ffda; font-size:2rem;">
                            <i class="${iconClass}"></i>
                        </div>
                    </div>
                `;
                catDiv.appendChild(row);
            });
            yearDiv.appendChild(catDiv);
        });
        container.appendChild(yearDiv);
        
        setTimeout(() => yearDiv.classList.add('revealed'), 100);
    });
}

function openPdfModal(pdfUrl, title) {
    const modal = document.getElementById('pdf-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('pdf-frame').src = pdfUrl;
    modal.style.display = 'flex';
}

function closePdfModal() {
    const modal = document.getElementById('pdf-modal');
    document.getElementById('pdf-frame').src = "";
    modal.style.display = 'none';
}