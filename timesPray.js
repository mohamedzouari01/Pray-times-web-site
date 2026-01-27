let ct=document.getElementById("countries");
let s= document.getElementById('cities');
let countriesData = [];
axios.get("https://countriesnow.space/api/v0.1/countries")
.then(response => {
    countriesData = response.data.data;
    ct.innerHTML = "";
    for (let country of countriesData) {
        createOption(ct, country.iso2, country.country);
    }
    loadCities();
})
.catch(err => console.log(err));
function loadCities() {
    let cc = ct.value;
    let country = countriesData.find(c => c.iso2 === cc);
    if (!country) return;
    s.innerHTML = "";
    for (let city of country.cities) {
        createOption(s, city, city);
    }
    getTimesPray(s.value, country.iso2,country.country);
}
ct.addEventListener("change", loadCities);
s.addEventListener("change", () => {
    let countryName=ct.options[ct.selectedIndex].text;
    getTimesPray(s.value, ct.value,countryName);
});
function getTimesPray(c,v,ct){
    let date = new Date();
    let currentDate = `${String(date.getDate()).padStart(2,'0')}-${String(date.getMonth()+1).padStart(2,'0')}-${date.getFullYear()}`;
    let p ={
        city:c,
        country:v,
        method:10
    }
    axios.get('https://api.aladhan.com/v1/timingsByCity/'+currentDate,{params:p})
    .then(reponse=>{
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
    .catch((error)=>console.log(error));
}
function changed(id,value){
    document.getElementById(id).innerText=value;
}
function createOption(k,value,st){
    let o=document.createElement("option");
    o.setAttribute('value',value);
    o.innerText=st;
    k.append(o);
}