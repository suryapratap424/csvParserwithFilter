!(async function () {
  var x = await fetch("./sampledata.csv")
    .then((response) => response.text())
    .then((x) => {
      let rows = x.split("\n");
      head = rows[0];
      let h = head.split('"');
      let alldata = [];
      function getfields(str) {
        let re = new Array();
        let val = str.split("'");
        for (let j = 0; j < val.length; j++) {
          if (j % 2 != 0) {
            re.push(val[j].trim());
          }
        }
        return re;
      }
      function makesimpleobj(keys, values) {
        if (values.length == 1) {
          return { [keys]: values[0] };
        } else if (values.length == 2) {
          let key = keys.split(",");
          return { [key[0].trim()]: values[0], [key[1].trim()]: values[1] };
        } else if (values.length == 4) {
          let key = keys.split("  ");
          return {
            [key[0].trim()]: values[0],
            [key[1].trim()]: values[1],
            [key[2].trim()]: values[2],
            [key[3].trim()]: values[3],
          };
        }
      }
      function makeobject(arr) {
        var ind = 0;
        let myobj = new Object();
        for (let i = 0; i < h.length; i++) {
          if (i % 2 == 0) {
            if (h[i] != ",") {
              let a = h[i].split(",");
              a.forEach((el) => {
                if (el != "") {
                  myobj[el] = arr[ind++].trim();
                }
              });
            }
          } else {
            let f = getfields(h[i]);
            if (f[2] == undefined) {
              if (myobj[f[0]] == undefined) {
                myobj[f[0]] = { [f[1]]: arr[ind++].trim() };
              } else {
                myobj[f[0]][f[1]] = arr[ind++].trim();
              }
            } else {
              if (myobj[f[0]] == undefined) {
                myobj[f[0]] = {
                  [f[1]]: makesimpleobj(f[2], arr[ind++].trim().split(" ")),
                };
              } else {
                if (myobj[f[0]][f[1]] == undefined) {
                  myobj[f[0]][f[1]] = makesimpleobj(
                    f[2],
                    arr[ind++].trim().split(" ")
                  );
                } else {
                  myobj[f[0]][f[1]][f[2]] = arr[ind++].trim();
                }
              }
            }
          }
        }
        return myobj;
      }
      data = rows.slice(1);
      data.forEach((row) => {
        let sahiarr = new Array();
        temp = row.split('"');
        for (let index = 0; index < temp.length; index++) {
          if (index % 2 != 0) {
            sahiarr.push(temp[index]);
          } else {
            let a = temp[index].split(",");
            for (let i = 0; i < a.length; i++) {
              if (a[0] == "") {
                a.shift();
              }
              if (a[a.length - 1] == "") {
                a.pop();
              }
              sahiarr.push(a[i]);
            }
          }
        }
        alldata.push(makeobject(sahiarr));
      });
      return alldata;
    })
    .catch((e) => {
      console.log(e);
    });
    x.forEach(e=>console.log(e))
  // console.log(x);

  //------------------------------------------- next ------------------------------------------
  const myMap = L.map("map").setView([28.5915128, 77.2192949], 20);
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const tileLayer = L.tileLayer(tileUrl, {
    attribution,
    minZoom: 5,
    // maxZoom: 20,
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

  var o = localStorage["clickedSchool"];
  localStorage.removeItem("clickedSchool");
  function generateList(list) {
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
      data.style.display = "inline";
      data.innerHTML = school.Cluster;
      icon.classList.add("fas");
      icon.classList.add("fa-map-marker-alt");
      locations.appendChild(icon);
      locations.appendChild(data);
      const p2 = document.createElement("p");
      if (o != undefined) {
        var v = JSON.parse(o);
        let runned = 1;
        if (runned) {
          fly(v);
          runned--;
        }
        if (v.name == school["School Name"]) {
          listItem.setAttribute("id", "active");
        }
        o = undefined;
      }
      listItem.addEventListener("click", () => {
        fly(school);
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
    }
    booked.forEach((school) => appendList(school, true));
    nbooked.forEach((school) => appendList(school, false));
  }

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

  // handling layers on map
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
  //checking schools on based of filters

  function check(school) {
    function checklocation() {
      let value = optList.options[optList.selectedIndex].value;
      if (value == "none") {
        return true;
      } else {
        return school.Cluster == value;
      }
    }
    function checkCSWN(){
      if(document.getElementById('CSWN').checked){
        if(school['Is Special School for CWSN?']=='1-Yes'){
          return true
        } else{
          return false
        }
      }
      return true
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
      checkType() && checkCSWN()&&
      school["Year of Establishment"] <= slider.value &&
      checklocation() &&
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
  var filtered = x;
  showDataOnMap(filtered);
  generateList(filtered);

  var slider = document.getElementById("yearRange");
  let arrrr = x.map((e) => e["Year of Establishment"]);
  slider.min = arrrr.reduce((a, b) => (a < b ? a : b));
  slider.max = arrrr.reduce((a, b) => (a > b ? a : b));
  slider.value = slider.max;
  document.getElementById("rangevalue").innerHTML =
    slider.min + " - " + slider.max;
  function setSliderBackground() {
    let prcnt = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
    slider.style.background = `linear-gradient(90deg,rgb(0, 23, 156) ${prcnt}%,rgb(255, 233, 250) ${prcnt}%)`;
  }

  setSliderBackground();

  //filtering by establishment year

  slider.oninput = function () {
    filtered = x.filter((school) => check(school));
    document.getElementById("rangevalue").innerHTML =
      slider.min + " - " + this.value;
    setSliderBackground();
    showDataOnMap(filtered);
    generateList(filtered);
  };

  // search by name pin udise

  var pin = document.getElementById("name");
  pin.addEventListener("input", () => {
    filtered = x.filter((school) => check(school));
    showDataOnMap(filtered);
    generateList(filtered);
  });
  // search cswn friendly 
  document.getElementById('CSWN').addEventListener('click',()=>{
    filtered = x.filter((school) => check(school));
    showDataOnMap(filtered);
    generateList(filtered);
  })
  //filtering by type

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

  var options = new Set();
  x.forEach((school) => options.add(school.Cluster));
  var optList = document.getElementById("locations");

  options.forEach((option) => optList.add(new Option(option, option)));

  optList.onchange = function () {
    filtered = x.filter((school) => check(school));
    showDataOnMap(filtered);
    generateList(filtered);
  };
})();
