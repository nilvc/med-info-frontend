import React, { useState , useEffect } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';



export default function Test() {
    const [numPages, setNumPages] = useState(null)
    const [pdfurl , setPdfurl] = useState("")
    const [pageNumber, setPageNumber] = useState(1)

    /*To Prevent right click on screen*/
    // document.addEventListener("contextmenu", (event) => {
    //     event.preventDefault();
    // });
    
    useEffect(()=>{
        const goturl = localStorage.getItem('pdfurl')
        if (goturl)
        {
            setPdfurl(goturl)
        }
    },[])
    /*When document gets loaded successfully*/
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    return (
        <>
        <div className="main container">
            <div className="row">
                <div className="pagec">
                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                </div>
                <div className="buttonc">
                    <button type="button" disabled={pageNumber <= 1}onClick={previousPage} className="btn btn-sm btn-outline-dark mx-2">
                        Previous
                    </button>
                    <button type="button" disabled={pageNumber >= numPages} onClick={nextPage} className="btn btn-sm btn-outline-dark">
                        Next
                    </button>
                </div>
            </div>
            <div className="row mt-1 border border-dark">
                <Document
                    file= {pdfurl}
                    onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} />
                </Document>
            </div>
        </div>
        </>
    );
}
