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
  let rdvs = xmlDoc.getElementsByTagName("rdv");
  let tbody = document.querySelector("#example tbody");

  for (let elem of rdvs) {
    let id       = elem.getAttribute("id");
    let type     = elem.getAttribute("type");
    let statut   = elem.getAttribute("statut");
    let priorite = elem.getAttribute("priorite");

    let date     = elem.getElementsByTagName("date")[0].textContent;
    let heure    = elem.getElementsByTagName("heure")[0].textContent;

    let medecinNom  = elem.getElementsByTagName("medecin")[0]?.getElementsByTagName("nom")[0]?.textContent || "-";
    let specialite  = elem.getElementsByTagName("medecin")[0]?.getElementsByTagName("specialite")[0]?.textContent || "-";

    let lieuNom     = elem.getElementsByTagName("lieu")[0].getElementsByTagName("nom")[0].textContent;
    let adresse     = elem.getElementsByTagName("lieu")[0].getElementsByTagName("adresse")[0].textContent;

    let motif       = elem.getElementsByTagName("motif")[0].textContent;

    // Badge statut
    let statutBadge = "badge bg-secondary";
    if (statut === "termine") statutBadge = "badge bg-success";
    if (statut === "planifie") statutBadge = "badge bg-info";
    if (statut === "annule") statutBadge = "badge bg-danger";

    // Badge priorité
    let prioriteBadge = "badge bg-warning";
    if (priorite === "haute") prioriteBadge = "badge bg-danger";
    if (priorite === "moyenne") prioriteBadge = "badge bg-warning";
    if (priorite === "faible") prioriteBadge = "badge bg-success";

    tbody.innerHTML += `
      <tr>
        <td>${id}</td>
        <td>${type}</td>
        <td>${date}</td>
        <td>${heure}</td>
        <td>${medecinNom}</td>
        <td>${specialite}</td>
        <td>${lieuNom}</td>
        <td>${adresse}</td>
        <td>${motif}</td>
        <td><span class="${statutBadge}">${statut}</span></td>
        <td><span class="${prioriteBadge}">${priorite}</span></td>
      </tr>
    `;
  }
}

// Fonction principale
async function main() {
  let contenuXML = await lireFichier("rendezvous.xml");
  let contenuXSD = await lireFichier("rendezvous.xsd");

  if (contenuXML != null && contenuXSD != null)
    result = valider(contenuXML, contenuXSD);
  else
    { alert("contenu non disponible"); return; }

  if (result.errors != null)
    { document.write("<h2>Document NON valide : rendezvous.xml</h2>"); return; }

  let contenuXMLDOM = convertirEnDom(contenuXML);
  exploiter(contenuXMLDOM);

  $('#example').DataTable({
    dom: 'Bfrtip',
    buttons: ['copy','csv','excel','pdf','print'],
    pageLength: 5,
    lengthMenu: [5,10,25,50,100],
    pagingType: "full_numbers",
  
  });
}

window.addEventListener("load", main);
