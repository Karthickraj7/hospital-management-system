import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react';
import JoditEditor from 'jodit-react';

const JoditRichEditor = forwardRef(({ initialContent, onSave }, ref) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(initialContent || '');

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  useImperativeHandle(ref, () => ({
    getContent: () => content,
    getEditorInstance: () => editorRef.current?.editor
  }));

  const config = {
    readonly: false,
    height: 500,
    useTabForNext: false,
    allowTabChar: true,
    // Add these options to help with formatting inheritance
    defaultMode: 1, // WYSIWYG mode
    enterMode: 1, // P tag mode
    spellcheck: false,
    // Prevent formatting inheritance
    askBeforePasteHTML: false,
    processPasteHTML: true,
    // Clean up formatting
    cleanHTML: {
      fillEmptyParagraph: false,
      removeEmptyElements: false,
      replaceNBSP: false,
      allowTags: 'p,br,strong,em,u,ol,ul,li,h1,h2,h3,h4,h5,h6,img,a,table,tr,td,th,video',
      denyTags: 'script,style'
    },
    uploader: {
      insertImageAsBase64URI: true
    },
    preserveWhiteSpace: true,
    editorCssClass: 'jodit-document',
    style: {
      fontFamily: 'Arial, sans-serif',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.5'
    },
    showSourceButton: true,
    extraAllowedContent: 'p(*),ul(*),ol(*),li(*),strong(*),em(*),pre(*),h1(*),h2(*),h3(*)',
    buttons: [
      'bold', 'italic', 'underline', 'link', 'source', '|',
      'ul', 'ol', 'image', 'video', '|',
      'undo', 'redo', '|', 'hr', 'formatBlock', 'align', 'about'
    ],
    events: {
      beforeFileUpload: (files) => {
        for (let file of files) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const base64 = e.target.result;
            if (file.type.startsWith('video/')) {
              const videoHTML = `
                <video controls style="max-width:100%">
                  <source src="${base64}" type="${file.type}">
                  Your browser does not support the video tag.
                </video>`;
              editorRef.current?.editor.selection.insertHTML(videoHTML);
            } else {
              editorRef.current?.editor.selection.insertImage(base64, null, file.name);
            }
          };
          reader.readAsDataURL(file);
        }
        return false;
      },
      // Use afterInit to set up event listener after editor is ready
      afterInit: function(editor) {
        // Store reference for other methods
        editorRef.current = { editor };
        
        // Set up keydown handler on the editor element
        const editorElement = editor.editor || editor.container.querySelector('.jodit-wysiwyg');
        if (editorElement) {
          // Handle Tab key
          editorElement.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
              e.preventDefault();
              e.stopPropagation();
              
              try {
                // Method 1: Try insertHTML with non-breaking spaces
                if (editor.selection && editor.selection.insertHTML) {
                  editor.selection.insertHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
                  return;
                }
                
                // Method 2: Try execCommand
                if (editor.execCommand) {
                  editor.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
                  return;
                }
                
                // Method 3: Direct text insertion
                if (editor.selection && editor.selection.insertNode) {
                  const textNode = editor.createInside.text('    '); // 4 spaces
                  editor.selection.insertNode(textNode, false);
                  return;
                }
                
                // Method 4: Focus and use document.execCommand as last resort
                if (editor.editor && editor.editor.focus) {
                  editor.editor.focus();
                  document.execCommand('insertText', false, '    ');
                }
              } catch (error) {
                console.log('Tab insertion error:', error);
                // Fallback: try basic document.execCommand
                try {
                  document.execCommand('insertText', false, '    ');
                } catch (fallbackError) {
                  console.log('Fallback tab insertion failed:', fallbackError);
                }
              }
            }
            
            // Handle Space key to prevent formatting inheritance
            if (e.key === ' ' || e.code === 'Space') {
              // Check if cursor is at the end of formatted text
              const selection = editor.selection;
              if (selection && selection.isCollapsed()) {
                const range = selection.range;
                const currentNode = range.endContainer;
                
                // Check if we're at the end of an underlined element
                let parentElement = currentNode.nodeType === Node.TEXT_NODE ? 
                  currentNode.parentElement : currentNode;
                
                if (parentElement && (
                  parentElement.tagName === 'U' || 
                  parentElement.style.textDecoration === 'underline' ||
                  parentElement.style.textDecorationLine === 'underline'
                )) {
                  // Check if cursor is at the very end of the underlined text
                  const textContent = currentNode.textContent || '';
                  const cursorPos = range.endOffset;
                  
                  if (cursorPos === textContent.length) {
                    e.preventDefault();
                    
                    // Insert space without formatting
                    const spaceNode = editor.createInside.text(' ');
                    
                    // Move cursor after the underlined element
                    const afterUnderline = parentElement.parentNode;
                    if (afterUnderline) {
                      afterUnderline.insertBefore(spaceNode, parentElement.nextSibling);
                      
                      // Set cursor after the space
                      const newRange = editor.editorDocument.createRange();
                      newRange.setStartAfter(spaceNode);
                      newRange.collapse(true);
                      selection.selectRange(newRange);
                    }
                  }
                }
              }
            }
          }, true); // Use capture phase
        }
      }
    }
  };

  return (
    <div>
      <style jsx>{`
        .jodit-wysiwyg u + span,
        .jodit-wysiwyg u:after {
          text-decoration: none !important;
        }
        
        /* Prevent space inheritance of formatting */
        .jodit-wysiwyg {
          white-space: pre-wrap;
        }
      `}</style>
      <JoditEditor
        ref={editorRef}
        value={content}
        config={config}
        onBlur={(newContent) => {
          setContent(newContent);
          if (onSave) onSave(newContent);
        }}
      />
    </div>
  );
});

export default JoditRichEditor;