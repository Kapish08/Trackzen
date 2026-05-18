const handleExport = async () => {
  try {

    const response = await api.get(
      '/api/audit/export',
      {
        responseType: 'blob',
      }
    );

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement('a');

    link.href = url;

    link.setAttribute(
      'download',
      'audit-logs.csv'
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {

    console.error(
      'Export failed:',
      error
    );

  }
};