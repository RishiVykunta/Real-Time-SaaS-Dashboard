export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (data, filename = 'export', title = 'Export Data') => {
  try {
    let jsPDF;
    try {
      const module = await import('jspdf');
      jsPDF = module.jsPDF;
    } catch (importError) {
      throw new Error('jsPDF is not installed. Please run: npm install jspdf');
    }
    
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

    if (!data || data.length === 0) {
      doc.text('No data to export', 14, 30);
      doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
      return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => row[header] || ''));
    let y = 30;
    const startX = 14;
    const colWidth = 180 / headers.length;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    headers.forEach((header, i) => {
      doc.text(header, startX + i * colWidth, y);
    });
    doc.setFont(undefined, 'normal');
    rows.forEach((row, rowIndex) => {
      y += 7;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      row.forEach((cell, colIndex) => {
        const text = String(cell).substring(0, 20);
        doc.text(text, startX + colIndex * colWidth, y);
      });
    });

    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    if (error.message.includes('not installed')) {
      throw new Error('PDF export requires jspdf. Please run: npm install jspdf');
    }
    throw new Error('PDF export failed: ' + error.message);
  }
};

