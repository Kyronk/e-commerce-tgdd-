import React, { useRef, memo } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const MarkdownEditor = ({ label, value, changeValue, name, invalidFields, setInvalidFields, setIsFocusDescription}) => {
    // const editorRef = useRef(null);
    // const log = () => {
    //     if (editorRef.current) {
    //         console.log(editorRef.current.getContent());
    //     }
    // };

    return (
        <div className='flex flex-col'>
            <span className='' >{label}</span>
            <Editor
                apiKey='2eplu0n02wizu7asguxraakef53mnbnbt2c8bndmo7yahlqs'
                //onInit={(evt, editor) => editorRef.current = editor}
                // initialValue="<p>This is the initial content of the editor.</p>"
                initialValue={value}
                init={{
                    height: 500,
                    menubar: false,
                    // plugins: [
                    //     'advlist autolink lists link image charmap print preview anchor',
                    //     'searchreplace visualblocks code fullscreen',
                    //     'insertdatetime media table paste code help wordcount'
                    // ],
                    // toolbar: 'undo redo | formatselect | ' +
                    //     'bold italic backcolor | alignleft aligncenter ' +
                    //     'alignright alignjustify | bullist numlist outdent indent | ' +
                    //     'removeformat | help',
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 
                        'anchor','searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onChange={e => changeValue(prev => ({...prev, [name]: e.target.getContent() }))}
                onFocus={
                    () => {
                        setInvalidFields && setInvalidFields([])
                        // setIsFocusDescription(true) 
                }}
                // onBlur={() => setIsFocusDescription(false)}
            />

            {invalidFields?.some(el => el.name === name) && <small className='text-main text-sm'>{invalidFields?.find(el => el.name === name)?.mes}</small>}

            {/* <button onClick={log}>Log editor content</button> */}

        </div>
    );
}

export default memo(MarkdownEditor);


