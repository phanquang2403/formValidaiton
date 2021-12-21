var Form = function (params) {
    this.el = params.el; 
    this.rules = params.rules; 
    this.items = []; 
    this.element = null; 
    this.submit = null;
    this.init = function () {
        var self = this;
       
        this.element = document.getElementById(this.el);
        this.submit = this.element.querySelector(`input[type='submit']`);
        if (this.element == null) throw new Error('From element doesn\'t exist!');
        for (let item in this.rules) {
            
            let itemElement = this.element.querySelector('input[name="' + item + '"]');
            if (itemElement == null) continue;
            let itemInput = new Item({
                el: itemElement,
                rules: this.rules[item]
            });
            this.items.push(itemInput);

        }
        
        self.buttonSubmit();
 
    }
    this.init();
}
Form.prototype.validation = function(){
    let error = 0;
    for(let item in this.items){
        if(!this.items[item].validation()) error++;
    }
    if(error > 0) return false;
    return true;
}
Form.prototype.buttonSubmit = function(){
    var self = this;
    this.submit.addEventListener('click',function(event){
        if(self.validation()){
        }else{
            event.preventDefault();
        }
    });
}


var Item = function (params) {
    this.element = params.el;
    this.rules = params.rules;
    var self = this;
    this.element.addEventListener('blur',function(event){
        self.validation();
    });
}
Item.prototype.validation = function(){
    let ruleLength = Object.keys(this.rules).length;
    let check = 0;
    let checkMessageErrow = 0;
    var itemElement = this.element;
    for(let rule in this.rules){
        switch (rule) {
            case 'email':
                if(this.email(itemElement.value)) {
                    check++;
                    ++checkMessageErrow;
                } 
                break;
            case 'required':
                if(this.required(itemElement.value)){
                    check++;
                    ++checkMessageErrow;
                }
                break;
            case 'equalTo' :
                if(this.equalTo(itemElement.value,this.rules[rule])){
                    check++;
                    ++checkMessageErrow;
                } 
                break;  
            case 'minlength' :
                if(this.minleng(itemElement.value,this.rules[rule])){
                    check++;
                    ++checkMessageErrow;
                } 
                break;     
            case 'confirm_pass':
                if(this.confirm_pass(itemElement.value,this.rules[rule])) {
                    check++;
                    ++checkMessageErrow;
                } 
                break;
            
        }
        if(checkMessageErrow === 0 ){
            break;
        }
        
    }
    if(check < ruleLength){
        this.printError();
        return false;
    }
    else{
        this.removeError();
        return true;
    }
}

Item.prototype.printError = function(){
    this.element.style.border =  '2px solid rgba(255, 0, 0, 0.514)';
}

Item.prototype.removeError = function(){
    this.element.style.border =  '';
    this.element.parentElement.querySelector(".errow").innerText = "";
}

Item.prototype.required = function(value){
    if(value == ''){
        this.element.parentElement.querySelector(".errow").innerText = "Không để trống";
        return false;
    }
    return true;
}
Item.prototype.number = function(value){    
    if(value != '' && value < 0){
        this.element.parentElement.querySelector(".errow").innerText = "Số lớn hơn 0";
        return false;
    }
    return true;
}
Item.prototype.minleng = function(value, minleng){
    if(value.length < minleng){
       
        this.element.parentElement.querySelector(".errow").innerText =  `Tối thiểu ${minleng} kí tự`;
        return false;
    }
    return true;
}
Item.prototype.confirm_pass = function(value, password){
    var equal__pass = document.querySelector('input[name="' + password + '"]');
    if(value === equal__pass.value){
        return true;
    }else{
        this.element.parentElement.querySelector(".errow").innerText =  "Mật khẩu không giống nhau";
        return false;
    }
}
Item.prototype.email = function(value){
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    this.element.parentElement.querySelector(".errow").innerText =  "Không phải định dạng Email";

    return regex.test(value);
}

Item.prototype.equalTo = function(value,equalToEl){
    var equalElement = document.querySelector('input[name="' + equalToEl + '"]');
    
    // value
    // 2021-12-17
    // convert time => milisecond
    var end = value.split("-");
    var newDate = new Date( end[0], end[1], end[2]);
    var dateEnd= newDate.getTime();

    // convert time => milisecond
    var start = equalElement.value.split("-");
    var newdate2= new Date( start[0], start[1], start[2]);
    var dateStart= newdate2.getTime();
    
    if(dateEnd >= dateStart){
        return true;
    }else{
        this.element.parentElement.querySelector(".errow").innerText = "Thời dan bắt đầu nhỏ hơn kết thúc";
        return false;
    } 
}
