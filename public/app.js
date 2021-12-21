(async function () {
  const ul = document.querySelector("#list");
  ul.innerHTML = "<h2>Loading...</h2>";
  var x = await fetch("data")
  // var x = await fetch("https://csvparserwithfilter.herokuapp.com/data")
    .then((response) => response.json())
    .catch((e) => {
      ul.innerHTML = `Something Went Wrong<button style="cursor:pointer" onClick="window.location.reload();">Refresh Page</button>`;
    });

  var rv = await fetch("review")
  // var rv = await fetch("https://csvparserwithfilter.herokuapp.com/review")
    .then((response) => response.json())
    .catch((e) => {
      ul.innerHTML = `Something Went Wrong<button style="cursor:pointer" onClick="window.location.reload();">Refresh Page</button>`;
    });

  const myMap = L.map("map").setView([28.5915128, 77.2192949], 20);
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const tileLayer = L.tileLayer(tileUrl, {
    attribution,
    minZoom: 5,
    noWrap: true,
  });
  tileLayer.addTo(myMap);

  var southWest = L.latLng(-89.98155760646617, -180),
    northEast = L.latLng(89.99346179538875, 180);
  var bounds = L.latLngBounds(southWest, northEast);

  myMap.setMaxBounds(bounds);

  function genPop(school) {
    return `
      <div class="popup">
      <h3>Establish Year : ${school["Year of Establishment"]}</h3>
      <h1>${school["School Name"]}</h1>
      <div>
      <p>Pin Code  <span>${school.Pincode}</span></p>
      <p>UDISE Code  <span>${school["UDISE Code"]}</span></p>
      </div>
      <p class="location">Location : ${school.Cluster}</p>
      <div>
      <p>Classrooms  <span>${school["Total Class Rooms"]}</span> </p>
      <p>Staff  <span>${school.Teachers.Total}</span></p>
      <p>Type  <span>${school["School Type"].substr(2)}</span></p>`;
  }

  function getOffset(school) {
    let a = 0,
      b = 10;
    if (school.lat > 75) b = 310;
    if (school.lng < -150) a = 120;
    if (school.lng > 150) a = -120;
    return [a, b];
  }

  // var o = localStorage["clickedSchool"];
  // localStorage.removeItem("clickedSchool");
  function getAverageStars(school){
    re = rv.filter((s) => s["name"] == school["School Name"]);
    nu = re.map((r) => r.stars);
    nnn = nu.reduce(function (avg, value, _, { length }) {
      return avg + value / length;
    }, 0);
    return nnn.toFixed(1)
  }
  function generateList(list) {
    document.getElementById("school-count").innerHTML = list.length;
    const ul = document.querySelector("#list");
    ul.innerHTML = ""; //reset
    let booked = list.filter((e) => e.booked);
    let nbooked = list.filter((e) => !e.booked);
    function appendList(school, booked) {
      const li = document.createElement("li");
      const listItem = document.createElement("div");
      const div1 = document.createElement("div");
      const div2 = document.createElement("div");
      const span1 = document.createElement("span");
      const span2 = document.createElement("span");
      const h3 = document.createElement("h3");
      const locations = document.createElement("p");
      const icon = document.createElement("i");
      const data = document.createElement("span");
      const star = document.createElement("span");
      star.classList.add("star")
      star.innerHTML = getAverageStars(school) + '★'
      data.style.display = "inline";
      data.innerHTML = school.Cluster;
      icon.classList.add("fas");
      icon.classList.add("fa-map-marker-alt");
      locations.appendChild(icon);
      locations.appendChild(data);
      const p2 = document.createElement("p");
      // if (o != undefined) {
      //   var v = JSON.parse(o);
      //   let runned = 1;
      //   if (runned) {
      //     fly(v);
      //     runned--;
      //   }
      //   if (v.name == school["School Name"]) {
      //     listItem.setAttribute("id", "active");
      //   }
      //   o = undefined;
      // }
      listItem.addEventListener("click", () => {
        fly(school);
        document.getElementById("done").click(); //calling click by default when user clicks on school wothot clicking done
        let x = document.getElementById("active");
        if (x != null) {
          x.id = "";
        }
        listItem.setAttribute("id", "active");
      });
      listItem.classList.add("list-item");
      h3.innerText = school["School Name"];
      p2.innerText = "School Type : " + school["School Type"].substr(2);
      span1.innerHTML = "Classrooms : " + school["Total Class Rooms"];
      span2.innerHTML = "Teachers : " + school.Teachers.Total;
      div2.appendChild(span1);
      div2.appendChild(span2);
      div1.appendChild(h3);
      div1.appendChild(locations);
      div1.appendChild(p2);
      listItem.appendChild(star);
      listItem.appendChild(div1);
      listItem.appendChild(div2);
      if (booked) {
        const i = document.createElement("i");
        i.classList.add("fas");
        i.classList.add("fa-bookmark");
        listItem.appendChild(i);
        listItem.classList.add("bookmarked");
      }
      li.appendChild(listItem);
      ul.appendChild(li);
      listItem.addEventListener("click", () => {
        generatepop(school);
      });
    }
    booked.forEach((school) => appendList(school, true));
    nbooked.forEach((school) => appendList(school, false));
  }
  //------------------------------------onclick popup generated--------------------------------------------
  function generatepop(school) {
    let box = document.getElementById("details");
    let maindiv = document.getElementById("schooldetails");
    maindiv.classList.add("list-item");
    maindiv.innerHTML = "";
    box.style.display = "block";
    //--------------------------------------------------up------------------------------------------------
    const up = document.createElement("div");
    up.classList.add("up");

    const year = document.createElement("h4");
    year.innerHTML = school["Year of Establishment"];

    const stars = document.createElement("h4");
    stars.innerHTML = getAverageStars(school) + '★';
    stars.classList.add("star")
    const name = document.createElement("h2");
    name.innerHTML = school["School Name"];
    const udise = document.createElement("h4");
    udise.innerHTML = "UDISE Code - " + school["UDISE Code"];

    const locations = document.createElement("p");
    const icon = document.createElement("i");
    const data = document.createElement("span");
    data.innerHTML = school.Cluster;
    icon.classList.add("fas");
    icon.classList.add("fa-map-marker-alt");
    locations.appendChild(icon);
    locations.appendChild(data);
    //---------------------------------------down---------------------------------------------
    const down = document.createElement("div");
    down.classList.add("down");

    function createdownblock(text, data) {
      const list = document.createElement("ul");
      const value = document.createElement("li");
      const v = document.createElement("li");
      v.innerHTML = text;
      list.appendChild(v);
      value.innerHTML = data;
      list.appendChild(value);
      down.appendChild(list);
    }
    createdownblock("Classrooms", school["Total Class Rooms"]);
    createdownblock("Teachers", school.Teachers.Total);
    createdownblock("Type", school["School Type"].substr(2));
    createdownblock("Building Status", school["Building Status"].substr(2));

    //---------------------------------------extra--------------------------------------------

    const extra = document.createElement("fieldset");
    extra.classList.add("extra");

    const toilets = document.createElement("p");
    const thead = document.createElement("div");
    thead.innerText = "Toilets";

    const boy = document.createElement("span");
    const bd = document.createElement("b");
    const bi = document.createElement("i");
    bd.innerText = school.Toilets.Total.Boys;
    bi.classList.add("fas");
    bi.classList.add("fa-male");
    boy.appendChild(bi);
    boy.appendChild(bd);

    const girl = document.createElement("span");
    const gd = document.createElement("b");
    const gi = document.createElement("i");
    gd.innerText = school.Toilets.Total.Girls;
    gi.classList.add("fas");
    gi.classList.add("fa-female");
    girl.appendChild(gi);
    girl.appendChild(gd);

    const CSWN = document.createElement("span");
    const cd = document.createElement("b");
    const ci = document.createElement("i");
    cd.innerText =
      parseInt(school.Toilets["Func. CWSN Friendly"].Boys) +
      parseInt(school.Toilets["Func. CWSN Friendly"].Girls);
    ci.classList.add("fas");
    ci.classList.add("fa-wheelchair");
    CSWN.appendChild(ci);
    CSWN.appendChild(cd);
    toilets.appendChild(thead);
    let ek = document.createElement("span");
    ek.appendChild(boy);
    ek.appendChild(girl);
    ek.appendChild(CSWN);
    toilets.appendChild(ek);
    extra.appendChild(toilets);
    //------------------------------------------------------------------
    function createblockwithvalue(text, icon, value) {
      let block = document.createElement("p");
      let dhead = document.createElement("div");
      dhead.innerHTML = text;
      let dd = document.createElement("b");
      let di = document.createElement("i");
      dd.innerText = value;
      let span = document.createElement("span");
      di.classList.add("fas");
      di.classList.add("fa-" + icon);
      block.appendChild(dhead);
      span.appendChild(di);
      span.appendChild(dd);
      block.appendChild(span);
      extra.appendChild(block);
    }
    createblockwithvalue("Desktops", "laptop", school.Desktop);
    createblockwithvalue("DigiBoard", "digital-tachograph", school.DigiBoard);
    createblockwithvalue(
      "Furnitures",
      "chair",
      school["Furniture Availability"]
    );

    //---------------------------------------------------------------
    function createblock(text, icon, color) {
      const block = document.createElement("p");
      let i = document.createElement("i");
      let span = document.createElement("span");
      i.classList.add("fas");
      i.classList.add("fa-" + icon);
      i.style.color = color;
      span.innerText = text;
      block.appendChild(i);
      block.appendChild(span);
      extra.appendChild(block);
    }
    //condition && function ==> if condition==true => function runs

    school["ICT Lab"] == "1-Yes" && createblock("ICT Lab", "laptop-code");

    school["Internet"] == "1-Yes" && createblock("Internet", "wifi");

    school["Drinking Water Available"] == "1-Yes" &&
      createblock("Drinking Water", "faucet", "blue");

    school["Playground Available"] == "1-Yes" &&
      createblock("Playground", "child", "green");

    school["Solar Panel"] == "1-Yes" &&
      createblock("Solar Panel", "solar-panel", "orange");

    school["Library Availability"] == "1-Yes" &&
      createblock("Library", "book-reader", "brown");

    school["Handwash Facility for Meal"] == "1-Yes" &&
      createblock("Handwash", "hand-holding-water", "indigo");

    school["Electricity Availability"] == "1-Yes" &&
      createblock("Electricity", "charging-station", "red");

    school["DTH"] == "1-Yes" && createblock("DTH", "tv");

    school["Availability of Handrails"] == "1-Yes" &&
      createblock("Handrails", "bacon");

    const ramp = document.createElement("p");
    if (school["Availability of Ramps"] == "1-Yes") {
      let i = document.createElement("i");
      let span = document.createElement("span");
      i.style.width = "20px";
      i.style.borderBottom = "5px solid black";
      i.style.transform = "rotate(-30deg)";
      span.innerText = "Ramps";
      ramp.appendChild(i);
      ramp.appendChild(span);
      extra.appendChild(ramp);
    }
    const reviews = document.createElement('div');
    const r = document.createElement('div');
    const h = document.createElement('h2');
    const a = document.createElement('a')
    a.href=`./seereview.html`
    a.addEventListener('click',()=>{localStorage.setItem('schoolname',school["School Name"])})
    // a.addEventListener('click',()=>alert(school["School Name"]))
    a.innerHTML='See All Reviews'
    reviews.appendChild(a)
    h.innerHTML='Reviews';
    reviews.appendChild(h);
    reviews.id='reviewbox';
    let sch = rv.filter((s) => s["name"] == school["School Name"]);
    star=(s)=>{
      var fill = '★';
      var empty = '☆';
      let t=''
      for (let i = 1; i <= 5; i++) {
        if(i<=s)
        t+=fill
        else
        t+=empty
      }
      return t
    }
    sch = sch.map((r) => /*r.message==''?'':*/`<div><div>${r.type=='other'?'':r.type} ${r.persontype}</div><span>${star(r.stars)}</span><p>${r.message}</p></div>`);
    r.innerHTML = sch.join('');
    reviews.appendChild(r)
    
    up.appendChild(year);
    up.appendChild(stars);
    up.appendChild(name);
    up.appendChild(udise);
    up.appendChild(locations);

    maindiv.appendChild(up);
    maindiv.appendChild(down);
    const l = document.createElement("legend");
    l.innerText = "Facilities Available";
    extra.appendChild(l);
    maindiv.appendChild(extra);
    console.log(reviews)
    maindiv.appendChild(reviews);
  }
  //---------------------------------------genpop k bahar------------------------------------------------
  function fly(school) {
    const lat = school.lat;
    const lng = school.lng;
    myMap.flyTo([lat, lng], 20, {
      duration: 2,
    });
    setTimeout(() => {
      L.popup({ offset: getOffset(school) })
        .setLatLng([lat, lng])
        .setContent(genPop(school))
        .openOn(myMap);
    }, 2000);
  }
  //---------------------------------making checkboxes----------------------------------------
  var checkboxes = [
    "Pre Primary",
    "ICT Lab",
    "Internet",
    "Drinking Water Available",
    "Playground Available",
    "Solar Panel",
    "Library Availability",
    "Handwash Facility for Meal",
    "Electricity Availability",
    "DTH",
    "Availability of Handrails",
    "Availability of Ramps",
  ];
  checkboxes.forEach((property) => {
    label = document.createElement("label");
    inp = document.createElement("input");
    div = document.createElement("div");
    inp.setAttribute("type", "checkbox");
    inp.setAttribute("id", property.replace(/ /g, "-"));
    label.setAttribute("for", property.replace(/ /g, "-"));
    label.innerHTML = property;
    div.appendChild(inp);
    div.appendChild(label);
    document.getElementById("checkboxes").appendChild(div);
    inp.addEventListener("click", () => {
      filtered = x.filter((school) => check(school));
      showDataOnMap(filtered);
      generateList(filtered);
    });
  });
  //-----------------------------------------handling layers on map---------------------------------------------
  var layer;
  function showDataOnMap(arr) {
    let temp = new Array();
    arr.forEach((school) => {
      temp.push(
        L.marker([school.lat, school.lng]).bindPopup(genPop(school), {
          offset: getOffset(school),
        })
      );
    });
    if (layer != undefined) {
      layer.clearLayers(); //reset
    }
    layer = L.layerGroup(temp).addTo(myMap);
  }
  //--------------------------------------checking schools on based of filters---------------------------------

  function check(school) {
    function checklocation() {
      let value = optList.options[optList.selectedIndex].value;
      if (value == "none") {
        return true;
      } else {
        return school.Cluster == value;
      }
    }
    function checkeducation() {
      let value = edulist.options[edulist.selectedIndex].value;
      if (value == "none") {
        return true;
      } else {
        return school["School Category"] == value;
      }
    }
    function checkCSWN() {
      if (document.getElementById("CSWN").checked) {
        if (school["Is Special School for CWSN?"] == "1-Yes") {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
    function checkProps() {
      let con = true;
      checkboxes.forEach((checkbox) => {
        con = con && checkthis(checkbox);
        function checkthis(checkbox) {
          if (document.getElementById(checkbox.replace(/ /g, "-")).checked) {
            if (school[checkbox] == "1-Yes") {
              return true;
            } else {
              return false;
            }
          }
          return true;
        }
      });
      return con;
    }
    function checkType() {
      if (!govt.checked && !private.checked && !pulic.checked) {
        return true;
      } else {
        return (
          (school["School Type"] == "1-Boys" && govt.checked) ||
          (school["School Type"] == "3-Co-educational" && pulic.checked) ||
          (school["School Type"] == "2-Girls" && private.checked)
        );
      }
    }
    function checkname() {
      let c = school["School Name"]
        .toUpperCase()
        .search(pin.value.toUpperCase());
      if (c == -1) {
        return false;
      } else {
        return true;
      }
    }
    function checkpin() {
      let c = school.Pincode.search(pin.value);
      if (c == -1) {
        return false;
      } else {
        return true;
      }
    }
    function checkudise() {
      let c = school["UDISE Code"].search(pin.value);
      if (c == -1) {
        return false;
      } else {
        return true;
      }
    }
    let condition =
      checkType() &&
      checkCSWN() &&
      school["Year of Establishment"] <= slider.value &&
      checkProps() &&
      checklocation() &&
      checkeducation() &&
      (checkname() || checkpin() || checkudise());

    if (condition) {
      if (govt.checked) {
        document.getElementById("govtLable").classList.add("active");
      }
      if (private.checked) {
        document.getElementById("privateLable").classList.add("active");
      }
      if (pulic.checked) {
        document.getElementById("pulicLable").classList.add("active");
      }
      return true;
    }
  }
  //-----------------------------------------------------------------------------------------
  var filtered = x;
  showDataOnMap(filtered);
  generateList(filtered);
  document.getElementById("reset").addEventListener("click", () => {
    filtered = x;
    showDataOnMap(filtered);
    generateList(filtered);
    let all = document.getElementsByTagName("input");
    Array.from(all).forEach((inp) => {
      inp.checked = false;
    });
    slider.value = slider.max;
    setSliderBackground();
    document.getElementById("govtLable").classList.remove("active");
    document.getElementById("privateLable").classList.remove("active");
    document.getElementById("pulicLable").classList.remove("active");
    pin.value = "";
    optList.value = "none";
    edulist.value = "none";
  });
  var slider = document.getElementById("yearRange");
  let arrrr = x.map((e) => e["Year of Establishment"]);
  slider.min = arrrr.reduce((a, b) => (a < b ? a : b));
  slider.max = arrrr.reduce((a, b) => (a > b ? a : b));
  slider.value = slider.max;
  document.getElementById("rangevalue").innerHTML =
    slider.min + " - " + slider.max;
  function setSliderBackground() {
    let prcnt = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    slider.style.background = `linear-gradient(90deg,var(--back) ${prcnt}%,white ${prcnt}%)`;
  }

  setSliderBackground();

  //--------------------------------filtering by establishment year--------------------------

  slider.oninput = function () {
    filtered = x.filter((school) => check(school));
    document.getElementById("rangevalue").innerHTML =
      slider.min + " - " + this.value;
    setSliderBackground();
    showDataOnMap(filtered);
    generateList(filtered);
  };

  // -------------------------------search by name pin udise--------------------------------------

  var pin = document.getElementById("name");
  pin.addEventListener("input", () => {
    filtered = x.filter((school) => check(school));
    showDataOnMap(filtered);
    generateList(filtered);
  });
  // ---------------------------------search cswn friendly-----------------------------------------
  document.getElementById("CSWN").addEventListener("click", () => {
    filtered = x.filter((school) => check(school));
    showDataOnMap(filtered);
    generateList(filtered);
  });
  //-------------------------------------filtering by type----------------------------------------

  document.getElementById("filter-div").addEventListener("click", () => {
    govt = document.getElementById("govt");
    pulic = document.getElementById("pulic");
    private = document.getElementById("private");
    //resetting
    document.getElementById("govtLable").classList.remove("active");
    document.getElementById("privateLable").classList.remove("active");
    document.getElementById("pulicLable").classList.remove("active");

    filtered = x.filter((school) => check(school));
    showDataOnMap(filtered);
    generateList(filtered);
  });
  //------------------------------------filtering by location---------------------------------------
  var options = new Set();
  x.forEach((school) => options.add(school.Cluster));
  var optList = document.getElementById("locations");
  options.forEach((option) => optList.add(new Option(option, option)));

  optList.onchange = function () {
    filtered = x.filter((school) => check(school));
    showDataOnMap(filtered);
    generateList(filtered);
  };
  //------------------------------------filtering by education---------------------------------------
  var options = new Set();
  x.forEach((school) => options.add(school["School Category"]));
  var edulist = document.getElementById("education");
  options.forEach((option) => edulist.add(new Option(option, option)));

  edulist.onchange = function () {
    filtered = x.filter((school) => check(school));
    showDataOnMap(filtered);
    generateList(filtered);
  };
})();
function newFunction(generateList, filtered) {
  generateList(filtered);
}
