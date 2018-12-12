var url = '../doc/test.pdf';
var currentNumber = document.getElementById('currentNumber');
var canvas = document.getElementById('the-canvas');
var context = canvas.getContext('2d');

var currentPage = document.getElementById('currentPage');
var obj = PDFJS.getDocument(url);
var maxPage;
obj.then(pdf => {
    maxPage = pdf.pdfInfo.numPages;
    document.getElementById('maxNumber').innerHTML = maxPage;
});
changePage(parseInt(currentNumber.value));
currentNumber.oninput = () => {
    var number = parseInt(currentNumber.value);
    if (number > 0 && number <= maxPage) {
        changePage(parseInt(currentNumber.value));
    }
};
function changePage(pageNumber) {
    obj.then(function (pdf) {
        return pdf.getPage(pageNumber);
    })
        .then(function (page) {
            var scale = 1;
            var viewport = page.getViewport(scale);
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);
        });
}

document.getElementById('btnNext').onclick = () => {
    var nextPage = parseInt(currentNumber.value) + 1;
    if (nextPage <= maxPage) {
        currentNumber.value = nextPage;
        changePage(nextPage);
    }
}

document.getElementById('btnPre').onclick = () => {
    var prePage = parseInt(currentNumber.value) - 1;
    if (prePage > 0) {
        currentNumber.value = prePage;
        changePage(prePage);
    }
}