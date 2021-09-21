function setEmpty(input) {
  let keys = Object.keys(input);

  for (let key of keys) {
    if (typeof input[key] != "object") {
      input[key] = " ";
    } else {
      setEmpty(input[key]);
    }
  }
  return input;
}

document.getElementById('submit').addEventListener('click',async ()=>{
  console.log('ha')

  var x = await fetch("data")
  .then((response) => response.json())
  .catch((e) => console.log(e));

  let data = setEmpty(x[0]);  //getting default object to be sent 
  //--------------------------set data here-----------------------------
  data.Sr = x.length;
  data['UDISE Code']='07  09  34  12983'
  data.lat=28.8734713
  data.lng = 78.08138681
  data.Toilets.Total.Boys = 10
  data.Toilets.Total.Girls = 10
  //---------------------------sending data------------------------------
  // fetch('/data', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  // })
  // .then(response => console.log(response))
  // .catch((error) => {
  //   console.error('Error:', error);
  // });
})
