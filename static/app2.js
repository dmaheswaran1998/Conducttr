// function initial() {
  
//     var selector=d3.select("#selDataset");
  
//     updating the dropdown menu


var All_data;


var selector=d3.select("#selDataset");

d3.select("#btn-player").on("click",updateData);


function updateData() {

    d3.json("/player_data").then(function(data) {
        All_data=data
        console.log(All_data)
        
       init(All_data);


    });


    


            
}


function init(All_data) {
    var data=All_data;

    interaction=data[0].impersonations;
  
   
    var2=[]
    for (const [key] of Object.entries(interaction)) {
        var2.push(key);
        
    
    }




    var time_data=data[3].time_list;




    autocomplete(document.getElementById("myInput"), time_data);
    autocomplete(document.getElementById("myInput2"), time_data);
    autocomplete(document.getElementById("myInput3"), var2);

        
    

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

d3.select("#myInput3").on("click", clearPlayer);

function clearPlayer () {
    d3.select("#myInput3").node().value = "";
    // d3.select("#sample-metadata").html("");
    // d3.select("#line").html("");
    // d3.select("#bar1").html("");
    // d3.select("#bar").html("");
}


d3.select("#submit_player").on("click", optionChanged);



function optionChanged() {
    //Assign the value of the dropdown menu option to a variable
  
    var data=All_data;
    var dropdown_value = d3.select("#myInput3").node().value;
  
  
  
   
    person_data=data[0].impersonations;
    from_data=data[1].from;
    to_data=data[2].to;
    time_data=data[4];
    time_list=data[3].time_list;
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

                var2=[]
                txt=[]
                for (const [key, value] of Object.entries(interaction)) {
                    var2.push(key);
                    txt.push(value);
                    
                
                }
            
                microblog=[]
                gosocial=[]
                websites=[]
                mail=[]
                
                frequency=[]
                for (var i = 0; i < var2.length; i++) {
                    microblog.push(interaction[var2[i]].microblog);
                    gosocial.push(interaction[var2[i]].gosocial);
                    websites.push(interaction[var2[i]].websites);
                    mail.push(interaction[var2[i]].mail)

                    





                    //text_list.push(interaction[var2[i]]);
                    
                    //Do something
                }

                mail = mail.map(v => v === undefined ? 0 : v);
                websites= websites.map(v => v === undefined ? 0 : v);
                gosocial= gosocial.map(v => v === undefined ? 0 : v);
                microblog= microblog.map(v => v === undefined ? 0 : v);


                
                total_list=[]
                for (var i = 0; i < var2.length; i++) {
                    total=0
                    total=mail[i]+websites[i]+gosocial[i]+microblog[i]
                    total_list.push(total);




                    //text_list.push(interaction[var2[i]]);
                    
                    //Do something
                }



                updateBar1(total_list, var2); 

                console.log(var2);
            
            
            
        
        }

        for (const [key, value] of Object.entries(to_data)) {
            if (key==dropdown_value){

                var interaction=value;
                
                var2=[]
                txt=[]
                for (const [key, value] of Object.entries(interaction)) {
                    var2.push(key);
                    txt.push(value);
                    
                
                }
            
                microblog=[]
                gosocial=[]
                websites=[]
                mail=[]
                
                frequency=[]
                for (var i = 0; i < var2.length; i++) {
                    microblog.push(interaction[var2[i]].microblog);
                    gosocial.push(interaction[var2[i]].gosocial);
                    websites.push(interaction[var2[i]].websites);
                    mail.push(interaction[var2[i]].mail)

                    





                    //text_list.push(interaction[var2[i]]);
                    
                    //Do something
                }

                mail = mail.map(v => v === undefined ? 0 : v);
                websites= websites.map(v => v === undefined ? 0 : v);
                gosocial= gosocial.map(v => v === undefined ? 0 : v);
                microblog= microblog.map(v => v === undefined ? 0 : v);


                
                total_list=[]
                for (var i = 0; i < var2.length; i++) {
                    total=0
                    total=mail[i]+websites[i]+gosocial[i]+microblog[i]
                    total_list.push(total);




                    //text_list.push(interaction[var2[i]]);
                    
                    //Do something
                }



                updateBar2(total_list, var2); 
            }  
            
            
        
        }

        for (const [key, value] of Object.entries(time_data)) {

            if (key==dropdown_value){
                
                var people1=value;

                updateLineData(people1, time_list);
            }  
            
            
        
        }



    
    };  
    
  
};
  
                    
  
  
 
  
function updateBar1(frequency, name) {



    var trace1 ={
        x: frequency,
        y: name,
        name: "Greek",
        type: "bar",
        orientation: "h"
    };



        var layout = {
        title: 'Impersonations',
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

function updateBar2(frequency, name) {

    //come back tomorrow
    var trace1 ={
        x: frequency,
        y: name,
        name: "Greek",
        type: "bar",
        orientation: "h"
    };


    
      var layout = {
        title: 'Sent to other Players',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"Frequency" },
        yaxis: {title:"Engagement Type" },
        margin: {t:30}
      };
    
    
      var bar_chart = [trace1];
    
    
    Plotly.newPlot("bar1", bar_chart, layout);
    




}

function handleSubmit() {
    // Prevent the page from refreshing
  
    // Select the input value from the form
    var dropdown_value = d3.select("#myInput3").node().value;

    var start1= d3.select("#myInput").node().value;

    //console.log(start_date);

    var end1 = d3.select("#myInput2").node().value;


    var data=All_data


        
    var time_data=data[3].time_list;
    var people_list=data[5];
    var to_list=data[6];

    //var final_date_length=time_data.length;
    var final_date_length=time_data.length-1;
    

    if (start1==="") {
        start1=time_data[0];
    }


    if (end1==="") {
        end1=time_data[`${final_date_length}`]
    }




    //console.log(end_date);

    time_data=data[4];

    time_list1=data[3].time_list

    for (var i = 0; i < time_list1.length; i++) {
        if (time_list1[i]===start1){
            var start_index=i;
        }

        if (time_list1[i]===end1){
            var end_index=i+1;
        }
            
        //Do something
    }

    var filtered_dates= time_list1.slice(`${start_index}`, `${end_index}`);
    //console.log(filtered_dates)

    for (const [key, value] of Object.entries(time_data)) {
        if (key==dropdown_value){
            
            var people=value;
            updateLineData(people, filtered_dates);
            

        }  
        
        
    
    
    }

    for (const [key, value] of Object.entries(people_list)) {
        if (key==dropdown_value){
            
            var people=value;
            editBar(people, filtered_dates);
            

        }  
        
        
    
    
    }


    for (const [key, value] of Object.entries(to_list)) {
        if (key==dropdown_value){
            
            var people=value;
            editBar2(people, filtered_dates);
            

        }  
        
        
    
    
    }



        
        
          
    
    d3.select("#myInput").node().value = "";
    d3.select("#myInput2").node().value = "";








       

  


 
  
    
}

d3.select("#submit_dates").on("click", handleSubmit);

function updateLineData (people, filtered_dates) {

    console.log(filtered_dates);
    
    
    time=[]
    frequency_all=[]
    for (const [key, value] of Object.entries(people.All)) {
        time.push(key);
        frequency_all.push(value);
    
    }

    console.log(time);


    frequency_mail=[]
    time_mail=[]
    try { 
        for (const [key, value] of Object.entries(people.mail)) {
            frequency_mail.push(value);
            time_mail.push(key);
        
        }

    }

    catch(err) {
        time_mail=time;
        for (var i = 0; i < time.length; i++) {
            frequency_mail.push(0);
            
            //Do something
        }
    }

    freq_mail2=[]
    a=0
    for (var i = 0; i < time.length; i++) {
        var n = time_mail.includes(`${time[i]}`)
        if ( n===true){
            freq_mail2.push(frequency_mail[`${a}`]);
            a=a+1
          


        }
        else {
            freq_mail2.push(0);
        }
        
        //Do something
    }






    frequency_microblog=[]
    time_microblog=[]
    try { 
        for (const [key, value] of Object.entries(people.microblog)) {
            frequency_microblog.push(value);
            time_microblog.push(key);
        
        }

    }

    catch(err) {
        time_microblog=time;
        for (var i = 0; i < time.length; i++) {
            frequency_microblog.push(0);
            
            //Do something
        }
    }

    freq_microblog2=[]
    s=0
    for (var i = 0; i < time.length; i++) {
        var n = time_microblog.includes(`${time[i]}`)
        if ( n===true){
            freq_microblog2.push(frequency_microblog[`${s}`]);
            s=s+1
          


        }
        else {
            freq_microblog2.push(0);
        }
        
        //Do something
    }


    frequency_gosocial=[]
    time_gosocial=[]
    try { 
        for (const [key, value] of Object.entries(people.gosocial)) {
            frequency_gosocial.push(value);
            time_gosocial.push(key);
        
        }

    }
    catch(err) {
        time_gosocial=time;
        for (var i = 0; i < time.length; i++) {
            frequency_gosocial.push(0);
            
            //Do something
        }
    }
    
    freq_gosocial2=[]
    q=0
    for (var i = 0; i < time.length; i++) {
        var n = time_gosocial.includes(`${time[i]}`)
        if ( n===true){
            freq_gosocial2.push(frequency_gosocial[`${q}`]);
            q=q+1
          


        }
        else {
            freq_gosocial2.push(0);
        }
        
        //Do something
    }

    frequency_mediablog=[]
    time_mediablog=[]
    try { 
        for (const [key, value] of Object.entries(people.mediablog)) {
            frequency_mediablog.push(value);
            time_mediablog.push(key);
        
        }

    }
    catch(err) {
        time_mediablog=time;
        for (var i = 0; i < time.length; i++) {
            frequency_mediablog.push(0);
            
            //Do something
        }
    }
    
    freq_mediablog2=[]
    q=0
    for (var i = 0; i < time.length; i++) {
        var n = time_mediablog.includes(`${time[i]}`)
        if ( n===true){
            freq_mediablog2.push(frequency_mediablog[`${q}`]);
            q=q+1
          


        }
        else {
            freq_mediablog2.push(0);
        }
        
        //Do something
    }

    

    
    frequency_websites=[]
    time_websites=[]
    try { 
        for (const [key, value] of Object.entries(people.websites)) {
            frequency_websites.push(value);
            time_websites.push(key);
        
        }

    }

    catch(err) {
        time_websites=time;
        for (var i = 0; i < time.length; i++) {
            frequency_websites.push(0);
            
            //Do something
        }
    }

    freq_websites2=[]
    r=0
    for (var i = 0; i < time.length; i++) {
        var n = time_websites.includes(`${time[i]}`)
        if ( n===true){
            freq_websites2.push(frequency_websites[`${r}`]);
            r=r+1
          


        }
        else {
            freq_websites2.push(0);
        }
        
        //Do something
    }
    console.log(freq_websites2);



    freq_filter_all=[]
    freq_filter_mail=[]
    freq_filter_microblog=[]
    freq_filter_gosocial=[]
    freq_filter_websites=[]
    freq_filter_mediablog=[]


    // p=0
    // for (var i = 0; i < filtered_dates.length; i++) {
    //     var n = time.includes(`${filtered_dates[i]}`)
     
    //     if ( n===true){
    //         freq_filter_all.push(frequency_all5[`${p}`]);
    //         freq_filter_mail.push(freq_mail2[`${p}`]);
    //         freq_filter_microblog.push(freq_microblog2[`${p}`]);
    //         freq_filter_gosocial.push(freq_gosocial2[`${p}`]);
    //         freq_filter_websites.push(freq_websites2[`${p}`]);
    //         p=p+1
          


    //     }
    //     else {
    //         freq_filter_all.push(0);
    //         console.log(0);
    //         freq_filter_mail.push(0);
    //         freq_filter_microblog.push(0);
    //         freq_filter_gosocial.push(0);
    //         freq_filter_websites.push(0);
    //     }
        
    //     //Do something
    // }
    
    time_2=[]
    for (var i = 0; i < filtered_dates.length; i++) {
        filtered_date=filtered_dates[i]

        for (var j=0; j<time.length; j++){
            if (filtered_date===time[j]) {
                freq_filter_all.push(frequency_all[j])
                freq_filter_mail.push(freq_mail2[j])
                freq_filter_microblog.push(freq_microblog2[j])
                freq_filter_gosocial.push(freq_gosocial2[j])
                freq_filter_websites.push(freq_websites2[j])
                freq_filter_mediablog.push(freq_mediablog2[j])
                time_2.push(time[j])
            }

            
                
           
        }
    }

  
    if (freq_filter_all.length===0){
        for (var i = 0; i < filtered_dates.length; i++) {
           freq_filter_all.push(0)
           freq_filter_mail.push(0)
           freq_filter_microblog.push(0)
           freq_filter_websites.push(0)
           freq_filter_gosocial.push(0)
           freq_filter_mediablog.push(0)
           time_2.push(filtered_dates[i])
        }
    }


    console.log(freq_filter_all);
    console.log(time_2);

    updateLine(time_2, freq_filter_all, freq_filter_microblog, freq_filter_mail,freq_filter_websites, freq_filter_gosocial,freq_filter_mediablog);


    //map undefined values to 0

    //   console.log(freq_filter_all);

    //   freq_filter_gosocial = freq_filter_gosocial.map(v => v === undefined ? 0 : v);
    //   freq_filter_websites= freq_filter_websites.map(v => v === undefined ? 0 : v);
    //   freq_filter_mail= freq_filter_mail.map(v => v === undefined ? 0 : v);
    //   freq_filter_microblog= freq_filter_microblog.map(v => v === undefined ? 0 : v);
    //   freq_filter_all= freq_filter_all.map(v => v === undefined ? 0 : v);

    








   //cleaning any undefined values 








    //    updateLine(filtered_dates, freq_filter_all, freq_filter_microblog, freq_filter_mail, freq_filter_websites, freq_filter_gosocial);
   

    // try pushing into the social media for each channel 
    




}

function updateLine(time_2, freq_filter_all, freq_filter_microblog, freq_filter_mail,freq_filter_websites, freq_filter_gosocial,freq_filter_mediablog) {
  
    var trace1 = {
        x: time_2,
        y: freq_filter_all,
        type: 'scatter',
        name: 'All channels',
        line: {
            color: 'rgba(0, 230, 64, 1)',
            width: 2
        }
    };
      
    var trace2 = {
        x: time_2,
        y: freq_filter_microblog,
        type: 'scatter',
        name: 'Microblog',
        line: {
            color: 'rgba(30, 139, 195, 1)',
            width: 2
        }
    };

    var trace3 = {
        x: time_2,
        y: freq_filter_mail,
        type: 'scatter',
        name: 'Mail',
        line: {
            color: 'rgba(102, 51, 153, 1)',
            width: 2
        }
    };

    var trace4 = {
        x: time_2,
        y: freq_filter_websites,
        type: 'scatter',
        name: 'Websites',
        line: {
            color: 'rgba(249, 191, 59, 1)',
            width: 2
        }
    };

    var trace5 = {
        x: time_2,
        y: freq_filter_gosocial,
        type: 'scatter',
        name: 'goSocial',
        line: {
            color: 'rgba(222,45,38,0.8)',
            width: 2
        }
    };

    var trace6 = {
        x: time_2,
        y: freq_filter_mediablog,
        type: 'scatter',
        name: 'mediablog',
        line: {
            color: 'rgba(235, 149, 50, 1)',
            width: 2
        }
    };

    var layout = {
        title: 'Time Series Graph',
        xaxis: {
          title: 'Time',
          showgrid: false,
          zeroline: false
        },
        yaxis: {
          title: 'Frequency',
          showline: false
        }
    };

    var data = [trace1, trace2, trace3, trace4, trace5, trace6];

    Plotly.newPlot('line', data, layout);
}

function editBar (people, filtered_dates) {

    names=[]
    frequency=[]

    for (const [key, value] of Object.entries(people)) {
        names.push(key);
    
    }

   
    dict4=[];
    dict5=[];
    
    
    for (var i = 0; i < names.length; i++) {
        var name_1=names[i]
        var time_1=[];
        var frequency_1=[];
        

        for (const [key, value] of Object.entries(people[name_1])) {
            time_1.push(key);
            frequency_1.push(value);

            

          
        } 

       dict4[name_1]={"Time":time_1, "Frequency":frequency_1};

    } 

    console.log(dict4);


    //iterating through the dictionary 

    dict5=[];

    for (const [key] of Object.entries(dict4)) {
        name=key 
        var time4= (dict4[name]["Time"]);
        var frequency2=(dict4[name]["Frequency"]);


       
       freq_all=[]
       for (var i = 0; i < filtered_dates.length; i++) {
           date1=filtered_dates[i];
           for (var j = 0; j < time4.length; j++) { 
                if (date1===time4[j]){
                    freq_all.push(frequency2[j]);
                }

            } 
        
           
           //Do something
        }

       

       

        dict5[name]=freq_all

      
    } 

    console.log(dict5);





    freq_sum=[]
    

    for (const [key] of Object.entries(dict5)) {
        name3=key
        freq_all_2=dict5[name3]
        
        s=0
        for (var i = 0; i < freq_all_2.length; i++) { 
            number=(freq_all_2[i]);
            s=s+number
        }

        freq_sum.push(s)
       
    }

    updateBar1(freq_sum, names);
  


        


   
    
   
    
       
   
    
    
      
            
    

}


function editBar2 (people, filtered_dates) {
    names=[]
    frequency=[]

    for (const [key, value] of Object.entries(people)) {
        names.push(key);
    
    }

   
    dict4=[];
    dict5=[];
    
    
    for (var i = 0; i < names.length; i++) {
        var name_1=names[i]
        var time_1=[];
        var frequency_1=[];
        

        for (const [key, value] of Object.entries(people[name_1])) {
            time_1.push(key);
            frequency_1.push(value);

            

          
        } 

       dict4[name_1]={"Time":time_1, "Frequency":frequency_1};

    } 

    console.log(dict4);


    //iterating through the dictionary 

    dict5=[];

    for (const [key] of Object.entries(dict4)) {
        name=key 
        var time4= (dict4[name]["Time"]);
        var frequency2=(dict4[name]["Frequency"]);


       
       freq_all=[]
       for (var i = 0; i < filtered_dates.length; i++) {
           date1=filtered_dates[i];
           for (var j = 0; j < time4.length; j++) { 
                if (date1===time4[j]){
                    freq_all.push(frequency2[j]);
                }

            } 
        
           
           //Do something
        }

       

       

        dict5[name]=freq_all

      
    } 

    console.log(dict5);





    freq_sum=[]
    

    for (const [key] of Object.entries(dict5)) {
        name3=key
        freq_all_2=dict5[name3]
        
        s=0
        for (var i = 0; i < freq_all_2.length; i++) { 
            number=(freq_all_2[i]);
            s=s+number
        }

        freq_sum.push(s)
       
    }

    updateBar2(freq_sum, names);
  

}

d3.select("#myInput2").on("click", EditAutocomplete);

function EditAutocomplete (){

    var data=All_data;

    var start1= d3.select("#myInput").node().value;

    var time_list1=data[3].time_list;

    if (start1!=="") {
        for (var i = 0; i < time_list1.length; i++) {
            if (time_list1[i]===start1){
                var start_index=i;
            }
                
            //Do something
        }
        
            
        //Do something
    }
    else {
        start_index=0
    }

    var length_list=time_list1.length
    
    var new_time= time_list1.slice(`${start_index}`, `${length_list}`);

    autocomplete(document.getElementById("myInput2"), new_time);


        
        
    //console.log(time_data);




   
   
}
