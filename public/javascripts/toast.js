function showToast(message, type) {
    iziToast[type]({
        message: message,
        position: 'topRight',
        timeout: 3000,
        progressBar: true,
    });
}