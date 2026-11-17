/* Home page partners: scrolling logo rows and the partner details dialog. */
(() => {
    const marquee = document.querySelector('#home-partners .logo-marquee');
    const modal = document.getElementById('partnerModal');
    if (!marquee || !modal) return;

    const partners = {
        td: {
            name: "TD Investments",
            logo: "images/logos/tdinvestments.svg",
            description: "",
            url: ""
        },
        rmit: {
            name: "RMIT University",
            logo: "images/logos/rmit.svg",
            description: "RMIT University is an international university of technology, design, and enterprise, recognized for practical education and impactful research. By bridging academic excellence with real-world industry collaboration, RMIT empowers students and partners to drive innovation, solve complex technical challenges, and shape future-ready industries.",
            url: "https://rmit.edu.au"
        },
        anmfc: {
            name: "ANMFC",
            logo: "images/logos/anmfc.svg",
            description: "ANMFC (Australian Nano-Manufacture Future Challenges) empowers young Australians to build advanced, future-ready manufacturing and technical skills. They connect young people with real challenges through design, digital fabrication, materials and hands-on making, bridging education and advanced engineering to foster the next generation of innovators.",
            url: "https://anmfc.com"
        },
        trinity: {
            name: "Trinity Grammar",
            logo: "images/logos/trinity.svg",
            description: "Trinity Grammar School is a leading educational institution committed to fostering holistic student development, critical thinking, and technical capability. Through robust curricular and co-curricular STEM initiatives, Trinity encourages young minds to explore complex problem-solving and hands-on engineering challenges.",
            url: "https://trinity.vic.edu.au"
        },
        rea: {
            name: "REA Foundation",
            logo: "images/logos/rea.svg",
            description: "The REA Foundation facilitates transformative STEM career education programs, linking schools, industry, TAFE and universities to fundamentally shift student and teacher capabilities. By engaging young people in authentic, project-based learning, REA inspires students to take up STEM  career pathways after school.",
            url: "https://rea.org.au"
        },
        fastpreci: {
            name: "FastPreci",
            logo: "images/logos/fastpreci.svg",
            description: "FastPreci is an engineering-oriented custom manufacturing partner specializing in precision CNC machining for prototypes and production parts. We help engineers and procurement teams turn designs into reliable, manufacturable components through responsive engineering support, practical DFM feedback, consistent quality control, and flexible production capabilities. From complex prototypes to repeat production, FastPreci supports customers with clear communication and dependable execution.",
            url: "https://www.fastpreci.com"
        },
        rocketdigital: {
            name: "Rocket Digital",
            logo: "images/logos/rocketdigital.svg",
            description: "Rocket Digital specialises in high quality, large format digital printing. They're not just printers, they're partners, striving to exceed excpectations every time. Rocket Digital take pride in their work and don't compromise on quality. Passion and experience combine with the latest technology to deliver true innovation.",
            url: "https://rocketdigital.com.au"
        },
        strend: {
            name: "Strend",
            logo: "images/logos/strend.svg",
            description: "S-Trend creates exceptional apparel tailored for athletes and organizations. Leveraging digital 3D simulation technology, sustainable materials, and advanced technical fabrications, S-Trend delivers durable, professional-grade kits designed to perform under demanding conditions.",
            url: "https://www.s-trend.com.au"
        },
        pcbway: {
            name: "PCBWay",
            logo: "images/logos/pcbway.svg",
            description: "PCBWay is a premier advanced manufacturing partner specializing in PCB prototyping, multi-layer circuit board fabrication, and full-turnkey contract assembly. Known for rapid turnaround times and rigorous quality assurance, they empower engineers and innovators worldwide to bring complex electronic hardware designs to life efficiently.",
            url: "https://www.pcbway.com"
        },
        o3d: {
            name: "Objective3D",
            logo: "images/logos/o3d.svg",
            description: "Objective3D is a leading additive manufacturing and 3D printing solutions provider across Australasia, offering cutting-edge Stratasys hardware, materials, and bureau services. They help engineers and designers bridge the gap between digital concepts and functional physical reality through rapid prototyping and expert technical support.",
            url: "https://objective3d.com.au"
        },
        ansys: {
            name: "Ansys",
            logo: "images/logos/ansys.svg",
            description: "Ansys is a global leader in engineering simulation software, empowering design and development teams to predict how products behave under real-world physical conditions. By providing advanced tools for structural analysis, fluid dynamics, and multiphysics modeling, Ansys helps innovators optimize performance and reduce physical prototyping costs.",
            url: "https://ansys.synopsys.com"
        },
        autodesk: {
            name: "Autodesk",
            logo: "images/logos/autodesk.svg",
            description: "Autodesk is a global technology leader providing robust 3D design, engineering, and entertainment software. Their industry-standard tools empower creators, architects, and engineers to imagine, design, and fabricate complex systems digitally, streamlining workflows from conceptual modeling to advanced manufacturing.",
            url: "https://autodesk.com"
        },
        alfaromeo: {
            name: "Alfa Romeo",
            logo: "images/logos/alfaromeo.svg",
            description: "Alfa Romeo is a historic Italian automotive manufacturer renowned for its rich racing heritage, distinctive design philosophy, and high-performance engineering. Blending Italian passion with advanced automotive craftsmanship, the brand symbolizes speed, agility, and a relentless pursuit of driving excellence.",
            url: "https://alfaromeo.com.au"
        },
        jaguar: {
            name: "Jaguar",
            logo: "images/logos/jaguar.svg",
            description: "Jaguar is a globally celebrated luxury automotive brand famous for its iconic sports cars, elegance, and cutting-edge engineering. Rooted in a distinguished motorsport history, Jaguar combines striking design with thrilling performance and advanced technological innovation.",
            url: "https://jaguar.com"
        },
        chrysler: {
            name: "Chrysler",
            logo: "images/logos/chrysler.svg",
            description: "Chrysler is an iconic automotive brand recognized for engineering dependable, comfortable, and feature-rich vehicles. With a long-standing history of American automotive innovation, Chrysler focuses on practical performance, passenger comfort, and progressive design solutions.",
            url: "https://chrysler.com.au"
        }
    };

    /* ---- Marquee: repeat each row's logos until it overflows the viewport ---- */

    const rows = [...marquee.querySelectorAll('.track')].map(track => ({
        track,
        originals: [...track.children]
    }));

    function fillMarquee() {
        for (const { track, originals } of rows) {
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            const cycleWidth = originals.reduce((width, card) => width + card.offsetWidth + gap, 0);
            if (!(cycleWidth > 0)) continue;

            // Leave one cycle beyond the viewport so no row runs out of logos.
            const totalCards = (1 + Math.ceil((marquee.clientWidth + gap) / cycleWidth)) * originals.length;
            track.style.setProperty('--marquee-cycle', `-${cycleWidth}px`);

            while (track.children.length < totalCards) {
                const copy = originals[track.children.length % originals.length].cloneNode(true);
                copy.removeAttribute('tabindex');
                copy.removeAttribute('role');
                copy.setAttribute('aria-hidden', 'true');
                track.append(copy);
            }
            while (track.children.length > totalCards) {
                track.lastElementChild.remove();
            }
        }
    }

    fillMarquee();
    new ResizeObserver(fillMarquee).observe(marquee);

    /* ---- Partner dialog ---- */

    const modalLogo = document.getElementById('partnerModalLogo');
    const modalName = document.getElementById('partnerModalName');
    const modalDescription = document.getElementById('partnerModalDescription');
    const modalLink = document.getElementById('partnerModalLink');
    const modalClose = document.getElementById('partnerModalClose');
    const modalBackdrop = modal.querySelector('.partner-modal-backdrop');

    let lastFocusedElement = null;

    function openPartner(card) {
        const partner = partners[card.dataset.partner];
        if (!partner) return;

        modalName.textContent = partner.name;
        modalLogo.src = partner.logo;
        modalLogo.alt = partner.name;

        // Partners without a description or website simply omit that part.
        modalDescription.textContent = partner.description;
        modalDescription.hidden = !partner.description;
        modalLink.hidden = !partner.url;
        if (partner.url) modalLink.href = partner.url;

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        lastFocusedElement = card;
        modalClose.focus();
    }

    function closePartner() {
        if (!modal.classList.contains('active')) return;

        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (lastFocusedElement) lastFocusedElement.focus({ preventScroll: true });
        lastFocusedElement = null;
    }

    marquee.addEventListener('click', event => {
        const card = event.target.closest('.logo-card');
        if (card) openPartner(card);
    });

    marquee.addEventListener('keydown', event => {
        const card = event.target.closest('.logo-card');
        if (card && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            openPartner(card);
        }
    });

    modalClose.addEventListener('click', closePartner);
    modalBackdrop.addEventListener('click', closePartner);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closePartner();
    });
})();
