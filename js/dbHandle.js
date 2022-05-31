var db = null;
var var_no = null;
var position = null;

// 데이터베이스 생성 및 오픈
function openDB(){
    // window.openDatabase('데이터베이스명', '데이터베이스 버전', '데이터베이스 설명', 용량(숫자자료형));
    // 5MB == 5*1024*1024
    // db변수 (객체)가 오라클, MariaDB의 connection객체라고 생각하면 됨.
    // 오라클, MariaDB와 다른 점은 데이터베이스의 생성 및 connection 객체 생성을 동시에 진행함.
    db = window.openDatabase('bookDB', '1.0', '북DB', 5*1024*1024);
    console.log('1_DB 생성...');
}
// 테이블 생성 트랜잭션 실행
function createTable() {
    // id integer primary key autoincrement 자동증가기능
    // db.transaction(fucntion(ps){...실행문...}); => 오라클, mariaDB의 jdbc에서 ps객체생성문과 유사한 기능
    db.transaction(function(ps) {
        var createSQL = 'create table if not exists book(bookid integer primary key autoincrement, type text, name text)';
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
function insertBook(){
    db.transaction(function(ps){
        var type=$('#bookType1').val();
        var name=$('#bookName1').val();
        var insertSQL = 'insert into book(type, name) values(?,?)';

        ps.executeSql(insertSQL, [type, name], function(ps, rs){
            console.log('3_책 등록...no: ' + rs.insertId);
            alert('도서명 ' + $('#bookName1').val() + ' 이 입력되었습니다');
            $('#bookName1').val('');
            $('#bookType1').val('미정').attr('selected', 'selected');
            $('#bookType1').selectmenu('refresh');
        });
    });
}
// 전체 데이터 검색 트랜잭션 실행

let index = 0;
function listBook(position){
    db.transaction(function(ps){
        var selectCntSQL = 'select count(*) as cnt from book';
        let cnt = 0;

        ps.executeSql(selectCntSQL, [], function(ps, rs){
            cnt = rs.rows.item(0).cnt;
            console.log("전체 목록 개수: "+cnt);
            if(cnt==0){
                alert("도서 목록이 없습니다. ");
            } else {
                console.log("도서 목록 검색");
                var selectSQL = 'select * from book';
                ps.executeSql(selectSQL, [], function(ps, rs){
                    var len = rs.rows.length;
                    // msg = "<p>총 행의 개수: " + cnt + "줄</p>";
                    // $('#listTB').append(msg);

                    for(i=0; i<len; i++){
                        $('#listTB').append("<tr><td>"+rs.rows.item(i).type + "</td></tr><tr><td>" + rs.rows.item(i).name+"</td></tr>");
                    }

                    console.log(' 책 조회... ' + rs.rows.length + '건.');
                    if (position == 'first') {
                        console.log("first 검색");
                        if(index==0) alert('처음 목록입니다');
                        else index=0;
                    } else if (position == 'prev') {
                        console.log("prev 검색");
                        if(index == 0)
                        alert('처음 목록입니다.');
                        else
                        index = --index;
                    } else if (position == 'next') {
                        console.log("next 검색");
                        if (index == rs.rows.length-1)
                        alert('마지막 목록입니다.');
                        else
                        index = ++index;
                    } else {
                        console.log("last 검색");
                        if(index == rs.rows.length-1) alert('마지막 목록입니다');
                        else index = rs.rows.length-1;
                    }
                    $('#bookType4').val(rs.rows.item(index).type);
                    $('#bookName4').val(rs.rows.item(index).name);
                });
            }
        });
    });
}
// 데이터 수정 트랜잭션 실행
function updateBook(){
    db.transaction(function(ps){
        var type= $('#bookType2').val();
        var new_name = $('#bookName2').val();
        var old_name = $('#sBookName2').val();
        var updateSQL = 'update book set type=?, name=? where name=?';
        ps.executeSql(updateSQL, [type, new_name, old_name], function(ps, rs){
            console.log('5_책 수정...');
            alert('도서명 ' + $('#sBookName2').val() + ' 이 수정되었습니다');
            $('#bookName2').val('');
            $('#sBookName2').val('');
            $('#bookType').val('미정').attr('selected', 'selected');
            $('#bookType2').selectmenu('refresh');
        },
        function(ps, err){
            alert('DB오류 ' + err.message + err.code);
        });
    });
}
// 데이터 삭제 트랜지션 실행
function deleteBook(){
    db.transaction(function(ps){
        var bookid=$('#bookid').val();
        var deleteSQL = 'delete from book where bookid=?';
        ps.executeSql(deleteSQL, [bookid], function(ps, rs){
            console.log('6_책 삭제...');
            alert('도서명 ' + $('#bookid').val() + ' 이 삭제되었습니다');
            $('#bookType3').val('');
            $('#bookName3').val('');
            $('#sBookName3').val('');
        },
        function(ps, err){
            alert('DB오류 ' + err.message + err.code);
        });
    });
}
// 데이터 수정 위한 데이터 검색 트랜잭션 실행
function selectBook2(name){
    db.transaction(function(ps){
        // var selectSQL = 'select type name from book where name=?';
        var selectSQL = "select bookid, type, name from book where name like '%'||?||'%'";
        ps.executeSql(selectSQL, [name], function(ps, rs){
            $('#bookType2').val(rs.rows.item(0).type).attr('selected', 'selected');
            $('#bookType2').selectmenu('refresh');
            $('#bookName2').val(rs.rows.item(0).name);
        });
    });
}
// 데이터 삭제를 위한 데이터 검색 트랜잭션 실행
function selectBook3(name){
    db.transaction(function(ps){
        // var selectSQL = 'select type, name from book where name=?';
        var selectSQL = "select rowid, type, name from book where name like '%'||?||'%'";
        ps.executeSql(selectSQL, [name], function(ps, rs){
            $('#bookType3').val(rs.rows.item(0).type);
            $('#bookName3').val(rs.rows.item(0).name);
            $('#bookid').val(rs.rows.item(0).bookid);
        },
        function(ps, err){
            alert('DB오류 ' + err.message + err.code);
        });
    });
}
// 데이터 조건 검색 트랜잭션 실행
function selectBook4(name){
    db.transaction(function(ps){
        // var selectSQL = 'select type, name from book where name=?';
        var selectSQL = "select type, name from book where name like '%'||?||'%'";
        ps.executeSql(selectSQL, [name], function(ps, rs){
            $('#bookType4').val(rs.rows.item(0).type);
            $('#bookName4').val(rs.rows.item(0).name);
        },
        function(ps, err){
            alert('DB오류 ' + err.message + err.code);
        });
    });
}