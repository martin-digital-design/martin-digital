export function initQuizForm() {
    const quizSteps = document.querySelectorAll('.quiz-form-step');
    const resultStep = document.querySelector('.quiz-form-result');
    const form = document.querySelector('.quiz-form');

    let currentQuizStepIndex = 0;
    const transitionDuration = 250;

    const categoryScores = {
        essentials: 0,
        standard: 0,
        bespoke: 0,
    };

    const formatResultTitle = key => {
        switch (key) {
            case 'essentials':
                return 'Business Essentials Website';
            case 'standard':
                return 'Business Standard Website';
            case 'bespoke':
                return 'Business Bespoke Website';
            default:
                return '';
        }
    };

    const planDescriptions = {
        essentials:
            'Ideal for businesses that need a professional website, fast with a basic page structure and online setup.',
        standard:
            'Ideal for businesses that want a conversion focused website that’s built to grow.',
        bespoke:
            'Ideal for businesses that need a bespoke, high performing site tailored to unique goals.',
    };

    const budgetNumericValue = {
        //maximum that the client will pay
        '<500': 400,
        '500-750': 750,
        '750-1200': 1200,
        '>1200': 1300,
        0: 0,
    };

    const planMinimums = {
        essentials: 501,
        standard: 751,
        bespoke: 1201,
    };

    const planMaximums = {
        essentials: 750,
        standard: 1200,
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

            categoryScores.essentials = 0;
            categoryScores.standard = 0;
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
                        categoryScores.essentials++;
                    } else if (value === '750-1200') {
                        categoryScores.standard++;
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

            console.log(highest);

            const heading = resultStep.querySelector('h3');
            if (heading) {
                heading.textContent = formatResultTitle(highest);
            }

            const websiteBtn = resultStep.querySelector('#website-button');

            if (websiteBtn) websiteBtn.style.display = 'inline-block';

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

        form.querySelectorAll('.quiz-form-step input[type="radio"]').forEach(
            input => {
                input.checked = false;
            }
        );

        form.querySelectorAll(
            '.w-form-formradioinput.w--redirected-checked'
        ).forEach(el => {
            el.classList.remove('w--redirected-checked');
        });

        form.querySelector('#templates-button')?.style.setProperty(
            'display',
            'none'
        );
        form.querySelector('#bespoke-button')?.style.setProperty(
            'display',
            'none'
        );

        const resultParagraph = resultStep.querySelector('p');
        if (resultParagraph) {
            resultParagraph.textContent = '';
        }

        categoryScores.essentials = 0;
        categoryScores.standard = 0;
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
