let selectCountry=document.querySelector(".country select");
let selectCity=document.querySelector(".city select");
let btn=document.querySelector(".btn button");
let temp=document.querySelector("#tempRes");
let humidity=document.querySelector("#humidityRes");
let visibility=document.querySelector("#visibilityRes");
let windSpeed=document.querySelector("#windRes");
let img=document.querySelector(".countryImg img");
let currCountryCode="PK";
let loadingElem=document.querySelector(".loader");

let weatherAPI_key="d82f4498864a4545ba9172853243006";

//The API for this is not currently working
const populateCountries=async ()=>{
    let headers = new Headers();
    headers.append("X-CSCAPI-KEY", "API_KEY");

    let requestOptions = {
       method: 'GET',
       headers: headers,
       redirect: 'follow'
    };
    try{
        let response = await fetch("https://api.countrystatecity.in/v1/countries", requestOptions);
        let data=await response.text();
        console.log(data);
    }
    catch(err){
        console.log(err);
    }
}


const populateCountries1=async ()=>{
    const url = 'https://restcountries.com/v3.1/all?';

    let response= await fetch(url)
    let data =await response.json();
    console.log(data);
    for (let country in data){
        let newOption=document.createElement("option");
        countryData=data[country];
        // console.log(countryData.name.common);
        newOption.value=countryData.name.common;
        newOption.innerText=countryData.name.common;
        // console.log(countryData.cca2);
        newOption.setAttribute("data-code", countryData.cca2);
        selectCountry.append(newOption);
    }
}


const updateCities=async ()=>{
    const url = `https://restcountries.com/v3.1/name/${selectCountry.value}`;

    let response= await fetch(url)
    let data =await response.json();
    // console.log(data[0].capital[0]);
    //removes all the existing nodes
    while (selectCity.firstChild){
        selectCity.firstChild.remove();
    }
    let newOption=document.createElement("option");
    newOption.value=data[0].capital[0];
    newOption.innerText=data[0].capital[0];
    selectCity.append(newOption);
}


const retrieveWeather=async ()=>{
    let url=`http://api.weatherapi.com/v1/current.json?key=d82f4498864a4545ba9172853243006&q=${selectCity.value}&aqi=no`;
    let response=await fetch(url);
    let data=await response.json();
    // console.log(data);
    // console.log(data.current.temp_c);
    temp.innerText=`${data.current.temp_c} °C`;
    humidity.innerText=`${data.current.humidity} %`;
    visibility.innerText=`${data.current.vis_km} Km`;
    windSpeed.innerText=`${data.current.wind_kph} Km/Hr`;
}


const updateFlag=(cCode)=>{
    if (cCode==null){
        let selectedOption = selectCountry.options[selectCountry.selectedIndex];
        //the options property of a select elem returns a list (starting from index 0)of all the option elements in the select element
        //similiarly, the selectedIndex property of the select element returns the index of the option elment currently selected(this can be used to access elements in the options array)
        let countryCode = selectedOption.getAttribute("data-code");
        //if we don't set the value attribute of the option element it is auto set to the text inside the option element
        //we cannot do directly like this as it is a built-in property of the select element that the value attribute of the option element selected is taken by the value attrib of select element so we can check which option is currently selected. However, this is not the case for the other attribs such as data-code. they remain to the option elements and we need to access the option element and then get the data-code from there. 
        // console.log(selectCountry.getAttribute("data-code"));
        // console.log(selectCountry.dataset.code);
        img.setAttribute("src", `https://flagsapi.com/${countryCode}/flat/64.png`);
    }
    else{
        img.setAttribute("src", `https://flagsapi.com/${cCode}/flat/64.png`);
    }
}

selectCountry.addEventListener("change", (evt)=>{
    loadingElem.classList.remove("hidden");
    updateCities();
    updateFlag();
    setTimeout(()=>{loadingElem.classList.add("hidden");},1000);
});

window.addEventListener("load", (evt)=>{
    populateCountries1();
    retrieveWeather();
    updateFlag("PK");
    updateCities();
});

btn.addEventListener("click", (evt)=>{
    loadingElem.classList.remove("hidden");
    evt.preventDefault();
    retrieveWeather();
    setTimeout(()=>{loadingElem.classList.add("hidden");},500);
});
