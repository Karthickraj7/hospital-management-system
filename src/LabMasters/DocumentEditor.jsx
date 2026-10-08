import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, message, Spin } from 'antd';
import JoditRichEditor from './JoditRichEditor';
import { useDispatch, useSelector } from 'react-redux';

const DocumentEditor = ({ visible, onClose, documentId }) => {
  const [content, setContent] = useState('');
  const [docName, setDocName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const dispatchvalue = useDispatch();
  const editorRef = useRef(null);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  useEffect(() => {
    if (visible && documentId) {
      setLoading(true);
      setError(null);
      setContent('');

      fetch(`${UrlLink}Lab/Documents_Edit_link?documentId=${documentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const decodedHtml = atob(data.html);
          setContent(decodedHtml || '<p>No content available.</p>');
          setDocName(data.fileName || 'Untitled Document');
        })
        .catch((error) => {
          console.error('Error fetching document:', error);
          setError(`Failed to load document: ${error.message}`);
          message.error(`Failed to load document: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [visible, documentId, UrlLink]);

  const handleSave = async () => {
    if (!documentId) {
      message.error('Document ID is missing. Please try again.');
      return;
    }

    const currentContent = editorRef.current?.getContent?.();
    if (!currentContent) {
      message.error('No content to save.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData = { html: currentContent };
      console.log('Saving document with data:', updateData);

      const response = await fetch(`${UrlLink}Lab/Documents_Edit_link?documentId=${documentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        message.success('Document saved successfully!');
        setContent(currentContent);
        if (onClose) onClose(true);
      } else {
        const errorData = await response.json();
        setError(`Save failed: ${errorData.error || 'Unknown error'}`);
        message.error(`Save failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving document:', error);
      setError(`An error occurred while saving: ${error.message}`);
      message.error(`An error occurred while saving: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const currentContent = editorRef.current?.getContent?.();
    if (!currentContent) {
      message.error('Nothing to print.');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Print Document - ${docName}</title>
        <style>
          body { font-family: Arial, sans-serif; white-space: pre-wrap; line-height: 1.5; }
          ul, ol { margin-left: 20px; }
          p { margin: 10px 0; }
        </style>
      </head>
      <body>${currentContent}</body>
    </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Modal
      title={docName || 'Edit Document'}
      open={visible}
      onCancel={() => onClose?.(false)}
      footer={null}
      width={900}
      style={{ top: 20 }}
      destroyOnHidden
    >
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'red' }}>
          <p>{error}</p>
          <Button onClick={() => onClose?.(false)}>Close</Button>
        </div>
      ) : (
        <>
          <JoditRichEditor
            initialContent={content}
            ref={editorRef}
          />
          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Button
              type="primary"
              onClick={handleSave}
              loading={saving}
              disabled={saving}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button onClick={handlePrint} disabled={saving}>
              Print
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default DocumentEditor;
