export function modals() {

    const overlay = document.querySelectorAll('.modal'),
        modalBody = document.querySelectorAll('.modal__body'),
        body = document.querySelector('body'),
        close = document.querySelector('.modal-close');


    let modalToggle = false;

    function bindModal(triggerSelector, modalSelector) {

        const trigger = document.querySelectorAll(triggerSelector),
            modal = document.querySelector(modalSelector),
            modalForm = document.querySelector('.modal__body');

        // Открытие модального окна
        trigger.forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target) {
                    e.preventDefault();
                }
                modal.classList.add('active');
                modalForm.classList.add('active');
                body.classList.add('fix');
                modalToggle = true;
            });
        });

        // Закрытие модального окна по клику на подложку
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    modalForm.classList.remove('active');
                    body.classList.remove('fix');
                    modalToggle = false;
                }
            });
        }
    }

    // Функция закрытие модального окна
    function closeModal() {
        overlay.forEach(item => {
            item.classList.remove('active');
        });
        modalBody.forEach(item => {
            item.classList.remove('active');
        });
        document.body.classList.remove('fix');
    }

    bindModal('.open-video-modal', '.modal--video');
    bindModal('.portfolio-popup__open', '.modal--portfolio');

    // Закрытие модального окна по клику на кнопку
    document.onkeydown = function (e) {
        if (e.keyCode == 27) {
            closeModal();
        }
    };

    // Закрытие модального окна по клику Esc
    if (close) {
        close.addEventListener('click', () => {
            closeModal();
        });
    }

}

