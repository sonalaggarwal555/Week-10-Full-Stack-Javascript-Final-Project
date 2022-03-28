class BookService {
    constructor() {
        this.getBookList = (year, month, date) => {

            const BASE_URL = `https://api.nytimes.com/svc/books/v3/lists/${year}-${month}-${date}/hardcover-fiction.json`;
            const url = `${BASE_URL}?api-key=${API_KEY}`;
            return fetch(url)
                .then(function (data) {
                    return data.json();
                });
        };
    }
}

CartService = () => {
    let cartCount = 0;
    let addToCartInternal = () => {
        cartCount++;
    }
    let getCartCountInternal = () => cartCount;

    return {
        addToCart: addToCartInternal,
        getCartCount: getCartCountInternal
    };
}

$(document).ready(function () {

    let bookSvc = new BookService();

    let siteMaintenanceNotificationFn = () => {

        let currentTimerSecond = 10;
        let interval = setInterval(() => {
            if (currentTimerSecond > 0) {
                $('#maintenance-notice-timerinfo').text(`Closing in ${currentTimerSecond} seconds.`);
                currentTimerSecond--;
            }
            else {
                clearInterval(interval);
                $('#maintenance-notice').hide();
            }
        }, 1000);
    };

    let firstPageDisplayed = window.localStorage.getItem('first-page-displayed');
    if (firstPageDisplayed) {
        $('#welcomeeModal').hide();
        siteMaintenanceNotificationFn();
    }
    else {
        $('#welcomeModal').show();
        window.localStorage.setItem('first-page-displayed', 'true');
    }

    $('#closeWelcomeModal').click(function (e) {
        e.preventDefault();
        $('#welcomeModal').hide();
        siteMaintenanceNotificationFn();
    });

    const formEl = document.getElementById('best-books-form');

    if (formEl) {

        formEl.addEventListener('submit', function (e) {
            e.preventDefault();
            $('#loading-icon').show();
            const year = document.getElementById('year').value;
            const month = document.getElementById('month').value;
            const date = document.getElementById('date').value;

            $('.card').remove();

            bookSvc.getBookList(year, month, date).then(function (responseJson) {
                setTimeout(() => {
                    $('#loading-icon').hide();
                    console.log(responseJson);

                    var booksArray = responseJson.results.books;
                    booksArray.reverse().forEach((item) => {
                        $('#books-container').after(`<div class="card" style="display:grid;grid-template-columns: 15% 85%;padding:10px;margin:20px">` +
                            `<div><img src="${item.book_image}" alt="img-text" style="width:100px"></img></div>` +
                            `<div style="padding:15px 0px"><h5>Title: ${item.title}</h5>` +
                            `<span>Author: ${item.author}</span><br/>` +
                            `<span>Description: ${item.description}</span><br />` +
                            `<button style="padding: 5px;font-size: 10px;background-color: #ffc107;border: 1px solid #c69500;">Add To Cart</button><br/>` +
                            `<span><a href="${item.amazon_product_url}" target="_blank">Buy on Amazon</a></span>` +
                            `</div></div>`);
                    });
                }, 4000);
            });

        });
    }

    $('#close-login-btn').click(function () {
        $('#login-modal').hide();
    });

    $('#login-btn').click(function () {
        $('#login-modal').show();
    });

    $('#connect-form').submit(function (e) {
        e.preventDefault();
        var firstname = $('#first-name').val();
        var lastname = $('#last-name').val();
        var email = $('#email').val();

        $(".error").remove();
        let formValidated = true;

        if (firstname.length < 5) {
            $('#first-name').after('<span class="error">This field is required,Please Enter valid firstname</span>');
            formValidated = false;
        }

        if (lastname.length < 5) {
            $('#last-name').after('<span class="error">This field is required,Please Enter valid lastname</span>');
            formValidated = false;
        }
        if (email.length < 3) {
            $('#email').after('<span class="error">Email is required</span>');
            formValidated = false;
        }
        else {
            var regEx = /\w+@\w+\.\w+/;
            var validEmail = regEx.test(email);
            if (!validEmail) {
                $('#email').after('<span class="error">Please enter valid email</span>');
                formValidated = false;
            }
        }

        if (formValidated === true) {
            this.reset();
            $('.modal-content').after('<span class="success">Form completed successfully</span>');
            $('#login-modal').hide();
        }
    });
});