// This is a JavaScript file


/**
 * DBに接続
 */ 
function connect() {
    var name = 'localdb';
    var version = '1.0';
    var description = 'Web SQL Database';
    var size = 2 * 1024 * 1024;
    var db = openDatabase(name, version, description, size);
    return db;
}

/**
 * データベースの初期化
 * アプリインストール後の初回起動時に実行される想定
 */
function initial_db()
{
    try
    {
        var db = connect();
        
        db.transaction(function(tx)
        {
            create_table(tx);
            insert_datas(tx);
        }, 
        function(err)
        {
            // ERROR
            alert(sql + '：失敗：' + err.code);
        }, 
        function(tx, results)
        {
            
        });
        

        // データがちゃんと入ったかのテスト
        /*db.transaction(
            function(tx)
            {
                tx.executeSql('select id, name from test', [], 
                    function(tx, results)
                    {
                        // SUCCESS
                        for (i = 0; i < results.rows.length; i++)
                        {
                            alert(results.rows.item(i).id);
                            //alert(results.rows.item(i).name);
                        }
                    }, 
                    function(err)
                    {
                        // ERROR
                        alert('エラー:' + err.code);
                    });
            });*/

    }
    catch (e)
    {
        alert(e);
    }
}

/**
 * テーブル作成 
 */
function create_table(transaction)
{
    transaction.executeSql('drop table if exists test', []);
    transaction.executeSql('create table test (id, name)', []);
}
/**
 * データ登録
 */
function insert_datas(transaction)
{
    var insertSql = 'insert into test (id, name) values (?, ?)';
    var datas = [
        ['kino1', 'kinoshita'],
        ['kino2', 'takashi'],
    ];
    for (data of datas)
    {
        transaction.executeSql(insertSql, data);
    }
    
    testSelect(transaction);
}

/**
 * DBからコンビニ一覧を取得
 */
function selectShopList() {
    // TODO:暫定
    var shopList = [];
    shopList[0] = new Shop(1, "セブンイレブン", "img/cvs/seveneleven.png", "", "20171226");
    shopList[1] = new Shop(2, "ミニストップ", "img/cvs/ministop.png", "", "20171226");
    return shopList;
}


// お試し
function ShopController($scope){
    $scope.items = selectShopList();
 
    /*$scope.showDetail = function(index){
        var selectedItem = Data.items[index];
        Data.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('page2.html', selectedItem.title);
    }*/
}
