async function loadParcels() {
  const res = await fetch("api.php?action=get_parcels");
  const parcels = await res.json();
  const tbody = document.querySelector("#parcelTable tbody");
  tbody.innerHTML = "";

  parcels.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.land_type}</td>
      <td>${p.rainfall} mm</td>
      <td>${p.temperature} °C</td>
      <td><button onclick="recommend(${p.id})">Recommend</button></td>
    `;
    tbody.appendChild(tr);
  });
}

async function recommend(id) {
  const res = await fetch(`api.php?action=recommend&id=${id}`);
  const data = await res.json();
  const div = document.getElementById("recResults");

  if (data.error) {
    div.innerHTML = `<p style="color:red">${data.error}</p>`;
    return;
  }

  let html = "<table><tr><th>Species</th><th>Type</th><th>Score</th><th>Description</th></tr>";
  data.forEach(s => {
    html += `<tr>
      <td>${s.name}</td>
      <td>${s.land_type}</td>
      <td>${s.score}</td>
      <td>${s.description}</td>
    </tr>`;
  });
  html += "</table>";
  div.innerHTML = html;
}

loadParcels();
