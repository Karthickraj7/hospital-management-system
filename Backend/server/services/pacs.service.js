const axios = require('axios');
const config = require('../config/pacs.config');
const dicomParser = require('dicom-parser');
const fs = require('fs');

class PACSService {
  constructor() {
    this.baseUrl = `http://${config.pacsServer.host}:${config.pacsServer.webPort}`;
  }

  /**
   * Query studies for a patient
   */
  async getPatientStudies(patientId, modality = null) {
    try {
      let url = `${this.baseUrl}/studies`;
      const params = {
        PatientID: patientId,
        limit: 50
      };
      
      if (modality) {
        params.Modality = modality;
      }
      
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching PACS studies:', error);
      throw error;
    }
  }

  /**
   * Get specific study details
   */
  async getStudyDetails(studyInstanceUID) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/studies/${studyInstanceUID}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching study details:', error);
      throw error;
    }
  }

  /**
   * Get series within a study
   */
  async getStudySeries(studyInstanceUID) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/studies/${studyInstanceUID}/series`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching series:', error);
      throw error;
    }
  }

  /**
   * Get instances/slices within a series
   */
  async getSeriesInstances(seriesInstanceUID) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/series/${seriesInstanceUID}/instances`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching instances:', error);
      throw error;
    }
  }

  /**
   * Get rendered image (JPEG/PNG) for preview
   */
  async getRenderedImage(instanceUID, frame = 1, width = 512, height = 512) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/instances/${instanceUID}/frames/${frame}/rendered`,
        {
          params: { width, height },
          responseType: 'arraybuffer'
        }
      );
      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error('Error fetching rendered image:', error);
      throw error;
    }
  }

  /**
   * Store DICOM file to PACS
   */
  async storeDicomFile(dicomBuffer, modality) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/instances`,
        dicomBuffer,
        {
          headers: {
            'Content-Type': 'application/dicom'
          }
        }
      );
      
      // Parse response to get Study/Series UIDs
      const studyUID = response.data?.ParentStudy || 
                       response.data?.[0]?.StudyInstanceUID;
      
      return {
        success: true,
        studyUID: studyUID,
        seriesUID: response.data?.ParentSeries,
        instanceUID: response.data?.[0]?.ID
      };
    } catch (error) {
      console.error('Error storing DICOM:', error);
      throw error;
    }
  }

  /**
   * Create DICOM WADO URL for viewer
   */
  getWadoUrl(studyUID, seriesUID, instanceUID, frame = 1) {
    return `${this.baseUrl}/wado?requestType=WADO&studyUID=${studyUID}&seriesUID=${seriesUID}&objectUID=${instanceUID}&contentType=application/dicom&frameNumber=${frame}`;
  }

  /**
   * Parse DICOM tags from buffer
   */
  parseDicomTags(dicomBuffer) {
    try {
      const dataSet = dicomParser.parseDicom(dicomBuffer);
      return {
        patientName: dataSet.string('x00100010'),
        patientId: dataSet.string('x00100020'),
        studyDate: dataSet.string('x00080020'),
        studyTime: dataSet.string('x00080030'),
        modality: dataSet.string('x00080060'),
        studyDescription: dataSet.string('x00081030'),
        seriesDescription: dataSet.string('x0008103e')
      };
    } catch (error) {
      console.error('Error parsing DICOM:', error);
      return {};
    }
  }
}

module.exports = new PACSService();