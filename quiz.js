export function initQuizForm() {
    const quizSteps = document.querySelectorAll('.quiz-form-step');
    const resultStep = document.querySelector('.quiz-form-result');
    let currentQuizStepIndex = 0;
    const transitionDuration = 250;

    const categoryScores = {
        starter: 0,
        growth: 0,
        bespoke: 0,
    };

    const formatResultTitle = key => {
        switch (key) {
            case 'starter':
                return 'Starter Template Website';
            case 'growth':
                return 'Growth Template Website';
            case 'bespoke':
                return 'Premium Bespoke Website';
            default:
                return '';
        }
    };

    const planDescriptions = {
        starter:
            "Our Starter Template Website is ideal for smaller businesses who want a clean, simple site quickly and affordably. It's flexible enough to grow with you later.",
        growth: 'The Growth Template Website is perfect for businesses that need more flexibility, SEO support, and room for ongoing expansion.',
        bespoke:
            'Our Bespoke Website option is tailored from the ground up – ideal for businesses that need a unique brand experience, complex features, or custom integrations.',
    };

    const budgetNumericValue = {
        '<500': 400,
        '500-750': 750,
        '750-1200': 1200,
        '>1200': 1300,
        0: 0,
    };

    const planMinimums = {
        starter: 1,
        growth: 751,
        bespoke: 1201,
    };

    const planMaximums = {
        starter: 750,
        growth: 1200,
        bespoke: Infinity,
    };

    let userBudget = '0';

    const showQuizStep = stepToShow => {
        const currentStep =
            quizSteps[currentQuizStepIndex] ||
            document.querySelector('.quiz-form-result.active');

        const nextStep =
            typeof stepToShow === 'number' ? quizSteps[stepToShow] : stepToShow;
        if (!nextStep) return;

        currentStep.style.transition = `opacity ${transitionDuration}ms ease`;
        currentStep.style.opacity = 0;

        setTimeout(() => {
            currentStep.classList.remove('active');
            currentStep.style.display = 'none';
            currentStep.style.opacity = '';
            currentStep.style.transition = '';

            nextStep.classList.add('active');
            nextStep.style.display = 'flex';
            nextStep.style.opacity = 0;
            nextStep.style.transition = `opacity ${transitionDuration}ms ease`;

            void nextStep.offsetWidth;
            nextStep.style.opacity = 1;

            currentQuizStepIndex = [...quizSteps].indexOf(nextStep);
        }, transitionDuration);
    };

    const validateQuizStep = step => {
        const requiredRadios = step.querySelectorAll(
            'input[type="radio"][required]'
        );
        for (const input of requiredRadios) {
            const groupName = input.name;
            const checked = step.querySelector(
                `input[name="${groupName}"]:checked`
            );
            if (!checked) {
                input.reportValidity();
                return false;
            }
        }
        return true;
    };

    document.querySelectorAll('[data-action="next"]').forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = quizSteps[currentQuizStepIndex];
            if (!validateQuizStep(currentStep)) return;

            const nextIndex = currentQuizStepIndex + 1;
            if (nextIndex < quizSteps.length) {
                showQuizStep(nextIndex);
            }
        });
    });

    document
        .querySelector('[data-action="finish"]')
        ?.addEventListener('click', () => {
            const currentStep = quizSteps[currentQuizStepIndex];
            if (!validateQuizStep(currentStep)) return;

            categoryScores.starter = 0;
            categoryScores.growth = 0;
            categoryScores.bespoke = 0;
            userBudget = '0';

            quizSteps.forEach(step => {
                const checkedInputs = step.querySelectorAll(
                    'input[type="radio"]:checked'
                );
                checkedInputs.forEach(input => {
                    const value = input.value;

                    if (input.name === 'question-4') {
                        userBudget = value;
                    }

                    if (['<500', '500-750'].includes(value)) {
                        categoryScores.starter++;
                    } else if (value === '750-1200') {
                        categoryScores.growth++;
                    } else if (value === '>1200') {
                        categoryScores.bespoke++;
                    } else {
                        const lowerVal = value.toLowerCase();
                        if (categoryScores.hasOwnProperty(lowerVal)) {
                            categoryScores[lowerVal]++;
                        }
                    }
                });
            });

            const highest = Object.entries(categoryScores).reduce((a, b) =>
                b[1] > a[1] ? b : a
            )[0];

            const heading = resultStep.querySelector('h3');
            if (heading) {
                heading.textContent = formatResultTitle(highest);
            }

            const templatesBtn = resultStep.querySelector('#templates-button');
            const bespokeBtn = resultStep.querySelector('#bespoke-button');
            if (templatesBtn)
                templatesBtn.style.display =
                    highest === 'starter' || highest === 'growth'
                        ? 'inline-block'
                        : 'none';
            if (bespokeBtn)
                bespokeBtn.style.display =
                    highest === 'bespoke' ? 'inline-block' : 'none';

            const resultParagraph = resultStep.querySelector('p');
            if (resultParagraph) {
                let message = planDescriptions[highest] || '';

                if (userBudget === '0') {
                    message +=
                        " You haven't specified a budget yet, so you may want to consider what you're comfortable investing when you're ready.";
                } else {
                    const userValue = budgetNumericValue[userBudget] || 0;
                    const min = planMinimums[highest];
                    const max = planMaximums[highest];

                    if (userValue < min) {
                        message +=
                            " However, based on your budget selection, this option may exceed what you're currently planning to invest.";
                    } else if (userValue > max) {
                        message +=
                            " Your current budget also gives you the flexibility to consider a more advanced website plan if you'd like to explore additional features or customisation.";
                    }
                }

                resultParagraph.textContent = message;
            }

            showQuizStep(resultStep);
        });

    document.querySelectorAll('[data-action="prev"]').forEach(button => {
        button.addEventListener('click', () => {
            const currentStep =
                quizSteps[currentQuizStepIndex] ||
                document.querySelector('.quiz-form-result.active');

            if (currentStep?.classList.contains('quiz-form-result')) {
                showQuizStep(0);
                return;
            }

            const prevIndex = currentQuizStepIndex - 1;
            if (prevIndex >= 0) {
                showQuizStep(prevIndex);
            }
        });
    });

    document.querySelectorAll('.quiz-button').forEach(button => {
        button.addEventListener('click', () => {
            document.body.style.overflow = 'hidden';
        });
    });

    document.getElementById('quiz-close')?.addEventListener('click', () => {
        document.body.style.overflow = 'auto';

        const allSteps = [...quizSteps, resultStep];
        allSteps.forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none';
            step.style.opacity = '';
            step.style.transition = '';
        });

        document
            .querySelectorAll('.quiz-form-step input[type="radio"]')
            .forEach(input => {
                input.checked = false;
            });

        document
            .querySelectorAll('.w-form-formradioinput.w--redirected-checked')
            .forEach(el => {
                el.classList.remove('w--redirected-checked');
            });

        document
            .querySelector('#templates-button')
            ?.style.setProperty('display', 'none');
        document
            .querySelector('#bespoke-button')
            ?.style.setProperty('display', 'none');

        const resultParagraph = resultStep.querySelector('p');
        if (resultParagraph) {
            resultParagraph.textContent = '';
        }

        categoryScores.starter = 0;
        categoryScores.growth = 0;
        categoryScores.bespoke = 0;
        userBudget = '0';

        const firstStep = quizSteps[0];
        if (firstStep) {
            firstStep.classList.add('active');
            firstStep.style.display = 'flex';
            firstStep.style.opacity = 1;
        }

        currentQuizStepIndex = 0;
    });
}
