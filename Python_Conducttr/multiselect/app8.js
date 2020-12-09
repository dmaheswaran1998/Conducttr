const myData = [
    {
      label: "CSS",
      value: "css"
    },
    {
      label: "HTML",
      value: "html"
    },
    {
      label: "JavaScript",
      value: "js"
    }
]

var mySelect = new MultiSelect2("#myInput3", {
    options: myData
});



var mySelect = new MultiSelect2(".element", {

    // enable/disable autocomplete
    autocomplete: true, 

    // enable/disable multiple selection
    multiple: true,

    // custom icons for multiple selection
    icon: "fa fa-times", 

    // callback
    onChange: value => {
      console.log(value);
    }
    
});

