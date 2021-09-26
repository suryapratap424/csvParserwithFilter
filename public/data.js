var form = document.getElementById("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  var data = await fetch("https://csvparserwithfilter.herokuapp.com/template") //getting default object to be sent
    .then((response) => response.json())
    .catch((e) => console.log(e));
  document.getElementById("submit").disabled = true;
  const jsonformdata = {};
  for (const pair of new FormData(form)) {
    jsonformdata[pair[0]] = pair[1] == "on" ? "1-Yes" : pair[1];
  }
  console.log(jsonformdata);

  //--------------------------set data here-----------------------------
  data["UDISE Code"] = jsonformdata.udise;
  data["School Name"] = jsonformdata.Name;
  data["Year of Establishment"] = jsonformdata.year_of_establishment;
  data.Cluster = jsonformdata.Cluster;
  data.Pincode = jsonformdata.pincode
  data["Total Class Rooms"] = jsonformdata.classroom_count;
  data.Teachers.Total = jsonformdata.number_of_teachers;
  data["School Type"] = jsonformdata.type??"N/A";
  data["Building Status"] = jsonformdata.buildingStatus??'N/A'
  data.lat = jsonformdata.lat;
  data.lng = jsonformdata.lng;
  data.Toilets.Total.Boys = jsonformdata["Toilets.Boys"];
  data.Toilets.Total.Girls = jsonformdata["Toilets.Girls"];
  data.Toilets["Func. CWSN Friendly"].Boys = jsonformdata.CSWNboys;
  data.Toilets["Func. CWSN Friendly"].Girls = jsonformdata.CSWNgirls;
  data.Desktop = jsonformdata.desktop;
  data.DigiBoard = jsonformdata.digiboard;
  data["Furniture Availability"] = jsonformdata.furniture;
  //----------------undefined nhi hone dena h------------------
  data["ICT Lab"] = jsonformdata.ICTlab??"N/A";
  data["Internet"] = jsonformdata.internet??"N/A";
  data["Drinking Water Available"] = jsonformdata.water??"N/A";
  data["Playground Available"] = jsonformdata.playground??"N/A";
  data["Solar Panel"] = jsonformdata.solar??"N/A";
  data["Library Availability"] = jsonformdata.library??"N/A";
  data["Handwash Facility for Meal"] = jsonformdata.handwash??"N/A";
  data["Electricity Availability"] = jsonformdata.electricity??"N/A";
  data["DTH"] = jsonformdata.dth??"N/A";
  data["Availability of Handrails"] = jsonformdata.handrail??"N/A";
  data["Availability of Ramps"] = jsonformdata.ramp??"N/A";
  //--------------------------set data here-----------------------------
  // console.log(data);
  //---------------------------sending data------------------------------
  fetch('https://csvparserwithfilter.herokuapp.com/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.text())
  .then(data=>{
    if(data=="sucsess"){
      alert('data posted sucessfully')
      location.href='/'
    }else{
      alert(data)
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});
