//from data.js

var tbody = d3.select("tbody");

d3.json("player_csv.json").then(function(data) {
    var tableData = data;
    console.log(tableData)

    // log each UFO sighting and append to a rwo
    data.forEach(function(Entry) {
    console.log(Entry);
    var row = tbody.append("tr");
    //logging key-value pairs 
    Object.entries(Entry).forEach(function([key, value]) {
        var cell = row.append("td");
        cell.text(value);
    });
    });
});

    







//Setting up the button 
// Select the  filter button
var button = d3.select("#filter-btn");

// Create event handlers 
button.on("click", runEnter);

//Defining the function
function runEnter(){
    
    //clear the table body 
    d3.select("tbody").html("");

    // Prevent refreshing 
    d3.event.preventDefault();

    //Select input element and value

    //tre try except command is used to avoid null values and return a bla nl value if it isnt entered
    try {
    var dateTime=d3.select("#datetime").property("value");
    }

    catch(TypeError) {
    var dateTime=""
    }

    try {
    var persona=d3.select("#persona").property("value");
    }
    
    catch(TypeError) {
    var persona=""
    }

    try {
    var channel=d3.select("#channel").property("value");
    }
        
    catch(TypeError) {
    var channel=""
    }

    try {
    var interaction=d3.select("#interaction").property("value");
    }
            
    catch(TypeError) {
    var interaction=""
    }

    try {
    var from=d3.select("#from").property("value");
    }
                
    catch(TypeError) {
    var from=""
    }

    try {
    var to=d3.select("#to").property("value");
    }
                
    catch(TypeError) {
    var to=""
    }
    
    //filtered data filtered by each criteria if they are blank, the filter is basically skipped. 

    d3.json("player_csv.json").then(function(data) {

        var tableData=data
        filteredData=tableData  
        
        if (dateTime!=="") {
            var filteredData = filteredData.filter(filteredData => filteredData.Date === dateTime);
        } else { 
            var filteredData = filteredData
        }
    
        if (persona!=="") {
            var filteredData = filteredData.filter(filteredData => filteredData.Name === persona);
        } else { 
            var filteredData = filteredData
        }
    
        if (channel!=="") {
            var filteredData = filteredData.filter(filteredData => filteredData.Channel === channel);
        } else { 
            var filteredData = filteredData
        }
    
        if (interaction!=="") {
            var filteredData = filteredData.filter(filteredData => filteredData.Interaction === interaction);
        } else { 
            var filteredData = filteredData
        }
    
        if (from!=="") {
            var filteredData = filteredData.filter(filteredData => filteredData.From === from);
        } else { 
            var filteredData = filteredData
        }

        if (to!=="") {
            var filteredData = filteredData.filter(filteredData => filteredData.To === to);
        } else { 
            var filteredData = filteredData
        }
    
        console.log(filteredData);
        //getting the property element 
        //logging it out.
    
        filteredData.forEach((Entry) => {
            var row = tbody.append('tr');
        
            Object.entries(Entry).forEach(([key, value]) => {
                console.log(key, value);
                var cell = row.append('td');
                cell.text(value);
            });
        });


    });


   
    

};