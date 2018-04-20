const http = require('http');
const url = require('url');
const qs = require('querystring');

const records = [
    {
        title: 'record 1',
        amount: 10.10,
        category: 'gasoline',
        date: '2018-04-18',
        comment: 'Comment 1'
    },
    {
        title: 'something else',
        amount: 20.20,
        category: 'food',
        date: '2018-05-19',
        comment: 'Comment 2'
    },
    {
        title: 'this is new record',
        amount: 15.50,
        category: 'food',
        date: '2018-10-21',
        comment: 'Comment 4'
    },
    {
        title: 'invoice 123',
        amount: 33.30,
        category: 'charity',
        date: '2018-11-21',
        comment: 'Comment 3'
    }
];

http.createServer(function(req, res) {
	const u = url.parse(req.url, true);
	const pathName = u.pathname;
    let result = records;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (pathName === '/get_records') {
        const params = JSON.parse(u.query.params);

        if (params.title !== '') {
            result = result.filter(record => record.title.toLowerCase().includes(params.title.toLowerCase()));
        }
        if (params.category !== '') {
            result = result.filter(record => record.category === params.category);
        }
        if (params.date.from !== '') {
            result = result.filter(record => new Date(record.date) >= new Date(params.date.from));
        }
        if (params.date.to !== '') {
            result = result.filter(record => new Date(record.date) <= new Date(params.date.to));
        }
        if (params.amount.from !== '') {
            result = result.filter(record => record.amount >= parseFloat(params.amount.from));
        }
        if (params.amount.to !== '') {
            result = result.filter(record => record.amount <= parseFloat(params.amount.to));
        }

        res.writeHead(200, {'content-type': 'application/json'});
		res.write(JSON.stringify(result));
		res.end();
	} else if (pathName === '/add_record') {
        let body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            let postData = qs.parse(body);
            let obj = {};

            obj.title = postData.title;
            obj.amount = parseFloat(postData.amount);
            obj.category = postData.category;
            obj.date = postData.date;
            obj.comment = postData.comment;
            records.push(obj);

            res.writeHead(200, {'content-type': 'application/json'});
            res.write(JSON.stringify(obj));
            res.end();
        });
    } else if (pathName == '/get_chart_data') {
        let m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (item of records) {
            let [, month, ] = item.date.split('-');
            switch (month) {
                case '01':
                    m[0] += item.amount;
                    break;
                case '02':
                    m[1] += item.amount;
                    break;
                case '03':
                    m[2] += item.amount;
                    break;
                case '04':
                    m[3] += item.amount;
                    break;
                case '05':
                    m[4] += item.amount;
                    break;
                case '06':
                    m[5] += item.amount;
                    break;
                case '07':
                    m[6] += item.amount;
                    break;
                case '08':
                    m[7] += item.amount;
                    break;
                case '09':
                    m[8] += item.amount;
                    break;
                case '10':
                    m[9] += item.amount;
                    break;
                case '11':
                    m[10] += item.amount;
                    break;
                case '12':
                    m[11] += item.amount;
                    break;
            }
        }

        res.writeHead(200, {'content-type': 'application/json'});
        res.write(JSON.stringify([['Month', 'Amount'], ['Jan', m[0]], ['Feb', m[1]], ['Mar', m[2]], ['Apr', m[3]], ['May', m[4]], ['Jun', m[5]], ['Jul', m[6]], ['Aut', m[7]], ['Sep', m[8]], ['Oct', m[9]], ['Nov', m[10]], ['Dec', m[11]]]));
        res.end();
	} else if (pathName == '/get_chart_data_category') {
        let m = [0, 0, 0, 0];
        for (item of records) {
            switch (item.category) {
                case 'mobile services':
                    m[0] += item.amount;
                    break;
                case 'gasoline':
                    m[1] += item.amount;
                    break;
                case 'food':
                    m[2] += item.amount;
                    break;
                case 'charity':
                    m[3] += item.amount;
                    break;
                case 'transport':
                    m[4] += item.amount;
                    break;
            }
        }

        res.writeHead(200, {'content-type': 'application/json'});
        res.write(JSON.stringify([['Categories', 'Amount'], ['mobile services', m[0]], ['gasoline', m[1]], ['food', m[2]], ['charity', m[3]], ['transport', m[4]]]));
        res.end();
    }
}).listen(4444);