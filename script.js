let categories = ['mobile services', 'gasoline', 'food', 'charity', 'transport'];
let filter = document.getElementsByClassName('filter');
let categoryFilter = document.getElementById('categoryFilter');
let modal = document.getElementById('modal');
let category = document.getElementById('category');
let searchObj = {
    title: '',
    category: '',
    date: {from: '', to: ''},
    amount: {from: '', to: ''}
};

document.getElementsByClassName('modal__close')[0].addEventListener('click', function() {
    modal.active = false;
});

document.getElementById('form').addEventListener('iron-form-response', function() {
    this.reset();
    modal.active = false;
    getRecords(searchObj);
});

document.getElementById('filterTitle').addEventListener('keyup', (e) =>  {
    searchObj.title = e.target.value;
    getRecords(searchObj);
});

for (let item of filter) {
    let event = (item.id === 'dateFrom' || item.id === 'dateTo') ? 'change' : 'keyup';

    item.addEventListener(event, function()  {
        let value = this.value;

        switch (this.id) {
            case 'dateFrom':
                searchObj.date.from = value;
                break;
            case 'dateTo':
                searchObj.date.to = value;
                break;

            case 'amountFrom':
                searchObj.amount.from = value;
                break;
            case 'amountTo':
                searchObj.amount.to = value;
                break;
        }

        getRecords(searchObj);
    });
}

function getRecords(params) {
    fetch('http://localhost:4444/get_records?params=' + JSON.stringify(params))
        .then(result => {
            return result.json();
        })
        .then(records => {
            let html = '';
            let total = 0;

            for (let [index, item] of records.entries()) {
                html += `<div class="record" id="commentBlock${index}">
                            <div>
                                <div>
                                    <a href="javascript:void(0)" onclick="showComment(${index})">${item.title}</a>
                                    <p><span class="category" style="cursor: default;">${item.category}</span></p>
                                </div>
                                <div style="text-align: right; color: #f85776;">
                                    <div style="font-size: 12px; color: #aaa; margin-bottom: 5px;">${formatDate(new Date(item.date))}</div>
                                    <div>${item.amount}<br /> <span style="font-size: 12px;">GEL</span></div>
                                </div>
                            </div>
                            <div class="comment" id="comment${index}" style="display: none; padding-top: 0;">
                                <div style="margin-bottom: 5px;">comment:</div>
                                ${item.comment}
                            </div>
                         </div>`;
                total += item.amount;
            }

            document.getElementById('recordCount').innerHTML = records.length;
            document.getElementById('records').innerHTML = html;
            document.getElementById('totalAmount').innerHTML = total.toFixed(2);
            document.getElementById('recordFooter').style.display = (records.length > 0) ? 'block' : 'none';
            //document.getElementById('chartMonth').redraw();
        })
        .catch(error => console.log(error));
}

function showForm() {
    modal.active = true;
}

function showFilters() {
    let element = document.getElementById('filterBlock');
    element.style.display = (element.style.display === 'none') ? 'block' : 'none';
}

function showComment(index) {
    let element = document.getElementById('comment' + index);
    let block = document.getElementById('commentBlock' + index);
    element.style.display = (element.style.display === 'none') ? 'block' : 'none';
    block.style.backgroundColor = (element.style.display === 'none') ? '#f9fafb' : '#f3f4f8';
}

function formatDate(date) {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return `on ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

(() => {
    for (let item of categories) {
        let span = document.createElement('span');
        span.className = 'category-filter';
        span.innerHTML = item;
        span.addEventListener('click', function() {
            for (let item of document.getElementsByClassName('category-filter')) {
                if (item === this) {
                    continue;
                }
                item.classList.remove('category-filter-active');
            }
            this.classList.toggle('category-filter-active');
            searchObj.category = this.classList.contains('category-filter-active') ? this.innerHTML : '';
            getRecords(searchObj);
        });
        categoryFilter.appendChild(span);

        let option = document.createElement('option');
        option.innerHTML = item;
        option.value = item;
        category.add(option);
    }
})();

getRecords(searchObj);