﻿// Renade RP. GGame Studio. 23.10.2017
// Gun tool view controller

let list = $('.list');

Object.keys(weapons.list).forEach(function (name, i) {
    var option = $('<option></option>');
    option.val(weapons.list[i]);
    option.text(name);
    list.append(option);
});

function give() {
    let optionSelected = $("option:selected", list);
    alert('test ' + optionSelected.text());
}