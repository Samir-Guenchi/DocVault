/**
 * Export Utilities for CSV and Excel
 * Provides functions to export data to various formats
 */

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data, headers = null) {
  if (!data || data.length === 0) {
    return '';
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = csvHeaders.join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      
      // Handle different data types
      if (value === null || value === undefined) {
        return '';
      }
      
      // Convert to string and escape quotes
      const stringValue = String(value).replace(/"/g, '""');
      
      // Wrap in quotes if contains comma, newline, or quote
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue}"`;
      }
      
      return stringValue;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(data, filename = 'export.csv', headers = null) {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Convert array of objects to Excel-compatible HTML table
 */
export function convertToExcelHTML(data, headers = null, sheetName = 'Sheet1') {
  if (!data || data.length === 0) {
    return '';
  }

  const excelHeaders = headers || Object.keys(data[0]);
  
  // Create HTML table
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <style>
        table { border-collapse: collapse; width: 100%; }
        th { background-color: #4285f4; color: white; font-weight: bold; padding: 8px; border: 1px solid #ddd; }
        td { padding: 8px; border: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9fafb; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
  `;
  
  // Add headers
  excelHeaders.forEach(header => {
    html += `<th>${escapeHTML(header)}</th>`;
  });
  
  html += `
          </tr>
        </thead>
        <tbody>
  `;
  
  // Add data rows
  data.forEach(row => {
    html += '<tr>';
    excelHeaders.forEach(header => {
      const value = row[header];
      html += `<td>${escapeHTML(value !== null && value !== undefined ? String(value) : '')}</td>`;
    });
    html += '</tr>';
  });
  
  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  return html;
}

/**
 * Download Excel file (as HTML with .xls extension)
 */
export function downloadExcel(data, filename = 'export.xls', headers = null, sheetName = 'Sheet1') {
  const html = convertToExcelHTML(data, headers, sheetName);
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Escape HTML special characters
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Format documents for export
 */
export function formatDocumentsForExport(documents, categories, departments) {
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));
  const departmentMap = Object.fromEntries(departments.map(d => [d.id, d.name]));
  
  return documents.map(doc => ({
    'ID': doc.id,
    'Title': doc.title,
    'Description': doc.description,
    'Category': categoryMap[doc.categoryId] || 'Unknown',
    'Department': departmentMap[doc.departmentId] || 'Unknown',
    'Owner': doc.owner,
    'File Type': doc.metadata?.fileType || 'N/A',
    'Size (KB)': doc.metadata?.sizeKb || 0,
    'Sensitivity': doc.metadata?.sensitivity || 'internal',
    'Created At': new Date(doc.createdAt).toLocaleString(),
    'Comments': (doc.comments || []).length,
    'Versions': (doc.versions || []).length
  }));
}

/**
 * Format users for export
 */
export function formatUsersForExport(users) {
  return users.map(user => ({
    'ID': user.id,
    'Name': user.name,
    'Email': user.email,
    'Role': user.role,
    'Created At': user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'
  }));
}

/**
 * Format categories for export
 */
export function formatCategoriesForExport(categories) {
  return categories.map(cat => ({
    'ID': cat.id,
    'Name': cat.name,
    'Created At': cat.createdAt ? new Date(cat.createdAt).toLocaleString() : 'N/A'
  }));
}

/**
 * Format departments for export
 */
export function formatDepartmentsForExport(departments) {
  return departments.map(dept => ({
    'ID': dept.id,
    'Name': dept.name,
    'Created At': dept.createdAt ? new Date(dept.createdAt).toLocaleString() : 'N/A'
  }));
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(prefix, extension) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}_${timestamp}.${extension}`;
}
