export function initProjectForm() {
    const steps = document.querySelectorAll(
        '.project-form-step, .project-form-template'
    );
    const form = document.querySelector('.project-form');
    let currentStepIndex = 0;
    const transitionDuration = 250; // ms

    const validateStep = step => {
        const inputs = step.querySelectorAll('input, select, textarea');
        for (const input of inputs) {
            if (!input.checkValidity()) {
                input.reportValidity();
                return false;
            }
        }
        return true;
    };

    const showStep = stepToShow => {
        const currentStep = steps[currentStepIndex];
        const nextStep =
            typeof stepToShow === 'number' ? steps[stepToShow] : stepToShow;

        // Fade out current step
        currentStep.style.transition = `opacity ${transitionDuration}ms ease`;
        currentStep.style.opacity = 0;

        setTimeout(() => {
            // Hide current
            currentStep.classList.remove('active');
            currentStep.style.display = 'none';
            currentStep.style.opacity = '';
            currentStep.style.transition = '';

            // Show new step
            nextStep.classList.add('active');
            nextStep.style.display = 'flex';
            nextStep.style.opacity = 0;
            nextStep.style.transition = `opacity ${transitionDuration}ms ease`;

            void nextStep.offsetWidth; // Force reflow
            nextStep.style.opacity = 1;

            currentStepIndex = [...steps].indexOf(nextStep);
        }, transitionDuration);
    };

    // Handle Next buttons
    form?.querySelectorAll('[data-action="next"]').forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = steps[currentStepIndex];

            if (!validateStep(currentStep)) return;

            // Step 0 logic: check for template selection
            if (currentStepIndex === 0) {
                const selected = currentStep
                    .querySelector('input[name="websiteType"]:checked')
                    ?.value.toLowerCase();
                if (selected.includes('template')) {
                    const templateStep = document.querySelector(
                        '.project-form-template'
                    );
                    showStep(templateStep);
                    return;
                }
            }

            const nextIndex = currentStepIndex + 1;
            if (nextIndex < steps.length) {
                showStep(nextIndex);
            }
        });
    });

    // Handle Previous buttons
    form?.querySelectorAll('[data-action="prev"]').forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = steps[currentStepIndex];

            // Special case: template step always goes back to Step 0
            if (currentStep.classList.contains('project-form-template')) {
                showStep(0);
                return;
            }

            const prevIndex = currentStepIndex - 1;
            if (prevIndex >= 0) {
                showStep(prevIndex);
            }
        });
    });

    // Optional: Final form validation
    form?.addEventListener('submit', e => {
        const currentStep = steps[currentStepIndex];
        if (!validateStep(currentStep)) {
            e.preventDefault();
        }
    });
}
