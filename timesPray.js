let countriesSelect =document.getElementById("countries");
let citiesSelect = document.getElementById('cities');
let countriesData = [];
// API 
// loading countries
axios.get("https://countriesnow.space/api/v0.1/countries")
.then(response => {
    countriesData = response.data.data;
    countriesSelect.innerHTML = "";
    for (let country of countriesData) {
        createOption(countriesSelect, country.iso2, country.country);
    }
    loadCities();
})
.catch(() => {
    showError("❌ Impossible de charger les pays");
});

// loading cities of a specific country
function loadCities() {
    let cc = countriesSelect .value;
    let country = countriesData.find(c => c.iso2 === cc);
    if (!country) return;
    citiesSelect.innerHTML = "";
    for (let city of country.cities) {
        createOption(citiesSelect , city, city);
    }
    getTimesPray(citiesSelect.value, country.iso2,country.country);
}
// Get prayer times by country and city
function getTimesPray(c,v,ct){
    let date = new Date();
    let currentDate = `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${date.getFullYear()}`;
    let p ={
        city:c,
        country:v,
        method:10
    }
    showLoader();
    axios.get('https://api.aladhan.com/v1/timingsByCity/'+currentDate,{params:p})
    .then(reponse=>{
        hideLoader();
        let t =reponse.data.data.timings;
        let d=reponse.data.data.date.readable+" "+reponse.data.data.date.hijri.weekday.ar;
        changed("place", ct+" / "+c);
        changed("times",d);
        changed("Fajr",t.Fajr);
        changed("Sunrise",t.Sunrise);
        changed("Dhuhr",t.Dhuhr);
        changed("Asr",t.Asr);
        changed("Maghrib",t.Maghrib);
        changed("Isha",t.Isha);
    })
    .catch(() => {
        hideLoader();
        showError("❌ Impossible de charger les horaires de prière");
    });

}
//events
countriesSelect.addEventListener("change", loadCities);
citiesSelect.addEventListener("change", () => {
    let countryName=countriesSelect.options[countriesSelect.selectedIndex].text;
    getTimesPray(citiesSelect.value, countriesSelect.value,countryName);
});
// UI
// Updates the text of an element by its ID
function changed(id,value){
    document.getElementById(id).innerText=value;
}
//creating a new option in the choice list
function createOption(k,value,st){
    let o=document.createElement("option");
    o.setAttribute('value',value);
    o.innerText=st;
    k.append(o);
}
// error message
function showError(message) {
    document.getElementById("place").innerText = message;
}
// loader
function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
    document.querySelector(".cardsPray").style.display = "none";
}

function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
    document.querySelector(".cardsPray").style.display = "flex";
}
//digital clock
function update_time(){
    const date=new Date();
    const hour= date.getHours().toString().padStart(2,0);
    const minutes=date.getMinutes().toString().padStart(2,0);
    const seconds=date.getSeconds().toString().padStart(2,0);
    const string_time=`${hour}:${minutes}:${seconds}`;
    console.log(string_time);
    document.querySelector(".clock").textContent=string_time;
}
setInterval(update_time,1000);
// Determine the current prayer time
