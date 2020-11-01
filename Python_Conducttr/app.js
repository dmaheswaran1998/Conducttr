function initial() {
  
  var selector=d3.select("#selDataset");

  //updating the dropdown menu

    d3.json("player_data.json").then(function(data) {
        interaction=data[0].impersonations;
        for (const [key] of Object.entries(interaction)) {
            selector
            .append("option")
            .append("value")
            .text(`${key}`)
            .property("value", name)
            
        }

       

        // var inital_gauge_data=data[0].All;
        // var initial_reply_data=data[1].All;        
        // var initial_time_data=data[3].All;
        
        // updateBar(initial_reply_data);
        // updateGauge(inital_gauge_data);
        // updateLine(initial_time_data)
        // updatePanel(initial_top_cont)
    }); 

   
   
  
  
}

d3.select("#selDataset").on("change", optionChanged);
  
function optionChanged() {
    var selector=d3.select("#selDataset");
  //Assign the value of the dropdown menu option to a variable
    var dropdown_value = selector.property("value");

    d3.json("player_data.json").then(function(data) {
        person_data=data[0].impersonations;
        from_data=data[1].from;
        to_data=data[2].to;
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
      



// }









initial();
