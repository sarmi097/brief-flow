const cursorDot = document.getElementById('cursorDot');
        const cursorTrail = document.getElementById('cursorTrail');
        let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;
        gsap.to({}, 0.016, {
            repeat: -1,
            onRepeat: function() {
                gsap.set(cursorDot, { x: mouseX, y: mouseY });
                trailX += (mouseX - trailX) * 0.15;
                trailY += (mouseY - trailY) * 0.15;
                gsap.set(cursorTrail, { x: trailX - 15, y: trailY - 15 });
            }
        });
        document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

        gsap.to('.orb-1', { x: 150, y: 100, duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.orb-2', { x: -120, y: -80, duration: 25, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.orb-3', { x: 80, y: -60, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });

        let currentStep = 1, totalSteps = 3;
        const steps = document.querySelectorAll('.step');
        const stepIndicator = document.getElementById('stepIndicator');
        const progressBar = document.getElementById('progressBar');
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const btnSubmit = document.getElementById('btnSubmit');
        const briefForm = document.getElementById('briefForm');
        const successScreen = document.getElementById('successScreen');

        const selectionCards = document.querySelectorAll('.selection-card');
        let selectedNecesidades = [];

        selectionCards.forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('checkbox-card')) {
                    card.classList.toggle('selected');
                    const value = card.dataset.value;
                    if (card.classList.contains('selected')) {
                        if (!selectedNecesidades.includes(value)) {
                            selectedNecesidades.push(value);
                        }
                    } else {
                        selectedNecesidades = selectedNecesidades.filter(v => v !== value);
                    }
                } else {
                    selectionCards.forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    selectedNecesidades = [card.dataset.value];
                }
                document.querySelector('input[name="necesidad_redisenio"]').value = selectedNecesidades.includes('Rediseño página web') ? 'Sí' : 'No';
                document.querySelector('input[name="necesidad_seo"]').value = selectedNecesidades.includes('SEO/Optimización de imágenes') ? 'Sí' : 'No';
                document.querySelector('input[name="necesidad_funcionalidad"]').value = selectedNecesidades.includes('Funcionalidad personalizada') ? 'Sí' : 'No';
            });
        });

        const plazoSelect = document.getElementById('plazo');
        const fechaEstimadaGroup = document.getElementById('fechaEstimadaGroup');
        plazoSelect.addEventListener('change', () => {
            if (plazoSelect.value === 'Fecha estimada') {
                fechaEstimadaGroup.style.display = 'block';
            } else {
                fechaEstimadaGroup.style.display = 'none';
                document.getElementById('fechaEstimada').value = '';
                document.getElementById('error-fechaEstimada').textContent = '';
            }
        });

        function updateStep() {
            steps.forEach((step, index) => {
                if (index + 1 === currentStep) {
                    step.style.display = 'block';
                    gsap.to(step, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
                    step.classList.add('active');
                } else {
                    gsap.to(step, {
                        opacity: 0,
                        x: index + 1 > currentStep ? 30 : -30,
                        duration: 0.4,
                        ease: 'power2.in',
                        onComplete: () => {
                            step.style.display = 'none';
                            step.classList.remove('active');
                        }
                    });
                }
            });
            stepIndicator.textContent = `Paso ${currentStep} de ${totalSteps}`;
            progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
            btnPrev.style.display = currentStep === 1 ? 'none' : 'inline-block';
            btnNext.style.display = currentStep === totalSteps ? 'none' : 'inline-block';
            btnSubmit.style.display = currentStep === totalSteps ? 'inline-block' : 'none';
        }

            function validateStep1() {
            let isValid = true;
            document.getElementById('error-nombre').textContent = '';
            document.getElementById('error-correo').textContent = '';
            document.getElementById('error-robot').textContent = '';
            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const noSoyRobot = document.getElementById('noSoyRobot').checked;
            if (nombre === '') { document.getElementById('error-nombre').textContent = 'El nombre o empresa es obligatorio.'; isValid = false; }
            if (correo === '') { document.getElementById('error-correo').textContent = 'El correo electrónico es obligatorio.'; isValid = false; }
            else if (!emailRegex.test(correo)) { document.getElementById('error-correo').textContent = 'Ingresa un correo electrónico válido.'; isValid = false; }
            if (!noSoyRobot) { document.getElementById('error-robot').textContent = 'Debes marcar "No soy un robot" para continuar.'; isValid = false; }
            return isValid;
        }

        function validateStep2() {
            let isValid = true;
            document.getElementById('error-resumenNegocio').textContent = '';
            document.getElementById('error-referencias').textContent = '';
            document.getElementById('error-tipoProyecto').textContent = '';
            if (selectedNecesidades.length === 0) {
                document.getElementById('error-tipoProyecto').textContent = 'Selecciona al menos una opción (puedes elegir hasta 2 opciones al mismo tiempo).';
                isValid = false;
            } else if (selectedNecesidades.length > 2) {
                document.getElementById('error-tipoProyecto').textContent = 'Solo puedes seleccionar un máximo de 2 opciones al mismo tiempo.';
                isValid = false;
            }
            const resumen = document.getElementById('resumenNegocio').value.trim();
            if (resumen === '') { document.getElementById('error-resumenNegocio').textContent = 'El resumen o idea del negocio es obligatorio.'; isValid = false; }
            const referencias = document.getElementById('referencias').value.trim();
            if (referencias === '') { document.getElementById('error-referencias').textContent = 'Los sitios web de referencia o estilos son obligatorios.'; isValid = false; }
            return isValid;
        }

        function validateStep3() {
            let isValid = true;
            document.getElementById('error-plazo').textContent = '';
            document.getElementById('error-fechaEstimada').textContent = '';
            const plazo = document.getElementById('plazo').value;
            if (plazo === '') { document.getElementById('error-plazo').textContent = 'Selecciona el plazo estimado de entrega.'; isValid = false; }
            if (plazo === 'Fecha estimada') {
                const fecha = document.getElementById('fechaEstimada').value.trim();
                if (fecha === '') { document.getElementById('error-fechaEstimada').textContent = 'Indica la fecha estimada.'; isValid = false; }
            }
            return isValid;
        }

        btnNext.addEventListener('click', () => {
            let isValid = false;
            if (currentStep === 1) isValid = validateStep1();
            else if (currentStep === 2) isValid = validateStep2();
            if (isValid && currentStep < totalSteps) { currentStep++; updateStep(); }
        });
        btnPrev.addEventListener('click', () => { if (currentStep > 1) { currentStep--; updateStep(); } });

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        briefForm.addEventListener('submit', e => {
            e.preventDefault();
            if (!validateStep3()) return;
            const formData = new FormData(briefForm);
            const correoCliente = document.getElementById('correo').value.trim();
            document.getElementById('replyTo').value = correoCliente;
            document.getElementById('ccTo').value = correoCliente;
            ['nombre', 'resumenNegocio', 'referencias', 'atascos', 'fechaEstimada', 'comentarios'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    formData.set(el.name, escapeHtml(el.value.trim()));
                }
            });
            const btn = document.getElementById('btnSubmit');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
            btn.disabled = true;
            fetch('https://formspree.io/f/xrblavjk', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    gsap.to('.form-header,.form-body,.form-footer', {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.in',
                        onComplete: () => {
                            document.querySelector('.form-header').style.display = 'none';
                            document.querySelector('.form-body').style.display = 'none';
                            document.querySelector('.form-footer').style.display = 'none';
                            successScreen.style.display = 'block';
                            gsap.to(successScreen, { opacity: 1, duration: 0.8, ease: 'power2.out' });
                            gsap.from('.success-circle', { scale: 0, duration: 0.6, ease: 'back.out(1.7)' });
                            gsap.from('.success-check', { scale: 0, rotation: 180, duration: 0.5, delay: 0.3, ease: 'back.out(2)' });
                        }
                    });
                } else { throw new Error('Error'); }
            })
            .catch(() => {
                alert('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.');
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
        });

        // Splash Screen
        document.addEventListener('DOMContentLoaded', function() {
            const splashScreen = document.getElementById('splashScreen');
            const progressFill = document.getElementById('progressFill');
            const progressPercent = document.getElementById('progressPercent');
            const mainWrapper = document.querySelector('.main-wrapper');
            if (!splashScreen) return;
            gsap.set(mainWrapper, { autoAlpha: 0, y: 30, scale: 0.95 });
            const tl = gsap.timeline({
                onComplete: function() {
                    gsap.to(splashScreen, {
                        opacity: 0,
                        scale: 1.05,
                        duration: 0.8,
                        ease: 'power2.inOut',
                        onComplete: function() {
                            splashScreen.style.display = 'none';
                            gsap.to(mainWrapper, {
                                autoAlpha: 1,
                                y: 0,
                                scale: 1,
                                duration: 0.8,
                                ease: 'power2.out'
                            });
                        }
                    });
                }
            });
            tl.to(progressFill, { width: '100%', duration: 1.8, ease: 'power2.out' });
            tl.to(progressPercent, { innerText: 100, duration: 1.8, ease: 'power2.out', roundProps: 'innerText' }, 0);
        });

        updateStep();