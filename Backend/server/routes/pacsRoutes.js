const express = require('express');
const router = express.Router();
const pacsService = require('../services/pacsService');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Get patient studies
router.get('/studies/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { modality } = req.query;
    
    const studies = await pacsService.getPatientStudies(patientId, modality);
    res.json(studies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get study details
router.get('/study/:studyUID', async (req, res) => {
  try {
    const { studyUID } = req.params;
    const details = await pacsService.getStudyDetails(studyUID);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get study series
router.get('/study/:studyUID/series', async (req, res) => {
  try {
    const { studyUID } = req.params;
    const series = await pacsService.getStudySeries(studyUID);
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get series instances
router.get('/series/:seriesUID/instances', async (req, res) => {
  try {
    const { seriesUID } = req.params;
    const instances = await pacsService.getSeriesInstances(seriesUID);
    res.json(instances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rendered image
router.get('/image/:instanceUID', async (req, res) => {
  try {
    const { instanceUID } = req.params;
    const { frame = 1, width = 512, height = 512 } = req.query;
    
    const imageBuffer = await pacsService.getRenderedImage(
      instanceUID, frame, width, height
    );
    
    res.set('Content-Type', 'image/jpeg');
    res.send(imageBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload DICOM file
router.post('/upload', upload.single('dicom'), async (req, res) => {
  try {
    const { modality } = req.body;
    const result = await pacsService.storeDicomFile(req.file.buffer, modality);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get WADO URL
router.get('/wado-url', (req, res) => {
  try {
    const { studyUID, seriesUID, instanceUID, frame = 1 } = req.query;
    const url = pacsService.getWadoUrl(studyUID, seriesUID, instanceUID, frame);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;