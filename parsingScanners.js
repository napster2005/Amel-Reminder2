// Lire un fichier XML
async function lireFichier(chemin) {
  let xmlResponse = await fetch(chemin);
  return await xmlResponse.text();
}

// Convertir XML en DOM
function convertirEnDom(contenuXML) {
  let parser = new DOMParser();
  return parser.parseFromString(contenuXML, "text/xml");
}

// Valider XML contre XSD
function valider(xmlContent, xsdContent) {
  let result = xmllint.validateXML({
    xml: xmlContent,
    schema: xsdContent
  });
  return result;
}

// Exploiter le DOM et remplir le tableau
function exploiter(xmlDoc) {
  let scanners = xmlDoc.getElementsByTagName("scanner");
  let tbody = document.querySelector("#example tbody");

  for (let elem of scanners) {
    let id             = elem.getAttribute("id");
    let date           = elem.getElementsByTagName("date")[0].textContent;
    let hopital        = elem.getElementsByTagName("nom")[0].textContent;
    let service        = elem.getElementsByTagName("service")[0].textContent;
    let adresse        = elem.getElementsByTagName("adresse")[0].textContent;
    let serviceMedical = elem.getElementsByTagName("serviceMedical")[0].textContent;
    let typeScanner    = elem.getElementsByTagName("typeScanner")[0].textContent;
    let indication     = elem.getElementsByTagName("indication")[0].textContent;
    let technique      = elem.getElementsByTagName("technique")[0].textContent;
    let conclusion     = elem.getElementsByTagName("conclusion")[0].textContent;
    let medecinNom     = elem.getElementsByTagName("medecin")[0].getElementsByTagName("nom")[0].textContent;
    let specialite     = elem.getElementsByTagName("specialite")[0].textContent;

    // Résultats thoraciques
    let thoraciqueDetails = elem.getElementsByTagName("thoracique")[0].getElementsByTagName("detail");
    let thoraciqueHTML = "";
    for (let d of thoraciqueDetails) {
      thoraciqueHTML += `${d.textContent}<br>`;
    }

    // Résultats abdominaux
    let abdominalDetails = elem.getElementsByTagName("abdominal")[0].getElementsByTagName("detail");
    let abdominalHTML = "";
    for (let d of abdominalDetails) {
      abdominalHTML += `${d.textContent}<br>`;
    }

    // Ajouter la ligne au tableau
    tbody.innerHTML += `
      <tr>
        <td>${id}</td>
        <td>${date}</td>
        <td>${hopital}</td>
        <td>${service}</td>
        <td>${adresse}</td>
        <td>${serviceMedical}</td>
        <td>${typeScanner}</td>
        <td>${indication}</td>
        <td>${technique}</td>
        <td>${thoraciqueHTML}</td>
        <td>${abdominalHTML}</td>
        <td>${conclusion}</td>
        <td>${medecinNom}</td>
        <td>${specialite}</td>
      </tr>
    `;
  }
}

// Fonction principale
async function main() {
  let fichiers = ["scanners2023.xml", "scanners2024.xml", "scanners2025.xml"];
  let contenuXSD = await lireFichier("scanners.xsd");

  if (contenuXSD == null)
    { alert("Schema XSD non disponible"); return; }

  for (let fichier of fichiers) {
    let contenuXML = await lireFichier(fichier);

    if (contenuXML != null)
      result = valider(contenuXML, contenuXSD);
    else
      { alert("contenu non disponible : " + fichier); return; }

    if (result.errors != null)
      { document.write("<h2>Document NON valide : " + fichier + "</h2>"); return; }

    let contenuXMLDOM = convertirEnDom(contenuXML);
    exploiter(contenuXMLDOM);
  }

  $('#example').DataTable({
    dom: 'Bfrtip',
    buttons: ['copy','csv','excel','pdf','print'],
    pageLength: 5,
    lengthMenu: [5,10,25,50,100],
    pagingType: "full_numbers",
   
  });
}

window.addEventListener("load", main);
