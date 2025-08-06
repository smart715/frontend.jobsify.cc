"use client"

import { useState } from 'react';

import { Editor } from 'react-simple-wysiwyg';

const TextEditor = () => {

    const [html, setHtml] = useState('my <b>HTML</b>');
  
    function onChange(e) {
        setHtml(e.target.value);
    }
    
    return(
        <>
          <Editor value={html} onChange={onChange} />
        </>
    );
    
}

export default TextEditor;
