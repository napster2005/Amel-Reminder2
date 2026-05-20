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
  let medicaments = xmlDoc.getElementsByTagName("medicament");
  let tbody = document.querySelector("#example tbody");

  for (let elem of medicaments) {
    let id         = elem.getAttribute("id");
    let type       = elem.getAttribute("type");
    let achete     = elem.getAttribute("achete");
    let priorite   = elem.getAttribute("priorite");
    let nom        = elem.getElementsByTagName("nom")[0].textContent;
    let dosage     = elem.getElementsByTagName("dosage")[0].textContent;
    let prix       = elem.getElementsByTagName("prix")[0].textContent;
    let quantite   = elem.getElementsByTagName("quantite")[0].textContent;
    let indication = elem.getElementsByTagName("indication")[0].textContent;
    let justif     = elem.getElementsByTagName("justification")[0].textContent;

    // Effets secondaires
    let effets = elem.getElementsByTagName("effet");
    let effetsHTML = "";
    for (let e of effets) {
      effetsHTML += `${e.textContent}<br>`;
    }

    // Badge priorité
    let prioriteBadge = "badge bg-warning";
    if (priorite === "haute")   prioriteBadge = "badge bg-danger";
    if (priorite === "moyenne") prioriteBadge = "badge bg-warning";
    if (priorite === "basse")   prioriteBadge = "badge bg-success";

    // Badge acheté
    let acheteBadge = achete === "oui"
      ? `<span class="badge bg-success">Oui</span>`
      : `<span class="badge bg-secondary">Non</span>`;

    // Ajouter la ligne au tableau
    tbody.innerHTML += `
      <tr>
        <td>${id}</td>
        <td>${type}</td>
        <td>${acheteBadge}</td>
        <td><span class="${prioriteBadge}">${priorite}</span></td>
        <td>${nom}</td>
        <td>${dosage}</td>
        <td>${prix}</td>
        <td>${quantite}</td>
        <td>${indication}</td>
        <td>${justif}</td>
        <td>${effetsHTML}</td>
      </tr>
    `;
  }
}

// Fonction principale
async function main() {
  let contenuXML = await lireFichier("medicaments.xml");
  let contenuXSD = await lireFichier("medicaments.xsd");

  if (contenuXML != null && contenuXSD != null)
    result = valider(contenuXML, contenuXSD);
  else
    { alert("contenu non disponible"); return; }

  if (result.errors != null)
    { document.write("<h2>Document NON valide : medicaments.xml</h2>"); return; }

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
