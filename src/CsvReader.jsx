import React from 'react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';

function CsvReader(props) {

    const [csvFile, setCsvFile] = useState()
    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])

    const processTxtFile = (dataString) => {
      let dataArray = dataString.split(/\n/)
        const headers = ["First Name", "Last Name", "Email", "Vehicle Type", "Vehicle Name", "Vehicle Length"]
        const list = []
        
        for (let i = 0; i < dataArray.length; i ++){
          let row = []
          if(dataArray[i].includes('|')){
            row = dataArray[i].split('|')
          }else{
            row = dataArray[i].split(',')
          }
          
          console.log(row)
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

    const processData = dataString => {
        console.log('datastring',dataString)
        
          
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

const submit = () => {
        const file = csvFile
        const reader = new FileReader()
        reader.onload = function(e) {
            const text = e.target.result
            console.log(text)
            console.log(file)
            if(file.type === "text/plain"){
              processTxtFile(text)
            }else{
              processData(text)
            }
            
        }
        reader.readAsText(file)
        
    }

  
    return (
        <div>

        
        <form id = 'csv-form'>
            <input
                type = 'file'
                accept = '.csv, .numbers, .txt'
                id = 'csvfile'
                onChange = {(e) => {
                    setCsvFile(e.target.files[0])
                }}
            />
            <br/>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    if(csvFile){submit()}
                    else{submit()}
                }}>
                Submit
            </button>
        </form>
        <div>
        <br/>
            <br/>
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