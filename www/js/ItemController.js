/**
 * 商品一覧画面のコントローラークラス。
 * 画面の表示や商品の並び順などを管理する
 */
angular.module('myApp',[]).controller('itemController', function($scope) {   
   // $scope初期化
   
   // 商品一覧
   $scope.itemList = [];
   
   // イベント処理
   $scope.menuClick = function() {
       alert("hoge");
       
       
   };
});
