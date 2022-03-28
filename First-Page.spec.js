describe("Book Svc Test Suite", function () {

    var bookSvc;
    beforeEach(function () {
        bookSvc = new BookService();

    });

    it("Test fetching list of books for a valid date", function () {

        return bookSvc.getBookList('2021', '01', '13').then((responseJson)=> {
            expect(responseJson).toBeDefined();
        });
    });
});

describe("Cart Svc Test Suite", function () {
    var cartSvc;
    beforeEach(function () {
        cartSvc = CartService();     
      });
    it("Test case initialize cart service", async function () {
        expect(cartSvc.getCartCount()).toEqual(0);    
    });

    it("Test case add to cart service", async function () {
        cartSvc.addToCart();
        expect(cartSvc.getCartCount()).toEqual(1);    
    });
});
