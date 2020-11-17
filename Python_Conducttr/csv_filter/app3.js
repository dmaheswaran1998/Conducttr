

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}


d3.json("player_csv.json").then(function(data) {

    data1=data

    console.log(data1);

    var date=[];
    var persona=[];
    var from=[];
    var to=[];
    var interaction=[];
    var channel=[];
    




    for (i = 0; i < data1.length; i++) {
    persona.push(data[i].Name);
    date.push(data[i].Date);
    from.push(data[i].From);
    to.push(data[i].To)
    interaction.push(data[i].Interaction);
    channel.push(data[i].Channel)

    }

    persona_unique=[];
    channel_unique=[];
    date_unique=[];
    to_unique=[];
    from_unique=[];
    interaction_unique=[];


    for (i=0; i<persona.length; i++){
        var n=persona_unique.includes(persona[i]);
        if (n===false){
            persona_unique.push(persona[i]);
        }

    }

    for (i=0; i<channel.length; i++){
        var n=channel_unique.includes(channel[i]);
        if (n===false){
            channel_unique.push(channel[i]);
        }

    }

    for (i=0; i<date.length; i++){
        var n=date_unique.includes(date[i]);
        if (n===false){
            date_unique.push(date[i]);
        }

    }

    for (i=0; i<interaction.length; i++){
        var n=interaction_unique.includes(interaction[i]);
        if (n===false){
            interaction_unique.push(interaction[i]);
        }

    }

    for (i=0; i<to.length; i++){
        var n=to_unique.includes(to[i]);
        if (n===false){
            to_unique.push(to[i]);
        }

    }

    for (i=0; i<from.length; i++){
        var n=from_unique.includes(from[i]);
        if (n===false){
            from_unique.push(from[i]);
        }

    }


    console.log(persona_unique, channel_unique, date_unique);

    
    autocomplete(document.getElementById("persona"), persona_unique);
    autocomplete(document.getElementById("datetime_start"), date_unique);
    autocomplete(document.getElementById("datetime_end"), date_unique);
    autocomplete(document.getElementById("channel"), channel_unique);
    autocomplete(document.getElementById("interaction"), interaction_unique);
    autocomplete(document.getElementById("from"), from_unique);
    autocomplete(document.getElementById("to"), to_unique);



});

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

//data 