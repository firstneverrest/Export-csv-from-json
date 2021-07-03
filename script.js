const objectToCsv = (data) => {
  const csvRows = [];

  // get the headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  // loop over the rows
  for (const row of data) {
    const values = headers.map((header) => {
      const escaped = row[header].toString().replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    // form escaped comma to separate values
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
};

const download = (data) => {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const csvFile = document.createElement('a');
  csvFile.setAttribute('hidden', '');
  csvFile.setAttribute('href', url);
  csvFile.setAttribute('download', 'ข้อมูลข้าราชการ.csv');
  document.body.appendChild(csvFile);
  csvFile.click();
  document.body.removeChild(csvFile);
};

const createTableFromData = () => {
  getData().then((data) => {
    let table = document.getElementById('dataTable');
    for (let i = 0; i < data.length; i++) {
      let row = `<tr>
                   <td>${data[i].id}</td>
                   <td>${data[i].userId}</td>
                   <td>${data[i].title}</td>
                   <td>${data[i].completed}</td>
                </tr>`;

      table.innerHTML += row;
    }
  });
};

const getData = async () => {
  const jsonUrl = 'https://jsonplaceholder.typicode.com/todos';
  const res = await fetch(jsonUrl);
  const jsonData = await res.json();

  if (jsonData) {
    const data = jsonData.map((row) => ({
      id: row.id,
      userId: row.userId,
      title: row.title,
      completed: row.completed,
    }));

    return data;
  }
};

const exportToCSV = () => {
  getData().then((data) => {
    download(objectToCsv(data));
  });
};

const main = () => {
  const buttonExportToCsv = document.getElementById('btnExportToCsv');
  buttonExportToCsv.addEventListener('click', exportToCSV);
  createTableFromData();
};

main();
