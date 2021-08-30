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
    x.forEach(e=>console.log(e['Affiliation Board-Sec']))
  console.log(x);
  //------------------------------------------------next -------------------------------
  function generateList(list) {
    const ul = document.querySelector("#list");
    ul.innerHTML = ""; //reset
    let booked = list.filter((e) => e.booked);
    let nbooked = list.filter((e) => !e.booked);
    function appendList(school, booked) {
      const listItem = document.createElement("li");
      listItem.classList.add("list-item");
      if (booked) {
        const i = document.createElement("i");
        i.classList.add("fas");
        i.classList.add("fa-bookmark");
        listItem.appendChild(i);
        listItem.classList.add("bookmarked");
      }
      const up = document.createElement("div");
      up.classList.add("up");

      const year = document.createElement("h4");
      year.innerHTML = school["Year of Establishment"];

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

      const down = document.createElement("div");
      down.classList.add("down");

      const list1 = document.createElement("ul");
      const list2 = document.createElement("ul");
      const list3 = document.createElement("ul");

      const classes = document.createElement("li");
      const c = document.createElement("li");
      c.innerHTML = "Classrooms";
      list1.appendChild(c);
      classes.innerHTML = school["Total Class Rooms"];
      list1.appendChild(classes);

      const teachers = document.createElement("li");
      const t = document.createElement("li");
      t.innerHTML = "Teachers";
      list2.appendChild(t);
      teachers.innerHTML = school.Teachers.Total;
      list2.appendChild(teachers);

      const type = document.createElement("li");
      const ty = document.createElement("li");
      ty.innerHTML = "Type";
      list3.appendChild(ty);
      type.innerHTML = school["School Type"].substr(2);
      list3.appendChild(type);

      const extra = document.createElement("fieldset");
      extra.classList.add("extra");
//----------------------------------------------------------------
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
      toilets.appendChild(boy);
      toilets.appendChild(girl);
      toilets.appendChild(CSWN);
      extra.appendChild(toilets);
//------------------------------------------------------------------
      let desktop = document.createElement("p");
      let dhead = document.createElement("div");
      dhead.innerHTML='Desktops'
      let dd = document.createElement("b");
      let di = document.createElement("i");
      dd.innerText = school.Desktop;
      let span = document.createElement("span");
      di.classList.add("fas");
      di.classList.add("fa-laptop");
      desktop.appendChild(dhead);
      span.appendChild(di);
      span.appendChild(dd);
      desktop.appendChild(span);
      extra.appendChild(desktop)
//---------------------------------------------------------------
      desktop = document.createElement("p");
      dhead = document.createElement("div");
      dhead.innerHTML='DigiBoard'
      dd = document.createElement("b");
      di = document.createElement("i");
      dd.innerText = school.DigiBoard;
      span = document.createElement("span");
      di.classList.add("fas");
      di.classList.add("fa-digital-tachograph");
      desktop.appendChild(dhead);
      span.appendChild(di);
      span.appendChild(dd);
      desktop.appendChild(span);
      extra.appendChild(desktop)
//---------------------------------------------------------------
      const drinkingwater = document.createElement("p");
      if (school["Drinking Water Available"] == "1-Yes") {
        let i = document.createElement("i");
        let span = document.createElement("span");
        i.classList.add("fas");
        i.classList.add("fa-faucet");
        i.style.color = "blue"
        span.innerText = "Drinking Water";
        drinkingwater.appendChild(i);
        drinkingwater.appendChild(span);
        extra.appendChild(drinkingwater);
      }
      const playground = document.createElement("p");
      if (school["Playground Available"] == "1-Yes") {
        let i = document.createElement("i");
        let span = document.createElement("span");
        i.classList.add("fas");
        i.classList.add("fa-child");
        i.style.color = "green"
        span.innerText = "Playground";
        playground.appendChild(i);
        playground.appendChild(span);
        extra.appendChild(playground);
      }
      const solarpanel = document.createElement("p");
      if (school["Solar Panel"] == "1-Yes") {
        let i = document.createElement("i");
        let span = document.createElement("span");
        i.classList.add("fas");
        i.classList.add("fa-solar-panel");
        i.style.color = "orange"
        span.innerText = "Solar Panel";
        solarpanel.appendChild(i);
        solarpanel.appendChild(span);
        extra.appendChild(solarpanel);
      }
      const library = document.createElement("p");
      if (school["Library Availability"] == "1-Yes") {
        let i = document.createElement("i");
        let span = document.createElement("span");
        i.classList.add("fas");
        i.classList.add("fa-book-reader");
        i.style.color = "brown"
        span.innerText = "library";
        library.appendChild(i);
        library.appendChild(span);
        extra.appendChild(library);
      }
      const handwash = document.createElement("p");
      if (school["Handwash Facility for Meal"] == "1-Yes") {
        let i = document.createElement("i");
        let span = document.createElement("span");
        i.classList.add("fas");
        i.classList.add("fa-hand-holding-water");
        i.style.color="indigo"
        span.innerText = "handwash";
        handwash.appendChild(i);
        handwash.appendChild(span);
        extra.appendChild(handwash);
      }
      const Electricity = document.createElement("p");
      if (school["Electricity Availability"] == "1-Yes") {
        let i = document.createElement("i");
        let span = document.createElement("span");
        i.classList.add("fas");
        i.classList.add("fa-charging-station");
        i.style.color = "red"
        span.innerText = "Electricity";
        Electricity.appendChild(i);
        Electricity.appendChild(span);
        extra.appendChild(Electricity);
      }
      const DTH = document.createElement("p");
      if (school["DTH"] == "1-Yes") {
        let i = document.createElement("i");
        let span = document.createElement("span");
        i.classList.add("fas");
        i.classList.add("fa-tv");
        // i.style.color = "silver"
        span.innerText = "DTH";
        DTH.appendChild(i);
        DTH.appendChild(span);
        extra.appendChild(DTH);
      }

      up.appendChild(year);
      up.appendChild(name);
      up.appendChild(udise);
      up.appendChild(locations);
      down.appendChild(list3);
      down.appendChild(list2);
      down.appendChild(list1);
      listItem.appendChild(up);
      listItem.appendChild(down);
      const l = document.createElement("legend");
      l.innerText = "Facilities Available";
      extra.appendChild(l);
      listItem.appendChild(extra);
      ul.appendChild(listItem);

      listItem.addEventListener("click", () => {
        localStorage.setItem("clickedSchool", JSON.stringify(school));
        location.href = "index.html";
      });
    }
    booked.forEach((school) => appendList(school, true));
    nbooked.forEach((school) => appendList(school, false));
  }

  function check(school) {
    function checklocation() {
      let value = optList.options[optList.selectedIndex].value;
      if (value == "none") {
        return true;
      } else {
        return school.Cluster == value;
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
      if (pin.value == "") {
        return true;
      }
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
      if (pin.value == "") {
        return true;
      }
      let c = school.Pincode.search(pin.value);
      if (c == -1) {
        return false;
      } else {
        return true;
      }
    }
    function checkudise() {
      if (pin.value == "") {
        return true;
      }
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
    generateList(filtered);
  };

  //filtering by name/pin/udice
  var pin = document.getElementById("name");
  pin.addEventListener("input", () => {
    filtered = x.filter((school) => check(school));
    generateList(filtered);
  });
  // search cswn friendly 
  document.getElementById('CSWN').addEventListener('click',()=>{
    filtered = x.filter((school) => check(school));
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
    generateList(filtered);
  });

  var options = new Set();
  x.forEach((school) => options.add(school.Cluster));
  var optList = document.getElementById("locations");

  options.forEach((option) => optList.add(new Option(option, option)));

  optList.onchange = function () {
    filtered = x.filter((school) => check(school));
    generateList(filtered);
  };
})();
