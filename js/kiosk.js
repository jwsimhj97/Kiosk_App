let db = null;
let var_no = null;
let position = null;

// 데이터베이스 생성 및 오픈
function openDB(){
    db = window.openDatabase('kioskDB', '1.0', '키오스크DB', 5*1024*1024);
    console.log('1_DB 생성...');
}
// 테이블 생성 트랜잭션 실행
function createTable() {
    db.transaction(function(ps) {
        let createSQL = 'create table if not exists kiosk(kioskid integer primary key autoincrement, orderList text, orderSum text)';
        ps.executeSql(createSQL, [], function(){
            console.log('2_1_테이블생성_sql 실행 성공...');
        }, function(){
            console.log('2_1_테이블생성_sql 실행 실패...');
        });
    },function() {
        console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
    },function(){
        console.log('2_2_테이블 생성 트랜잭션 성공...');
    });
}
// 데이터 입력 트랜잭션 실행
let orderCompleted = "";
function insertKiosk(){
    db.transaction(function(ps){
        // let orderSum=$('#sumPrice').text();
        let orderList=$('#kioskOrderList').text();
        let orderSum=$('#sumPrice').text();
        let insertSQL = 'insert into kiosk(orderList, orderSum) values(?,?)';

        ps.executeSql(insertSQL, [orderList, orderSum], function(ps, rs){
            console.log('3_주문 등록...no: ' + rs.insertId);
            // alert('주문이 완료되었습니다. ' + $('#kioskOrderList').text() + '금액' + $('#sumPrice').text());
            orderCompleted ='주문이 완료되었습니다. ' + $('#kioskOrderList').text() + '금액' + $('#sumPrice').text();
            alert(orderCompleted);
            // document.getElementById("orderListCheck").innerHTML = orderCompleted;
            // orderListCheck
            $('#sumPrice').text('');
            $('#kioskOrderList').text('');
            // $('#kioskOrderList').val('미정').attr('selected', 'selected');
            // $('#kioskOrderList').selectmenu('refresh');
        });
    });
}
let takeCK = "";
function orderView(orderBtnId, spanText){
    // alert(spanText);
    if(orderBtnId == "takeOut"){
        document.getElementById("orderTake").innerHTML = spanText;
    }else if(orderBtnId == "takeIn"){
        document.getElementById("orderTake").innerHTML = spanText;
    }
    
    
    

    orderCompleted = "<p>" + $('#kioskOrderList').text() + "</p><p>금액" + $('#sumPrice').text() + "</p>";
    // alert(orderCompleted);
    document.getElementById("orderListCheck").innerHTML = orderCompleted;
}

// 홈화면 이동시 주문내역 삭제
function homeDeleteData(){
    console.log("홈으로 이동");
    $("#orderListBox").text("");
    $("#orderSumBox").text("");
    $(".popup").removeClass("open");
    orderMenuListBasket = {};
    orderSum = 0;
}









// 주문 장바구니
let basket = {};
let tab = "#tab1";

function tabId(id){
    tab = id;
    console.log(id);
}

function add(id){
    if(basket[id] == undefined){
        basket[id] = 0;
    }
    basket[id] = basket[id]+1;
    
    console.log(id);
};



// 팝업창에 주문내역 추가
let orderSum = 0;
let orderMenuListBasket = {};
let orderList = "";
const popupOrderListBox = document.getElementById("orderListBox");
let orderListBasket = {};
let menuSumPrice = 0;
let orderName, orderPrice;

function TestList(menuName_check, menuPrice_check){
    orderName = menuName_check;
    orderPrice = parseInt(menuPrice_check);
    // let orderText = orderName + " " + orderPrice;
    let orderSumText = "";
    
    if($(".pop_orderList > ul > li").click){
        $(".pop_orderList > ul > li.no-order").remove();
    }

    // 주문내역 추가
    if(orderMenuListBasket[orderName] == undefined){
        orderMenuListBasket[orderName] = 0;
    }
    orderMenuListBasket[orderName] = orderMenuListBasket[orderName]+1;
        
    orderSum = orderSum + orderPrice;
    
    for(key in orderMenuListBasket) {
        console.log(
            ' ' + key  + ' ' +
            orderMenuListBasket[key] + 'x ' + orderMenuListBasket[key] * orderPrice
        );
    }
    
    // 팝업창에 주문내역 넣기
    document.getElementById("orderListBox").innerHTML = "";
    for(key in orderMenuListBasket) {
        document.getElementById("orderListBox").innerHTML += 
            "<li class='menu-order'><span id='kioskOrderList'>" +
            key + " " + orderPrice + "원 " +
            orderMenuListBasket[key] + "X</span> <span id='sumPrice'>"+(orderMenuListBasket[key] * orderPrice) + "원</span><a href='#' id='delBtn' class='order-deleteBtn'>삭제</a></span></li>"
        ;
    }


    const delBtnClick = document.getElementById('delBtn');
    let sumPriceBox =  parseInt($('#sumPrice').text());
    $('.order-deleteBtn').click(function(){
        $(this).parent().remove();  
    });
    delBtnClick.addEventListener("click", () => {
        // console.log(sumPriceBox);
        orderSum = orderSum - sumPriceBox;
        console.log(orderSum);
    });

    
    // 주문내역 총합
    orderSumText = orderSumText +"<p class='order_sum'>총합 : "+ orderSum + " 원" +"</p>";
    $(".orderSum").html(orderSumText);      
    
			

}



function popupControlOpen(){
    $(".popup").addClass("open");
    // console.log("popup");
}
function popupControlClose(){
    $(".popup").removeClass("open");
    // console.log("popup");

    
}

// .order_content height값
let contHeight_size = (window.innerHeight)-50;
function setDivHeight(){
    $(".order_content").height(contHeight_size);
}


// 스크롤 맨밑감지
function srcollBottomCheck(){
    $(".order_content").scroll(function(){
        var scrollTop = $(this).scrollTop();
        var innerHeight = $(this).innerHeight();
        var scrollHeight = $(this).prop('scrollHeight');
    if (scrollTop + innerHeight >= scrollHeight) {
        
        if($(".pop-close").click){
            // $(".popup").addClass("dfdfdf");
        }
        console.log("맨밑");
        } else {
        // $(".popup").addClass("ㄴㄴㄴㄴ");
        console.log("맨밑아님");
        }
    });
}