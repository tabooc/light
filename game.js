/*
    main
*/

var Game = function() {
    this.lock = false;
    this.box = "J_game";
    this.row = 10;
    this.col = 10;
    this.totalTime = 0;
    this.T = null;
    this.totalCells = this.row * this.col;
    this.emptyCells = this.totalCells;
    this.selClass = "light";
    this.init();
}
Game.prototype = {
    constructor: Game,
    //初始化格子
    init: function() {
        var nodes = document.createDocumentFragment(),
            li;
        this.getId(this.box).innerHTML = '';

        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                li = document.createElement("li");
                li.id = "J_cells_" + i + "_" + j;
                nodes.appendChild(li);
            }
        }
        this.getId(this.box).appendChild(nodes);
        this.run();
    },
    run: function() {
        var timebox = this.getId('J_time'),
            _this = this;

        this.T = setInterval(function() {
            _this.totalTime += 1;
            timebox.innerHTML = _this.totalTime;
        }, 1000);

        this.addClickEvent();
    },
    addClickEvent: function() {
        var _this = this,
            li = this.getId("J_game").getElementsByTagName("li");

        for (var i = 0, len = li.length; i < len; i++) {
            li[i].onclick = function() {
                if (_this.lock) {
                    alert("游戏已暂停,请点击继续游戏..");
                    return false;
                }
                var idInfo = _this.getCellInfo(this.id);
                _this.changeStatus(idInfo.row, idInfo.col);
                _this.findCells(idInfo);
            };
        }

        this.getId("J_pause").onclick = function() {
            var text = this.innerHTML,
                timebox = _this.getId('J_time');

            if (text == "继续游戏") {
                _this.lock = false;
                this.innerHTML = "暂停游戏";
                _this.T = setInterval(function() {
                    _this.totalTime += 1;
                    timebox.innerHTML = _this.totalTime;
                }, 1000);
            } else {
                _this.lock = true;
                this.innerHTML = "继续游戏";
                _this.pause();
            }

        }
        this.getId("J_stop").onclick = function() {
            _this.stop();
        }

    },
    getCellInfo: function(id) {
        var idInfo = id.split("_");
        return {
            row: parseInt(idInfo[2]),
            col: parseInt(idInfo[3])
        };

    },
    findCells: function(obj) {
        if (obj.row - 1 >= 0) {
            this.changeStatus(obj.row - 1, obj.col);
        }
        if (obj.row + 1 < this.row) {
            this.changeStatus(obj.row + 1, obj.col);
        }
        if (obj.col - 1 >= 0) {
            this.changeStatus(obj.row, obj.col - 1);
        }
        if (obj.col + 1 < this.col) {
            this.changeStatus(obj.row, obj.col + 1);
        }
    },
    changeStatus: function(row, col) {

        var obj = this.getId('J_cells_' + row + "_" + col),
            status = obj.className;

        if (status) {
            obj.className = "";
            this.emptyCells++;
        } else {
            obj.className = this.selClass;
            this.emptyCells--;
        }        
        this.getId('J_light').innerHTML = this.totalCells - this.emptyCells;
        this.getId('J_black').innerHTML = this.emptyCells;

        if(this.emptyCells == 0){
            alert("WIN!");
        }
    },
    pause: function() {
        clearInterval(this.T);
    },
    stop: function() {
        clearInterval(this.T);
        window.location.reload();
    },
    getId: function(id) {
        return document.getElementById(id);
    }
}

document.getElementById("J_play").onclick = function() {
    var lock = this.getAttribute("data-st");
    if (lock == "1") {
        return false;
    }
    this.className = this.className.replace(/ z-enable/,"") +" z-disabled";
    document.getElementById("J_pause").className = document.getElementById("J_pause").className + " z-enable";
    document.getElementById("J_stop").className = document.getElementById("J_stop").className + " z-enable";
    this.setAttribute("data-st", 1);
    new Game();
}
