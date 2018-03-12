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
    ons.notification.toast('DB初期化開始', { timeout: 500, animation: 'fall' });
    try
    {
        var db = connect();
        
        db.transaction(function(tx)
        {
            create_table(tx);
            insert_shop(tx);
            insert_class(tx);
            insert_item(tx);
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
                tx.executeSql('select id, name from item', [], 
                    function(tx, results)
                    {
                        // SUCCESS
                        for (i = 0; i < results.rows.length; i++)
                        {
                            //alert(results.rows.item(i).id);
                            alert(results.rows.item(i).name);
                        }
                    }, 
                    function(err)
                    {
                        // ERROR
                        alert('テストエラー:' + err);
                    });
            });*/

    }
    catch (e)
    {
        alert(e);
    }
    ons.notification.toast('DB初期化完了', { timeout: 500, animation: 'fall' });
}

/**
 * テーブル作成 
 */
function create_table(transaction)
{
    // transaction.executeSql('drop table if exists test', []);
    // transaction.executeSql('create table test (id, name)', []);
    
    transaction.executeSql('drop table if exists shop', []);
    transaction.executeSql('drop table if exists class', []);
    transaction.executeSql('drop table if exists item', []);
    transaction.executeSql('create table shop (id INTEGER PRIMARY KEY, name TEXT (32) NOT NULL, icon TEXT DEFAULT "no icon", url TEXT (128) DEFAULT "no image", lastupdate TEXT (8) NOT NULL)', []);
    transaction.executeSql('create table class (id INTEGER PRIMARY KEY, name TEXT (32) NOT NULL)', []);
    transaction.executeSql('create table item (id INTEGER PRIMARY KEY, name TEXT (32) NOT NULL, icon NONE DEFAULT "no image", price INTEGER NOT NULL, glucide REAL NOT NULL, calorie REAL NOT NULL, protein REAL, fat REAL, salt REAL, allergy TEXT, shop_id INTEGER NOT NULL, class_id INTEGER NOT NULL, FOREIGN KEY(shop_id) REFERENCES shop(id), FOREIGN KEY(class_id) REFERENCES class(id))', []);
    
}
/**
 * データ登録
 */
/*function insert_datas(transaction)
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
}*/


/**
 * 企業データ登録
 */
function insert_shop(transaction)
{
    var insertSql = 'insert into shop (id, name, icon, url, lastupdate) values (?, ?, ?, ?, ?)';
    var datas = [
        [1, 'セブンイレブン', 'img/cvs/seveneleven.png', 'http://www.sej.co.jp/', '20180309'],
    ];
    for (data of datas)
    {
        transaction.executeSql(insertSql, data);
    }
}

/**
 * 商品分類データ登録
 */
function insert_class(transaction)
{
    var insertSql = 'insert into class (id, name) values (?, ?)';
    var datas = [
        [1, 'お弁当'],
        [2, 'パン'],
        [3, 'ドリンク'],
    ];
    for (data of datas)
    {
        transaction.executeSql(insertSql, data);
    }
}

/**
 * 商品データ登録
 */
function insert_item(transaction)
{
    var insertSql = 'insert into item (id, name, icon, price, glucide, calorie, protein, fat, salt, allergy, shop_id, class_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var datas = [
        [1, 'おいしい弁当', 'img/item/bento.png', 600, 20.0, 1000.0, 0, 0, 0, '', 1, 1],
        [2, 'おいしいパン', 'img/item/bread.png', 400, 20.0, 900.0, 0, 0, 0, '', 1, 2],
        [3, 'ダイエットドリンク', 'img/item/drink.png', 200, 10.0, 100.0, 0, 0, 0, '', 1, 3],
        [4, 'ローソンドリンク', 'img/item/drink.png', 200, 10.0, 300.0, 0, 0, 0, '', 2, 3],
    ];
    for (data of datas)
    {
        transaction.executeSql(insertSql, data);
    }
}


/**
 * DBからコンビニ一覧を取得
 */
function selectShopList(callback) {
    var db = connect();
    db.transaction(function(tx)
    {
        tx.executeSql('select id, name, icon, url, lastupdate from shop order by id', [], 
            function(tx, results)
            {
                // SUCCESS
                var shopList = [];
                for (i = 0; i < results.rows.length; i++)
                {
                    //alert(results.rows.item(i).id);
                    shopList[i] = new Shop(
                        results.rows.item(i).id, 
                        results.rows.item(i).name, 
                        results.rows.item(i).icon, 
                        results.rows.item(i).url, 
                        results.rows.item(i).lastupdate);
                    
                }
                // SQLの実行は非同期っぽいので、実行が完了したらコールバックを呼んであげる                
                callback(shopList);
            }, 
            function(err)
            {
                // ERROR
                alert('コンビニ情報取得エラー:' + err);
            });
    });
}

/**
 * DBから商品一覧を取得
 * @param itemSearchCond 検索、ソート条件
 * @param callback select結果を渡すコールバック
 */
function selectItemList(itemSearchCond, callback) {
    var db = connect();
    db.transaction(function(tx)
    {
        var sql = 'select item.id, item.name, item.icon, item.price, item.glucide, item.calorie, item.protein,' 
            + ' item.fat, item.salt, item.allergy, item.shop_id, item.class_id, shop.icon as shop_icon ' 
            + ' from item join shop on item.shop_id = shop.id '
            + ' where ' + itemSearchCond.getWhereClause()
            + ' order by ' + itemSearchCond.getOrderByClause();
            //alert (sql);
        tx.executeSql(
            sql
            , [], 
            function(tx, results)
            {
                // SUCCESS
                var itemList = [];
                for (i = 0; i < results.rows.length; i++)
                {
                    //alert(results.rows.item(i).id);
                    itemList[i] = new Item(
                        results.rows.item(i).id, 
                        results.rows.item(i).name, 
                        results.rows.item(i).icon, 
                        results.rows.item(i).price,
                        results.rows.item(i).glucide,
                        results.rows.item(i).calorie,
                        results.rows.item(i).protein,
                        results.rows.item(i).fat,
                        results.rows.item(i).salt,
                        results.rows.item(i).allergy,
                        results.rows.item(i).shop_id, 
                        results.rows.item(i).class_id,
                        results.rows.item(i).shop_icon);
                    
                }
                
                // SQLの実行は非同期っぽいので、実行が完了したらコールバックを呼んであげる                
                callback(itemList);
            }, 
            function(err)
            {
                // ERROR
                alert('商品情報取得エラー:' + err);
            });
    });
}

/**
 * DBから商品分類一覧を取得
 */
function selectClassList(callback) {
    var db = connect();
    db.transaction(function(tx)
    {
        tx.executeSql('select id, name from class order by id', [], 
            function(tx, results)
            {
                // SUCCESS
                var classList = [];
                for (i = 0; i < results.rows.length; i++)
                {
                    classList[i] = new Clazz(
                        results.rows.item(i).id, 
                        results.rows.item(i).name);
                    
                }
                // SQLの実行は非同期っぽいので、実行が完了したらコールバックを呼んであげる                
                callback(classList);
            }, 
            function(err)
            {
                // ERROR
                alert('商品分類情報取得エラー:' + err);
            });
    });
}