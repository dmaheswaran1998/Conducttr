function initial() {
  

  //updating the dropdown menu

    d3.json("player_data.json").then(function(data) {
        interaction=data[0].impersonations;
        // for (const [key] of Object.entries(interaction)) {
        //     selector
        //     .append("option")
        //     .append("value")
        //     .text(`${key}`)
        //     .property("value", name)
            
        // }

        var2=[]
        for (const [key] of Object.entries(interaction)) {
            var2.push(key);
            
        
        }

        console.log(var2);



        var time_data=data[3].time_list;




        autocomplete(document.getElementById("myInput"), time_data);
        autocomplete(document.getElementById("myInput2"), time_data);
        autocomplete(document.getElementById("myInput3"), var2);

       

        // var inital_gauge_data=data[0].All;
        // var initial_reply_data=data[1].All;        
        // var initial_time_data=data[3].All;
        
        // updateBar(initial_reply_data);
        // updateGauge(inital_gauge_data);
        // updateLine(initial_time_data)
        // updatePanel(initial_top_cont)
    }); 


  
  
}

d3.select("#submit_player").on("click", optionChanged);
  
function optionChanged() {
  //Assign the value of the dropdown menu option to a variable


    var dropdown_value = d3.select("#myInput3").node().value;



    d3.json("player_data.json").then(function(data) {
        person_data=data[0].impersonations;
        from_data=data[1].from;
        to_data=data[2].to;
        time_data=data[4];
        // reply_frequency=data[2]
        // reply_total=data[0]
        // reply_time=data[3]
        for (const [key, value] of Object.entries(person_data)) {
            if (key==dropdown_value){
                
                var people=key;
                var name=value;
                //updateBar(dictionary);

                updatePanel(people, name);
                //updatePanel(people_imperson);
            }    
        
        }

        for (const [key, value] of Object.entries(from_data)) {
            if (key==dropdown_value){
                
                var interaction=value;

                updateBar1(interaction); 
            }  
           
            
        
        }

        for (const [key, value] of Object.entries(to_data)) {
            if (key==dropdown_value){
                
                var interaction=value;

                updateBar2(interaction); 
            }  
           
            
        
        }



    
    });  
    




    // for (const [key, value] of Object.entries(reply_total)) {
    //     if (key==dropdown_value){
    //         var dictionary3=value;
    //         updateGauge(dictionary3);
    //     }  

    
    // }

                  



}

d3.select("#clear_player_data").on("click", clearPlayer);

function clearPlayer () {
    d3.select("#myInput3").node().value = "";
}



//         

//         for (const [key, value] of Object.entries(reply_time)) {
//             if (key==dropdown_value){
//                 var dictionary4=value;
//                 updateLine(dictionary4);
//             }    
        
//         }
//     });   

// } 

function updateBar1(newdata) {

    //come back tomorrow
    var2=[]
    txt=[]
    for (const [key, value] of Object.entries(newdata)) {
        var2.push(key);
        txt.push(value);
        
    
    }

    
    
    frequency=[]
    text_list=[]
    for (var i = 0; i < var2.length; i++) {
        var All_text=newdata[var2[i]].All;
        frequency.push(All_text);
        text_list.push(newdata[var2[i]]);
        
        //Do something
    }

    text_list_2=[]
    for (var i = 0; i < text_list.length; i++) {
        var myString = JSON.stringify(text_list[i]);
        text_list_2.push(myString);
       
        
        //Do something
    }


 






    //updateBar(interaction);
    //updateBar(dictionary)
    //updatePanel(people_imperson);  


    // console.log(interaction);
    // for (const [key, value] of Object.entries(frequency)) {
    //     frequency3=frequency2.All
    
    // }
    // console.log(frequency3);

    
    var trace1 ={
        x: frequency,
        y: var2,
        name: "Greek",
        type: "bar",
        text: text_list_2,
        orientation: "h"
    };


    
      var layout = {
        title: 'Different Personas that can be personated',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"Frequency" },
        yaxis: {title:"Engagement Type" },
        margin: {t:30}
      };
    
    
      var bar_chart = [trace1];
    
    
    Plotly.newPlot("bar", bar_chart, layout);
    




}




function updatePanel(people, name) {
    var panel_select=d3.select("#sample-metadata");
    d3.select("#sample-metadata").html("");
    //frequency=[]
    // for (const [key] of Object.entries(newdata)) {
    //     name.push(key) 
    //     //frequency.push(value)
    // }
    
    //name=social.slice(0,10)
    //ten_top=frequency.slice(0,10)

    var i;

    panel_select
    .append("p")
    .text(` ${"Name"}: ${people}`)
    .append("p")
    .text(`${"Impersonation Names"}`)

    for (i = 0; i < name.length; i++) {
        panel_select
        .append("p")
        .text(`${name[i]}`)
    }












}


function updateBar2(newdata) {

    //come back tomorrow
    var2=[]
    txt=[]
    for (const [key, value] of Object.entries(newdata)) {
        var2.push(key);
        txt.push(value);
        
    
    }

    
    
    frequency=[]
    text_list=[]
    for (var i = 0; i < var2.length; i++) {
        var All_text=newdata[var2[i]].All;
        frequency.push(All_text);
        text_list.push(newdata[var2[i]]);
        
        //Do something
    }

    text_list_2=[]
    for (var i = 0; i < text_list.length; i++) {
        var myString = JSON.stringify(text_list[i]);
        text_list_2.push(myString);
       
        
        //Do something
    }


 






    //updateBar(interaction);
    //updateBar(dictionary)
    //updatePanel(people_imperson);  


    // console.log(interaction);
    // for (const [key, value] of Object.entries(frequency)) {
    //     frequency3=frequency2.All
    
    // }
    // console.log(frequency3);

    
    var trace1 ={
        x: frequency,
        y: var2,
        name: "Greek",
        type: "bar",
        text: text_list_2,
        orientation: "h"
    };


    
      var layout = {
        title: 'Different Personas that can be personated',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"Frequency" },
        yaxis: {title:"Engagement Type" },
        margin: {t:30}
      };
    
    
      var bar_chart = [trace1];
    
    
    Plotly.newPlot("bar1", bar_chart, layout);
    




}

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



function handleSubmit() {
    // Prevent the page from refreshing
  
    // Select the input value from the form
    var dropdown_value = d3.select("#myInput3").node().value;

    var start1= d3.select("#myInput").node().value;
    //console.log(start_date);

    var end1 = d3.select("#myInput2").node().value;


    d3.json("player_data.json").then(function(data) {


        
        var time_data=data[3].time_list;

        //var final_date_length=time_data.length;
        var final_date_length=time_data.length-1;
        var final_date=time_data[`${final_date_length}`]

        if (start1==="") {
            start1=time_data[0];
        }

        console.log(start1);

        if (end1==="") {
            end1=time_data[`${final_date_length}`]
        }

        console.log(end1);



        //console.log(end_date);

        time_data=data[4];

        time_list1=data[3].time_list

        for (var i = 0; i < time_list1.length; i++) {
            if (time_list1[i]===start1){
                var start_index=i;
                console.log(start_index);
            }

            if (time_list1[i]===end1){
                var end_index=i;
                console.log(end_index);
            }
                
            //Do something
        }

        


        for (const [key, value] of Object.entries(time_data)) {
            if (key==dropdown_value){
                
                var interaction=value;
                console.log(interaction);

            }  
           
            
        
        }

    
        
        
        
    });   
    
    d3.select("#myInput").node().value = "";
    d3.select("#myInput2").node().value = "";








       

    // }); 
  
    //console.log(end_date);
  
    // clear the input value


    console.log();
  
    // Build the plot with the new stock
    // buildPlot(stock);
}
  
// function buildPlot(stock) {

//     var stock = 3;
//     console.log(stock);
  
// }
 
// Add event listener for submit button
d3.select("#submit_dates").on("click", handleSubmit);
  


// function updateGauge(newdata){
  
      
      
//     var data = [
//         {
//           type: "indicator",
//           mode: "gauge+number",
//           value: newdata,
//           title: { text: "Total Player Interaction" },
//           gauge: {
//             axis: { range: [null, 2600], tickwidth: 1, tickcolor: "darkblue" },
//             bar: { color: "darkblue" },
//             borderwidth: 2,
//             bordercolor: "gray",
//             steps: [
//               { range: [0, 1300], color: "cyan" },
//               { range: [1300, 2600], color: "royalblue" }
//             ],
//           }
//         }
//     ];
      
//     var layout = {
//         width: 400,
//         height: 400,
//         margin: { t: 25, r: 35, l: 25, b: 25 },
//         font: { color: "darkblue", family: "Arial" }
//     };
      
//     Plotly.newPlot('gauge', data, layout);
    
// }

// function updateLine(newdata){
//     var time=[]
//     var frequency=[]
//     for (const [key, value] of Object.entries(newdata)) {
//         time.push(key) 
//         frequency.push(value)
    
//     }

//     trace1 = {
//         type: 'scatter',
//         x: time,
//         y: frequency,
//         mode: 'lines',
//         name: 'Red',
//         line: {
//             color: 'rgb(55, 128, 191)',
//           width: 3
//         }
//     };

//     var layout = {
//         width: 1200,
//         height: 500,
//         title: 'Timeline of Channel Engagement',
//         showlegend: false,
//         hovermode: 'closest',
//         xaxis: {title:"Time" },
//         yaxis: {title:"Frequency" },
//         margin: {t:30}
//     };
      
//     var line = [trace1];
      
//     Plotly.newPlot('line', line, layout);
      



// // }









initial();
