import React from 'react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';



function CsvReader() {

  // state
    const [csvFile, setCsvFile] = useState()
    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])


    // function for processing txt files that do not have headings, but explicitly fit the information described in the task
    const processTxtFile = (dataString) => {
      let dataArray = dataString.split(/\n/)
        const headers = ["First Name", "Last Name", "Email", "Vehicle Type", "Vehicle Name", "Vehicle Length"]
        const list = []
        
        // table rows
        for (let i = 0; i < dataArray.length; i ++){
          let row = []

          // checks for data separated by | or ,
          if(dataArray[i].includes('|')){
            row = dataArray[i].split('|')
          }else{
            row = dataArray[i].split(',')
          }
          
          
          if (headers && row.length === headers.length){
            const obj = {}
            for (let j = 0; j < headers.length; j++){
              let d = row[j]
              if(headers[j]){
                obj[headers[j]] = d
              }
            }
            // remove the blank rows
            if (Object.values(obj).filter(x => x).length > 0) {
              list.push(obj);
            }
          
          }
        }
     
        // // prepare columns list from headers
        const columns = headers.map(c => ({
          name: c,
          selector: c,
          sortable: true,
        }));
     
        setData(list);
        setColumns(columns);
    }

// function for processing csv files that has headings already
    const processData = (dataString) => {
        // splits data into array where each item is each line of data, with dataStringlines[0] being the header, and everything else being the data to populate the table
        const dataStringLines = dataString.split(/\r\n|\n/);
        console.log('lines',dataStringLines)
        // for simple data with no special characters inside of information
        const headers = dataStringLines[0].split(',')
        //   complicated regex
        // const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
     
        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
        // for simple data with no special characters inside of information
          const row = dataStringLines[i].split(',');  
        //   complicated regex
        //   const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
          if (headers && row.length === headers.length) {
            const obj = {};
            for (let j = 0; j < headers.length; j++) {
              let d = row[j];
              if (d.length > 0) {
                if (d[0] === '"')
                  d = d.substring(1, d.length - 1);
                if (d[d.length - 1] === '"')
                  d = d.substring(d.length - 2, 1);
              }
              if (headers[j]) {
                obj[headers[j]] = d;
              }
            }
     
            // remove the blank rows
            if (Object.values(obj).filter(x => x).length > 0) {
              list.push(obj);
            }
          
          }
        }
     
        // // prepare columns list from headers
        const columns = headers.map(c => ({
          name: c,
          selector: c,
          sortable: true,
        }));
     
        setData(list);
        setColumns(columns);
      }

      // function to handle submit button
const submit = () => {
        const file = csvFile
        const reader = new FileReader()

        reader.onload = function(e) {
            const text = e.target.result
            // checks whether the file is a txt file
            if(file.type === "text/plain"){
              processTxtFile(text)
            }else{
              processData(text)
            }
            
        }
        // converts the contents of the file to a string
        reader.readAsText(file)
        
    }

  
    return (
        <div>
          <header id = "header">
            <div>
            <h1>Outdoor.sy</h1>
            <h4>Upload your customer lists and display it in a sortable table!</h4>
            </div>
            <div>
            <p>Please ensure that your file is in .txt or .csv format.</p>
            </div>
          </header>
        <div id = "form-div">
        <form id = 'csv-form'>
          <p>Upload your file here:</p>
            <input 
                type = 'file'
                accept = '.csv, .numbers, .txt'
                id = 'csvfile'
                onChange = {(e) => {
                    setCsvFile(e.target.files[0])
                }}
            />
            <br/>
            <button id = 'button'
                onClick={(e) => {
                    e.preventDefault()
                    if(csvFile){submit()}
                    else{submit()}
                }}>
                Submit
            </button>
        </form>

        </div>
        
        <div id = "table">
        <br/>
            <br/>
            <h2>Tables will display below</h2>
            <DataTable
            pagination
            highlightOnHover
            columns = { columns }
            data = { data }
            />

        </div>
        </div>
    )
}

export default CsvReader;