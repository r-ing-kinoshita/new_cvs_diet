/** 企業 */
var Shop = function(id, name, icon, url, lastupdate) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.url = url;
        this.lastupdate = lastupdate;
    };

/** 商品 */
var Item = function(id, name, icon, price, glucide, calorie, protein, fat, salt, allergy, shop_id, class_id, shop_icon) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.price = price;
    this.glucide = glucide;
    this.calorie = calorie;
    this.protein = protein;
    this.fat = fat;
    this.salt = salt;
    this.allergy = allergy;
    this.shop_id = shop_id;
    this.class_id = class_id;
    this.shop_icon = shop_icon;
};

/**
 * 商品の検索条件
 * @param sort
 * 0:デフォルトソート
 * 1:糖質（昇順）
 * 2:糖質（降順）
 * 3:カロリー（昇順）
 * 4:カロリー（降順）
 * 5:値段（昇順）
 * 6:値段（降順）
 * 
 */ 
var ItemSearchCond = function(shop_id, class_id, sort) {
    this.shopId = shop_id;
    this.classId = class_id;
    this.sort = sort;
    
    this.getWhereClause = function() {
        var where = [];
        var idx = 0;
        if (this.shopId) {
            where[idx++] = " item.shop_id = " + this.shopId + " ";
        }
        if (this.classId) {
            where[idx++] = " item.class_id = " + this.classId + " ";
        }
        return where.join("and");
    }
    this.getOrderByClause = function() {
        switch (this.sort) {
            case 1:
                return " item.glucide asc, item.id ";
            case 2:
                return " item.glucide desc, item.id ";
            case 3:
                return " item.calorie asc, item.id ";
            case 4:
                return " item.calorie desc, item.id ";
            case 5:
                return " item.price asc, item.id ";
            case 6:
                return " item.price desc, item.id ";
        
        }
        return " item.id ";
    }
};

/** 商品分類 */ // ClassはダメだったのでClazz
var Clazz = function(id, name) {
    this.id = id;
    this.name = name;
};

