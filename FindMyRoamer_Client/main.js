const express = require('express');
const app = express();
const url = require('url');
// qr코드 생성을 위한 코드
var qr = require('qrcode');

// ejs 엔진을 실행하기 위한 코드
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) { //메인페이지
    res.render('main.ejs', { title: '우리 금쪽이를 찾아줭', message: '네트워크 최신기술 프로젝트' }, function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/register_page', function (req, res) { //금쪽이 등록페이지
    res.render('register_page.ejs', function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/browse', function (req, res) { //금쪽이 목록 페이지
    var context = [
        '이름:강석현 / 나이:26 / 종류:사람 / 특징:짜게먹음 / 분실위치:국민대 / 사례금:1 Ether\n',
        '이름:초코 / 나이:10살 / 종류:포메라니안 / 특징:털쪘음 / 분실위치:서강대 / 사례금:1 Ether\n'
    ]
    res.render('browse.ejs', { message: context }, function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/register', function (req, res) { //금쪽이 등록완료 페이지
    var context = [
        { 'a': '보호자 성명 : ', 'b': req.query.owner_name },
        { 'a': '보호자 위치 : ', 'b': req.query.owner_location },
        { 'a': '보호자 연락처 : ', 'b': req.query.owner_phone },
        { 'a': '보호자 비밀번호 : ', 'b': req.query.pw },
        { 'a': '금쪽이 이름 : ', 'b': req.query.pet_name },
        { 'a': '금쪽이 나이 : ', 'b': req.query.pet_age },
        { 'a': '금쪽이 종 : ', 'b': req.query.pet_breed },
        { 'a': '금쪽이 특징 : ', 'b': req.query.pet_feature },
    ]

    var moveto = "/?owner_name=" // genqr로 데이터를 파싱하기 위한 코드 (수정 ver1.1)
        + req.query.owner_name
        + '&owner_location='
        + req.query.owner_location
        + '&owner_phone='
        + req.query.owner_phone
        + '&pw='
        + req.query.pw
        + '&pet_name='
        + req.query.pet_name
        + '&pet_age='
        + req.query.pet_age
        + '&pet_breed='
        + req.query.pet_breed
        + '&pet_feature='
        + req.query.pet_feature;

    console.log(moveto);

    res.render('register.ejs', { 'data': context, 'message': moveto }, function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/register/genqr/', function (req, res) { //QR코드 생성 페이지 (수정 ver1.1)
    const input_query = url.parse(req.url, true).query; //debug qr코드 페이지로 제대로 url이 넘어오는지 확인하기 위한 코드
    console.log(input_query); //debug input_query에 제대로 데이터가 넘어오는지 확인
    // ca발급 및 qr코드 생성 코드 추가 예정
    qr.toDataURL("google.com", function (error, url) {
        var data = url.replace(/.*,/, '');
        img = new Buffer(data, 'base64');
        res.writeHead(200, { "Content-Type": "image/html" });
        res.end(img);
    });
})


app.get('/QRcode/', function (req, res) { //QR 메인페이지
    const input_query = url.parse(req.url, true).query;
    const ca = input_query['ca'];
    const moveto = "/?ca=" + ca;
    res.render('qr_main.ejs', { title: 'QR 메인페이지', message: moveto, }, function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/QRcode/report_page', function (req, res) { //분실신고페이지
    const input_query = url.parse(req.url, true).query;
    const ca = input_query['ca'];
    const moveto = ca;
    res.render('report_page.ejs', { title: '분실신고 페이지', message: moveto, }, function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/QRcode/report_page/report', function (req, res) { //분실신고 완료 페이지
    //ca, pw, lost_location이 들어온다.
    res.render('report.ejs', function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/QRcode/cancel_page', function (req, res) { //분실취소 페이지
    const input_query = url.parse(req.url, true).query;
    const ca = input_query['ca'];
    const moveto = ca;
    res.render('cancel_page.ejs', { title: '분실취소 페이지', message: moveto, }, function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/QRcode/cancel_page/cancel', function (req, res) { //분실취소 완료 페이지
    //ca와 pw가 들어온다.
    res.render('cancel.ejs', function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/QRcode/whospet', function (req, res) { //금쪽이 찾기 페이지
    const input_query = url.parse(req.url, true).query;
    const ca = input_query['ca'];
    const moveto = ca;
    var context = "강석현 서울 01012341234";
    res.render('whospet.ejs', { title: '금쪽이 찾기페이지', message: context, }, function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/QRcode/found_page', function (req, res) { //사례금 보내기 페이지
    const input_query = url.parse(req.url, true).query;
    const ca = input_query['ca'];
    const moveto = ca;
    //ca와 pw가 들어온다.
    res.render('found_page.ejs', { title: '금쪽이 찾기페이지', message: moveto, }, function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/QRcode/found_page/found', function (req, res) { //사례금 보내기 완료 페이지
    //ca와 pw가 들어온다.
    res.render('found.ejs', function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.get('/balance', function (req, res) { //잔액 확인 페이지 (수정 ver1.2)
    var balance = 10000;
    res.render('balance.ejs', { data: balance }, function (err, html) {
        if (err) {
            console.log(err)
        }
        res.end(html) // 응답 종료
    })
});

app.listen(9000, function () {
    console.log("Server Created...");
});
