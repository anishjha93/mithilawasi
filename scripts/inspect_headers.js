const fs = require('fs');
const path = require('path');

const downloadDir = path.join(__dirname, '../downloadDir2026_06_10_17_36_15_715');

function parseFirstNRows(fileName, n = 15) {
  const filePath = path.join(downloadDir, fileName);
  console.log(`\n========================================`);
  console.log(`Parsing first ${n} rows of: ${fileName}`);
  console.log(`========================================`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find all <Row ...>...</Row> blocks
  const rowRegex = /<Row[^>]*>([\s\S]*?)<\/Row>/g;
  let rowMatch;
  let rowCount = 0;
  
  while ((rowMatch = rowRegex.exec(content)) !== null && rowCount < n) {
    rowCount++;
    const rowContent = rowMatch[1];
    
    // Find all <Cell ...>...</Cell> blocks within this row
    const cellRegex = /<Cell[^>]*>([\s\S]*?)<\/Cell>/g;
    let cellMatch;
    const cells = [];
    
    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      const cellContent = cellMatch[1];
      
      // Extract data inside <Data ss:Type="...">...</Data>
      const dataRegex = /<Data[^>]*>([\s\S]*?)<\/Data>/;
      const dataMatch = dataRegex.exec(cellContent);
      const cellValue = dataMatch ? dataMatch[1].trim() : '';
      cells.push(cellValue);
    }
    
    console.log(`Row ${rowCount}:`, cells);
  }
}

// Let's inspect some files
const files = [
  'uLBWardforStateWithCov2026:06:10:17:36:33:232.xls'
];

files.forEach(file => parseFirstNRows(file, 15));
