userProperties = JSON.parse(userProperties);
// Initialize and add the map
window.initMap = () => {
  const mapCenter = userProperties[0].location;
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: mapCenter,
  });
  const markerAdder = (property) => {
    const marker = new google.maps.Marker({
      position: property.location,
      map: map,
      title: property.name,
    });
    const HTMLPopulator = (type, items) => {
      let stringToAdd = "";
      if (type === "fees") {
        for (let fee in items) {
          stringToAdd += `<p style='color:black !important'>${fee}: ${items[fee]}</p>`;
        }
      } else {
        for (let tenant of items) {
          console.log(tenant);
          stringToAdd += `<p style='color:black !important'>${tenant.name}</p><br>`;
        }
      }
      return stringToAdd;
    };
    const contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      `<img class='mx-4' style='max-width: 90%'src='${property.img || ""}'>` +
      `<h1 style='color:black !important' id="firstHeading" class="firstHeading">${property.name}</h1>` +
      '<div id="bodyContent">' +
      `<p style='color:black !important'><b>Address: </b>${property.address}<p><br>` +
      `<p style='color:black !important'><b>Buy Price ($): </b>${property.buyPrice}<p><br>` +
      `<p style='color:black !important'><b>Fees ($)</b></p>` +
      HTMLPopulator("fees", property.fees) +
      `<p style='color:black !important'><b>Tenants</b></p>` +
      HTMLPopulator("tenants", property.tenants) +
      "</div>" +
      "</div>";
    const infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });
    marker.addListener("click", () => {
      infoWindow.open({
        anchor: marker,
        map: map,
        shouldFocus: false,
      });
    });
    map.addListener("click", () => {
      infoWindow.close();
    });
  };

  for (const property of userProperties) {
    markerAdder(property);
  }
};
document.head.appendChild(script);
