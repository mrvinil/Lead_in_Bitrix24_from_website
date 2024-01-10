$(document).ready(() => {
    // Кэшируем элементы для повышения производительности
    const $productName = $(':hidden[name=productName]');
    const $productPrice = $(':hidden[name=productPrice]');
    const $productSize = $(':hidden[name=productSize]');
    const $popupCallback = $('.popup-callback');
    const $callbackFirstForm = $('#callbackFirstForm');
    const $message = $('#message');
    const $popupcallback = $('#popupcallback');

    // Открываем попап и записываем в скрытые инпуты параметры товара
    $('.btn[data-target=callback]').on('click', function (event) {
        event.preventDefault();
        const $cardDesc = $(this).siblings('.product-info');
        $productName.val($cardDesc.find('.product-info__title').text());
        $productPrice.val($cardDesc.find('.product-info__price').text());
        $productSize.val($cardDesc.find('.product-info__size').text());
        callbackOpen();
    });

    // Закрытие попапа при клике на кнопку закрытия
    $('.popup-callback__close').on('click', callbackClose);

    // Закрытие попапа при клике вне попапа
    $(document).on('mouseup', (e) => {
        if ($popupCallback.css('visibility') === 'visible') {
            const $callback = $(".popup__container");
            if (!$callback.is(e.target) && $callback.has(e.target).length === 0) {
                callbackClose();
            }
        }
    });

    // Закрытие попапа при нажатии на клавишу Escape
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            callbackClose();
        }
    });

    // Функция открытия попапа
    function callbackOpen() {
        $popupCallback.addClass('popup_opened');
        setTimeout(() => {
            $popupCallback.css('visibility', 'visible');
        }, 300);
    }

    // Функция закрытия попапа
    function callbackClose() {
        $popupCallback.removeClass('popup_opened');
        $productName.val('');
        $productPrice.val('');
        $productSize.val('');
        setTimeout(() => {
            $popupCallback.css('visibility', 'hidden');
        }, 300);
    }

    // Отправляем данные формы
    $popupcallback.on("submit", function () {
        $.ajax({
            type: 'POST',
            url: './webhook/product-arenda-webhook.php',
            data: $(this).serialize(),
            success: function (res) {
                $callbackFirstForm.hide();
                $message.show();
                setTimeout(() => {
                    $popupcallback[0].reset();
                    $popupCallback.css('visibility', 'hidden');
                    $message.hide();
                    $callbackFirstForm.show();
                    callbackClose();
                }, 3000);
            },
            error: function () {
                alert("Ошибка");
            }
        });
        return false;
    });
});
