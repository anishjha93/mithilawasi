const fs = require('fs');
const path = require('path');

const downloadDir = path.join(__dirname, '../downloadDir2026_06_10_17_36_15_715');
const files = fs.readdirSync(downloadDir).filter(f => f.endsWith('.xls'));

function parseFirst3Rows(fileName) {
  const filePath = path.join(downloadDir, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const rowRegex = /<Row[^>]*>([\s\S]*?)<\/Row>/g;
  let rowMatch;
  let rowCount = 0;
  
  console.log(`\n========================================`);
  console.log(`File: ${fileName}`);
  console.log(`========================================`);
  
  while ((rowMatch = rowRegex.exec(content)) !== null && rowCount < 6) {
    rowCount++;
    const rowContent = rowMatch[1];
    
    const cellRegex = /<Cell[^>]*>([\s\S]*?)<\/Cell>/g;
    let cellMatch;
    const cells = [];
    
    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      const cellContent = cellMatch[1];
      const dataRegex = /<Data[^>]*>([\s\S]*?)<\/Data>/;
      const dataMatch = dataRegex.exec(cellContent);
      cells.push(dataMatch ? dataMatch[1].trim() : '');
    }
    
    if (cells.length > 0) {
      console.log(`Row ${rowCount}:`, cells.slice(0, 15));
    }
  }
}

files.forEach(parseFirst3Rows);
