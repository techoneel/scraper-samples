let data = [];

/**
 * JSON to CSV
 */
// Function to convert JSON to CSV
function jsonToCSV(jsonData) {
    if (jsonData.length === 0) {
        return '';
    }

    const headers = Object.keys(jsonData[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of jsonData) {
        const values = headers.map(header => {
            const cellValue = row[header] === null || row[header] === undefined ? '' : row[header];
            return `"${cellValue.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

// Function to download CSV
function downloadCSV(csvContent, fileName) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Example usage
function convertAndDownload(jsonData, fileName) {
    const csvContent = jsonToCSV(jsonData);
    downloadCSV(csvContent, fileName);
}

/**
 * Get Next Sibling by Tag and Class
 */
function getNextSiblingByTag(element, tagName, className) {
  let nextSibling = element.nextElementSibling;

  while (nextSibling) {
    if (nextSibling.tagName.toLowerCase() === tagName.toLowerCase() && (!className || nextSibling?.classList?.contains(className))) {
      return nextSibling;
    }
    nextSibling = nextSibling.nextElementSibling;
  }

  return null; // No matching sibling found
}

/**
 * Specific scraping logic
 */
function scrapeData(){
  Array.from(document.querySelectorAll('h2.wp-block-heading')).forEach(el => {
      let name = el.innerText.trim();
      if(/^\d/.test(name)){
          let image = getNextSiblingByTag(el,'figure','wp-block-image')?.querySelectorAll('img')[0]?.src || getNextSiblingByTag(el,'div','wp-block-image')?.querySelectorAll('figure > img')[0]?.src || null;
          let extra = {};
          let ulEL = getNextSiblingByTag(el, 'ul');
          if(ulEL?.nodeName === 'UL'){
              Array.from(ulEL.children).forEach(li => {
                  let liText = li.innerText?.split(':');
                  if(liText.length === 2){
                      let key = liText[0].trim()?.replaceAll(' ', '_')?.toLocaleLowerCase();
                      let value = liText[1].trim();
                      extra[key] = value;
                  }
              }); 
          }
          data.push({
              name: name.substr(name.indexOf('.')+1, name.length).trim(),
              image: image,
              ...extra
          });
      }
  })
}

scrapeData();
convertAndDownload(data, "durga_puja_north_2024.csv");
