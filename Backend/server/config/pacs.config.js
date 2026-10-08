// PACS Configuration - Store in environment variables
module.exports = {
  // PACS Server Connection
  pacsServer: {
    host: process.env.PACS_HOST || '192.168.1.100', // Your PACS server IP
    dicomPort: process.env.PACS_DICOM_PORT || 4242,
    webPort: process.env.PACS_WEB_PORT || 8042,
    aet: process.env.PACS_AET || 'YOUR_HOSPITAL', // Application Entity Title
    modality: process.env.PACS_MODALITY || 'HOSPITAL'
  },
  
  // Local AET for each modality
  modalities: {
    CT: 'CT_SCANNER',
    MRI: 'MRI_SCANNER', 
    XRAY: 'XRAY_SCANNER',
    USG: 'USG_SCANNER'
  },
  
  // API Endpoints
  endpoints: {
    dicomWeb: '/dicom-web',
    studies: '/studies',
    instances: '/instances'
  }
};