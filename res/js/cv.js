const navlinky = document.querySelectorAll(".navlink");
const sekcie = document.querySelectorAll("section");
const options = {
    threshold: 0.15
}
let io = new IntersectionObserver(listcheck, options);

sekcie.forEach(element => {
    io.observe(element)
});

function listcheck(entries) {
    entries.forEach(element => {
        var id = Number(element.target.getAttribute('data-id'));

        if (element.isIntersecting)
            navlinky[id].className = "navlink-active";
        else
            navlinky[id].className = "navlink";
    });
}

document.body.onload = cvdataload;
function cvdataload(ev) {
    $.ajax(
        {
            url: "/res/cvdata.json",
            success: ajsuccess
        });
}

function ajsuccess(result) {
    const json = result;
    if (json) {
        const Joby = json["Joby"];
        const Projekty = json["Projekty"];
        const Vzdelanie = json["Vzdelanie"];
        const IneVedomosti = json["IneVedomosti"];
        const OMne = json["OMne"];

        vytvorPrace(Joby, Projekty);
        vytvorVzdelanie(Vzdelanie);
        vytvorIneVedomosti(IneVedomosti);
        vytvorOMne(OMne);
    }
}

function vytvorPrace(joby, projekty) {
    var html = [];

    html.push(`<div class="sekcia-praca">`);
    html.push(`<h2 class="flex1">Work experience</h2>`);
    html.push(`<h2 class="flex2">Project experience</h2>`);
    html.push(`</div>`);

    joby.forEach((x, index) => {
        var pk = x["JobPK"];
        var prj = projekty.filter((p) => { if (p["JobFK"] == pk) return p; });
        html.push(vytvorPracu(x, prj));
        if (index + 1 < joby.length) html.push("<hr class='hr-job'>");
    });

    document.getElementById("praca").innerHTML = html.join("\n");
}

function vytvorPracu(job, projekty) {
    var html = [];
    html.push(`<div class="sekcia-praca">`);
    html.push(`<div class="data-wrapper flex1">`);
    html.push(`<ul class="timeline-ul">`);
    html.push(`<li class="timeline-li">`);
    html.push(`<p class="rok">${job["Koniec"] == null ? "now" : job["Koniec"]}</p>`);
    html.push(`<div class="job">`);
    html.push(`<h3>${job["Firma"]}</h3>`);
    html.push(`<strong>${job["Pozicia"]}</strong>`);
    html.push(`<p>(${job["Technologie"].join(", ")})</p>`);
    html.push(`</div>`);
    html.push(`<p class="rok rok-posledny">${job["Zaciatok"]}</p>`);
    html.push(`</li>`);
    html.push(`</ul>`);
    html.push(`</div>`);

    html.push(`<div class="data-wrapper flex2">`);
    html.push(`<ul class="timeline-ul">`);
    projekty.forEach((x, index) => {
        html.push(vytvorProjekt(x, index, projekty));
    });
    html.push(`</ul>`);
    html.push(`</div>`);
    html.push(`</div>`);

    return html.join("\n");
}

function vytvorProjekt(projekt, index, array) {
    var html = [];
    html.push(`<li class="timeline-li">`);
    html.push(`<p class="rok">${projekt["Koniec"] == null ? "now" : projekt["Koniec"]}</p>`);
    html.push(`<div class="job">`);
    html.push(`<strong>${projekt["Nazov"]}</strong>`);
    html.push(`<p>${projekt["Popis"]}</p>`);
    html.push(`</div>`);
    html.push(`<p class="rok${array.length - 1 == index ? " rok-posledny" : ""}">${projekt["Zaciatok"]}</p>`);
    html.push(`</li>`);

    return html.join("\n");
}

function vytvorVzdelanie(vzdelanie) {
    var html = [];

    html.push(`<h2>Education</h2>`);
    html.push(`<div class="data-wrapper">`);
    html.push(`<ul class="timeline-ul">`);

    vzdelanie.forEach(element => {
        html.push(`<li class="timeline-li">`);
        html.push(`<p class="rok">${element["Koniec"]}</p>`);
        html.push(`<div class="vzdelanie">`);
        html.push(`<div class="popis">`);
        html.push(`<h2>${element["Titul"]}, ${element["Univerzita"]}</h2>`);
        html.push(`<h4>${element["Fakulta"]}</h4>`);
        html.push(`<h4>${element["Katedra"]}</h4>`);
        html.push(`<h3>${element["Praca"]}</h3>`);
        html.push(`</div>`);
        html.push(`</div>`);
        html.push(`<p class="rok">${element["Zaciatok"]}</p>`);
        html.push(`</li>`);
    });

    html.push(`</ul>`);
    html.push(`</div>`);

    document.getElementById("vzdelanie").innerHTML = html.join("\n");
}

function vytvorIneVedomosti(IneVedomosti) {
    var html = [];

    html.push(`<h2>Other knowledge</h2>`);
    html.push(`<div class="data-wrapper">`);
    html.push(`<ul class="strom-start">`);

    IneVedomosti.forEach(element => {
        html.push(`<li class="strom-start-li">`);

        //aby nebola dlha modra ciara pri tych co nemaju podnazvy
        var h3css = element["PodNazvy"].length == 0 ? `style="width: auto;"` : "";

        html.push(`<h3 ${h3css}>${element["Nazov"]}</h3>`);

        if (element["PodNazvy"].length > 0) {
            html.push(`<ul class="strom-vnoreny">`);
            element["PodNazvy"].forEach(podnazov => {
                html.push(`<li class="strom-vnoreny-li">${podnazov}</li>`);
            });
            html.push(`</ul>`);
        }

        html.push(`</li>`);
    });

    html.push(`</ul>`);
    html.push(`</div>`);

    document.getElementById("ine").innerHTML = html.join("\n");
}

function vytvorOMne(OMne) {
    var html = [];

    html.push(`<h2>About me</h2>`);
    html.push(`<div class="kontakt-karta">`);
    html.push(`<div class="karta-data">`);
    html.push(`<p class="karta-text-maly">Name</p>`);
    html.push(`<p class="karta-text-bg">${OMne['Avatar']['Meno']}</p>`);
    html.push(`<p class="karta-text-maly">Date of birth</p>`);
    html.push(`<p class="karta-text-bg">${OMne['Narodeny']}</p>`);
    html.push(`<p class="karta-text-maly">Nationality</p>`);
    html.push(`<p class="karta-text-bg">${OMne['Narodnost']}</p>`);
    html.push(`<p class="karta-text-maly">State</p>`);
    html.push(`<p class="karta-text-bg">${OMne['Stav']}</p>`);
    html.push(`<p class="karta-text-maly">Phone</p>`);
    html.push(`<p class="karta-text-bg">${OMne['Kontakt']['Mobil']}</p>`);
    html.push(`<p class="karta-text-maly">E-mail</p>`);
    html.push(`<p class="karta-text-bg">${OMne['Kontakt']['Mail']}</p>`);
    html.push(`<p class="karta-text-maly">Address</p>`);
    OMne['Kontakt']['Adresa'].forEach(element => {
        html.push(`<p class="karta-text">${element}</p>`);
    });
    html.push(`</div>`);
    html.push(`<div class="karta-img">`);
    html.push(`<img class="img-bar" src="/res/obr/mfbc.png">`);
    html.push(`<img class="img-avatar" src="${OMne['Avatar']['Obrazok']}">`);
    html.push(`</div>`);
    html.push(`</div>`);
    html.push(`<div class="jazyky">`);
    html.push(`<h3>Languages</h3>`);
    OMne["Jazyky"].forEach(element => {
        html.push(`<div class="jazyk-polozka">`);
        html.push(`<p>${element["Jazyk"]} (${element["Uroven"]})</p>`);
        html.push(`</div>`);
    });
    html.push(`</div>`);
    //hobby
    html.push(`<div class="hobby">`);
    html.push(`<h3>Hobby</h3>`);
    OMne["Hoby"].forEach(element => {
        html.push(`
        <div class="hobby-polozka">
            <img src="${element["Obrazok"]}" alt="${element["Nazov"]}">
            <p>${element["Nazov"]}</p>
        </div>
        `);
    });
    html.push(`</div>`);
    //moje projekty
    html.push(`<div class="moje-projekty">`);
    html.push(`<h3>My personal projects</h3>`);
    OMne["MojeProjekty"].forEach(element => {
        html.push(`<div class="moje-projekty-polozka">
                        <h1>${element["Nazov"]}</h1>
                        <a href="${element["URL"]}"
                            target="_blank">
                            <img src="/res/obr/navlink.png" alt="navlink">
                        </a>
                    </div>`);
    });
    html.push(`</div>`);

    document.getElementById("kontakt").innerHTML = html.join("\n");

    VytvorAvatara(OMne["Avatar"]);
}

function VytvorAvatara(avatar) {
    var html = [];
    html.push(`<img src="${avatar['Obrazok']}" alt="avatar">`);
    html.push(`<h3>${avatar['Meno']}</h3>`);

    document.getElementById("avatar").innerHTML = html.join("\n");
}