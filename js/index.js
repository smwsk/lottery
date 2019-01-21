$(function () {
    var choosed = JSON.parse(localStorage.getItem('choosed')) || {};
    console.log(choosed);

    var initData = function (that) {
        var person = [];
        for (var index in that.rewards) {
            person = JSON.parse(localStorage.getItem(that.rewards[index].name));
            that.rewards[index].person = person;
        }
    }
	
	
    var speed = function () {
        return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
    };
    var getKey = function (item) {
        return item.name;
    };
	
    var createHTML = function () {
        var html = ['<ul>'];
        member.forEach(function (item, index) {
            item.index = index;
            var key = getKey(item);
            var color = choosed[key] ? 'yellow' : 'white';
            html.push('<li><a href="#" style="color: ' + color + ';"><span style="font-size: 150px">' + item.name + '</span></a></li>');
        });
        html.push('</ul>');
        return html.join('');
    };

    var lottery = function (that, btns, index) {

        var total = member.length;
        var person = [];
        var temp = localStorage.getItem(btns[index].name);
        if (temp != null && temp != undefined) {
            person = JSON.parse(temp);
        }
        var ret = [];
        var list = canvas.getElementsByTagName('a');
        var color = '#' + ('00000' + Math.floor(Math.random() * 0xffffff)).slice(-6);
        var color = 'yellow';
        for (var i = 0; i < btns[index].number; i++) {
            do {
                var id = Math.ceil(Math.random() * total) - 1;
                if (member[id]) {
                    var key = getKey(member[id]);
                }
            } while (choosed[key]);
            choosed[key] = 1;
            ret.push(btns[index].name + '<br/>' + member[id].name);
            person.push(member[id].name)
            list[id].style.color = color;
        }
        that.rewards[index].person = person;
        localStorage.setItem(btns[index].name, JSON.stringify(person));
        localStorage.setItem('choosed', JSON.stringify(choosed));
        return ret;
    };

    var canvas = document.createElement('canvas');
    canvas.id = 'myCanvas';
    canvas.width = $(window).get(0).innerWidth;
    canvas.height = $(window).get(0).innerHeight;
    canvas.addEventListener("click", function () {
        canvas.width = $(window).get(0).innerWidth;
        canvas.height = $(window).get(0).innerHeight;
    })
    document.getElementById('main').appendChild(canvas);

    new Vue({
        el: '#app',
        data: {
            selected: 2,
            running: false,
            btns: [
                {"name": "一等奖", "number": "1","canClick":true},
                {"name": "二等奖", "number": "2","canClick":true},
                {"name": "三等奖", "number": "3","canClick":true}
            ],
            rewards: [
                {"name": "一等奖", "person": []},
                {"name": "二等奖", "person": []},
                {"name": "三等奖", "person": []}
            ]
        },
        ready: function () {
            canvas.innerHTML = createHTML();
            TagCanvas.Start('myCanvas', '', {
                textColour: null,
                initial: speed(),
                dragControl: 1,
                textHeight: 25
            });
            initData(this);
        },
        methods: {
            onClick: function (index) {
                $('#result').css('display', 'none');
                $('#main').removeClass('mask');
                this.selected = index;
            },
            toggle: function () {
                var that = this;
                var name = this.btns[this.selected].name
                var noSelect = 0;
                member.forEach(function (item, index) {
                    var key = getKey(item);
                    if (!choosed[key]) {
                        noSelect++;
                    }
                });

                if (this.btns[this.selected].number > noSelect) {
                    alert("奖池人数不够");
                    return;
                }

                if (this.running) {
                    TagCanvas.SetSpeed('myCanvas', speed());
                    var ret = lottery(that, this.btns, this.selected);
                    $('#result').css('display', 'block').html('<span>' + ret.join('</span><span>') + '</span>');
                    TagCanvas.Reload('myCanvas');
                    setTimeout(function () {
                        $('#main').addClass('mask');
                    }, 300);
                    $(".pure-button").eq(this.selected).attr('disabled','disabled')
                } else {
                    $('#result').css('display', 'none');
                    $('#main').removeClass('mask');
                    TagCanvas.SetSpeed('myCanvas', [5, 1]);
                }
                this.running = !this.running;
            },
			downloadFile: function(){
                var data = ",中奖名单,\n";
                this.btns.forEach(function(item,index){
                    var persons = localStorage.getItem(item.name);
                    if(persons!=null && persons!=undefined){
                        persons = JSON.parse(persons);
                    }
                    var persondata = item.name + ",";
                    for(var person in persons){
                        persondata += persons[person] + ",";
                    }
                    data = data + persondata+"\n";
                })


				data = "\ufeff" + data;
				var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
				saveAs(blob, "中奖名单.csv");//saveAs(blob,filename)
			}
        }
		
    });
});