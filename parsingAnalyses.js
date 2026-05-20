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
  let analyses = xmlDoc.getElementsByTagName("analyse");
  let tbody = document.querySelector("#example tbody");

  for (let elem of analyses) {
    let id = elem.getAttribute("id");
    let date = elem.getElementsByTagName("date")[0].textContent;
    let heure = elem.getElementsByTagName("heure")[0].textContent;
    let labo = elem.getElementsByTagName("nom")[0].textContent;
    let adresse = elem.getElementsByTagName("adresse")[0].textContent;
    let tel = elem.getElementsByTagName("telephone")[0].textContent;
    let email = elem.getElementsByTagName("email")[0].textContent;
    let type = elem.getElementsByTagName("typeAnalyse")[0].textContent;
    let tests = elem.getElementsByTagName("test");
    let conclusion = elem.getElementsByTagName("conclusion")[0].textContent;
    let statut = elem.getElementsByTagName("conclusion")[0].getAttribute("statut");

    // Construire la liste des tests
    let testsHTML = "";
    for (let t of tests) {
      let nomTest = t.getAttribute("nom");
      let valeur = t.getElementsByTagName("valeur")[0].textContent;
      let unite = t.getElementsByTagName("valeur")[0].getAttribute("unite");
      let usuel = t.getElementsByTagName("valeurUsuelle")[0].textContent;
      testsHTML += `${nomTest}: ${valeur} ${unite} (Usuel: ${usuel})<br>`;
    }

    // Badge couleur selon statut
    let badgeClass = "badge bg-warning";
    if (statut === "normal") badgeClass = "badge bg-success";
    if (statut === "critique") badgeClass = "badge bg-danger";

    // Ajouter la ligne au tableau
    tbody.innerHTML += `
      <tr>
        <td>${id}</td>
        <td>${date}</td>
        <td>${heure}</td>
        <td>${labo}</td>
        <td>${adresse}</td>
        <td>${tel}</td>
        <td>${email}</td>
        <td>${type}</td>
        <td>${testsHTML}</td>
        <td>${conclusion}</td>
        <td><span class="${badgeClass}">${statut}</span></td>
      </tr>
    `;
  }
}

// Fonction principale
async function main() {
  let fichiers = ["analyses2021.xml", "analyses2022.xml", "analyses2023.xml", "analyses2024.xml", "analyses2025.xml"];
  let contenuXSD = await lireFichier("analyses.xsd");

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
    buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
    pageLength: 5,
    lengthMenu: [5, 10, 25, 50, 100],
    pagingType: "full_numbers",
    
  });
}

window.addEventListener("load", main);