var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", //Your username
    password: "Chicago5", //Your password
    database: "bamazon"
});
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

var start = function(){
	connection.query('SELECT * FROM products', function(err, res) {
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].Id + " | " + res[i].ProductName + " | " + res[i].Price);
    }
    console.log("-----------------------------------");
    postQuestion();
})
}
var postQuestion = function(){
	inquirer.prompt([{
		name:"id",
		type:"input",
		message:"What is the id number of the product you would like to buy?"
	},
	{	
        name: "number",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }
    ]).then(function(answer) {
    	var queryString = 'SELECT StockQuantity, Price FROM products WHERE Id = '+ answer.id;
    	connection.query(queryString, function(err, res){
    		// console.log(res[0].StockQuantity);
    		//console.log(res[0].Price);
    		var dbPrice = res[0].Price;
    		if(res[0].StockQuantity<answer.number){
    			console.log("Insufficient quantity!");
    			console.log('----------------------------------------------');
    			console.log('-----------------------------------------------');
    			start();
    		}
    		else{
    			var newQuantity = res[0].StockQuantity-answer.number;
    			var updateQuery = 'UPDATE products SET StockQuantity ='+ newQuantity +' WHERE Id ='+ answer.id;
    			connection.query(updateQuery, function(err,res){
    				var customerPrice = answer.number * dbPrice;
    				console.log('your total is ' + customerPrice);
    				console.log('------------------------------------------');
    				console.log('------------------------------------------');
    				start();
    			})

    		}

    	})
    	
		// console.log(answer.id  + ' ' + answer.number);
	}
	)
}
// postQuestion();
start();