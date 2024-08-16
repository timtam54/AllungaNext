"use client"
import { ReactGrid, Column, Row, CellChange, TextCell, Cell, DefaultCellTypes, CellTemplate, NumberCell } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { getToken } from "@/msal/msal";
import { Circles } from 'react-loader-spinner'
import { ExportAsExcel, ExportAsPdf, CopyToClipboard, CopyTextToClipboard, PrintDocument, ExcelToJsonConverter, FileUpload } from "react-export-table";
import BorderAllIcon from '@mui/icons-material/BorderAll';
import "@/components/part.css";

import React,{ useState, useEffect} from 'react';
import Button from '@mui/material/Button';
//import { useSearchParams } from "next/navigation";
interface Param {
    ParamID:number;
    ParamName:string;
    Ordering:number;
}
interface Reading {
  Readingid:number;
  Paramid:number;
  sampleid:number;
  value:string;
  reportid:number;
  deleted:boolean;
}

interface Sample
{
  SampleID:number;
  description:string;
  Number:number;
}
type Props = {
  reportid: number;
  closeModal:  () => void;
};
function Rprt({closeModal,reportid}:Props) {
  const [loading, setLoading] = useState(true);

    const [columns, setColumns] = React.useState<Column[]>([]);
    const [dataReading, setDataReading] = React.useState<Reading[]>([]);
    const [datacol, setDatacol] = React.useState<Param[]>([]);
const [rows,setRows]=React.useState<Row[]>([]);

const [dataSample, setDataSample] = React.useState<Sample[]>([]);

      useEffect(() => {
        if (typeof window !== "undefined") {
          fill();
        }
        
      }, []);

      const saveReadings= async () => {//e
        //e.preventDefault();
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        headers.append('Content-type', "application/json; charset=UTF-8")
        const options = {
          method: 'PUT',
          body: JSON.stringify(dataReading),
          headers: headers,
        }
        const response = fetch(`https://allungawebapi.azurewebsites.net/api/Readings/` + reportid, options);
        var ee = await response;
        if (!ee.ok) {
          throw Error((ee).statusText);
        }
        //setDirty(false);
        alert('saved');
      }
      var runalready=false;
      const fill = async () => {
        if (runalready) return;
        runalready=true;
        
        setLoading(true);
        const urlParam = `https://allungawebapi.azurewebsites.net/api/Params/int/` + reportid;
        const token = await getToken()
        const headers = new Headers()
        const bearer = `Bearer ${token}`
        headers.append('Authorization', bearer)
        const options = {
          method: 'GET',
          headers: headers,
        }
        const response = fetch(urlParam, options);
        var ee = await response;
        if (!ee.ok) {
          throw Error((ee).statusText);
        }
        const json = await ee.json();
        console.log(json);
        setDatacol(json.sort((a:Param,b:Param) => a.Ordering > b.Ordering));
        json.forEach((element:Param) => {
          xlheaders.push(element.ParamName);
        });
        setXLHeaders(xlheaders);
        const urlReading = `https://allungawebapi.azurewebsites.net/api/Readings/` + reportid;

        
    const optionsReadings = {
      method: 'GET',
      headers: headers,
    }
    const responseReading = fetch(urlReading, optionsReadings);
    var ee = await responseReading;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    const jsonReadings = await ee.json();
    setDataReading(jsonReadings);

    
    const urlSample = `https://allungawebapi.azurewebsites.net/api/Samples/report/` + reportid;

    const optionsSample = {
      method: 'GET',
      headers: headers,
    }
    const responseSample = fetch(urlSample, optionsSample);
    var ee = await responseSample;
    if (!ee.ok) {
      throw Error((ee).statusText);
    }
    const jsonSample = await ee.json();

    setDataSample(jsonSample);

        const cols: Column[] = [];
        const cells: DefaultCellTypes[]=[];// Cell[]=[];
    
        cells.push({ type: "header", text: "Sample No" });
        cols.push({ columnId:0, width: 120 , resizable: true});
        cells.push({ type: "header", text: "Name" });
        cols.push({ columnId: 1, width: 120 , resizable: true});
        
      json.sort((a:Param, b:Param) => a.Ordering > b.Ordering).forEach((element:Param) => {
       cells.push({ type: "header", text: element.ParamName });
       cols.push({ columnId: element.ParamID, width: 60 , resizable: true});
  
      });
        const headerRow: Row  = {
          rowId: "header",
          cells: cells
        };
       // setRows([]);
        rows.push(headerRow);
        
        var ii=1;
        let Samp =[1,2];

        jsonSample.forEach((elementSample:Sample) => {
          var jj=0;
          const bodys: DefaultCellTypes[]=[];// Cell[]=[];
         
          bodys.push({ type: "text", text: elementSample.Number.toString() });
          bodys.push({ type: "text", text: elementSample.description.toString() });
        json.sort((a:Param, b:Param) => a.Ordering > b.Ordering).forEach((element:Param) => {//datacol
        var xx = jsonReadings.filter((i:Reading) => i.Paramid   === element.ParamID && i.sampleid === elementSample.SampleID);
        if (xx.length > 0) {
          bodys.push({ type: "text", text: xx[0].value.toString() });
        }
        else
        {
            bodys.push({ type: "text", text: '' });//jj
        }
            jj++;
      });
     const bodyRow: Row  = {
     rowId: elementSample.SampleID,
     cells: bodys
       };
      rows.push(bodyRow);
        ii++;
      });
        setColumns(cols);
        setLoading(false);
        ;//alert('rows:'+rows.length.toString())
      }
//
      const handleChanges = (changes: any) => {//CellChange<TextCell>[] 
        applyChangesToPeople(changes,rows);
        //setRows((prevPeople) => applyChangesToPeople(changes, prevPeople)); 

      }; 

      const applyChangesToPeople = (
        changes: CellChange<TextCell>[],
        prevPeople: Row[]
      ): Row[] => {
        changes.forEach((change) => {
          const personIndex = change.rowId;
          const fieldName = change.columnId;
          var roword = getcolordinal(fieldName.toString())+1;
          var colord = getrowordinal(personIndex.toString());
          var xx = prevPeople.filter((i) => i.rowId === personIndex);
          var x=xx[colord];
          if ((prevPeople[colord].cells[roword].type)=='number')
          {
            
           // let xx:NumberCell=(prevPeople[colord].cells[roword] as NumberCell);
            //xx.value =parseInt( change.newCell.text);
            //prevPeople[colord].cells[roword].value =parseFloat( change.newCell.text);
            (prevPeople[colord].cells[roword] as NumberCell).value =parseFloat( change.newCell.text);
          }
          else
          {
            (prevPeople[colord].cells[roword] as  TextCell).text = change.newCell.text;
            //prevPeople.push({ rowId:personIndex, });
            ;//(prevPeople[colord].cells[roword] as TextCell).text = +change.newCell.text.replace(',','').toString();
 //           prevPeople[personIndex][fieldName]
          }
            

          const sid = change.rowId.valueOf();
          const pid = change.columnId.valueOf();
          /*const temp = [...dataReading];
          var dd = temp.find(i => i["Paramid"] === pid && i["sampleid"] === sid);
          if (dd==null)
          {
            let aa= {Paramid:pid,sampleid:sid,value:parseInt( change.newCell.text),reportid:reportid};
            setDataReading([...temp,aa]);
          }
          else
          {
          dd.value = e.target.value;
          setDataReading([...temp]);
          }*/
        
          var dd = dataReading.find(i => i.Paramid == pid && i.sampleid == sid);
          if (dd==null)
          {
            dataReading.push({Readingid:0,Paramid:parseInt( pid.toString()), sampleid:parseFloat(sid.toString()), value:change.newCell.text.toString(), reportid:reportid, deleted:false });
            
            ;//let aa:Reading= {Paramid:pid,sampleid:parseInt(sid),value:parseInt( change.newCell.text).toString(),reportid:reportid};
           // setDataReading([...dataReading,aa]);
          }
          else
          {
            dd.value =  change.newCell.text.toString();
            setDataReading([...dataReading]);
          }
          
        });
        setRows([...prevPeople]);
        return [...prevPeople];
      };

      const getrowordinal = (SampleID:string):number=>
      {
        var ii=0;var found=false;
        dataSample.forEach((sam:Sample) => {
          if (!found)  ii++;
          if (parseInt( SampleID) == sam.SampleID)
          {found=true;
            return ii;
          }
          
        });
        return ii;
      }
      const getcolordinal = (ParamID:string):number=>
      {
        var ii=0;var found=false;
        datacol.forEach((sam) => {
          if (!found)  ii++;
          if (parseInt( ParamID) == sam.ParamID)
          {found=true;
            return ii;
            
          }
          
        });
        return ii;
      }
/*
      const applyChangesToPeople = (
        changes: CellChange<TextCell>[],
        prevPeople: Person[]
      ): Person[] => {
        changes.forEach((change) => {
          const personIndex = change.rowId;
          const fieldName = change.columnId;
         // alert(typeof prevPeople[personIndex][fieldName]);
          if ((typeof prevPeople[personIndex][fieldName])=='number')
          {
          prevPeople[personIndex][fieldName] = +change.newCell.text.replace(',','');
          }
          else
          {
            prevPeople[personIndex][fieldName] = change.newCell.text;
          }
        });
        return [...prevPeople];
      };*/

    const handleColumnResize = (ci: number | string, width: number) => {
      setColumns((prevColumns) => {
          const columnIndex = prevColumns.findIndex(el => el.columnId === ci);
          const resizedColumn = prevColumns[columnIndex];
          const updatedColumn = { ...resizedColumn, width };
          prevColumns[columnIndex] = updatedColumn;
          return [...prevColumns];
      });
    }

   const [xlheaders,setXLHeaders]=useState<string[]>(["SampleID", "Number", "description"]);



 return  <div className="modal-container">
    <div className="modal" style={{backgroundColor:'whitesmoke'}} >
  <table><tr><td><h3 style={{color:'#944780'}}>Readings - Excel View</h3></td><td> <Button  variant='contained' type="submit" onClick={(e)=>{e.preventDefault();closeModal()}}>Close</Button></td><td><Button variant="outlined"  style={{backgroundColor:'red',color:'white'}} onClick={saveReadings}>
 Submit
</Button></td>

<td>
<ExportAsExcel
    data={dataSample}
    headers={xlheaders}
>
{(props)=> (
      <Button variant="contained" style={{color:'black'}} {...props}>
        <BorderAllIcon/>Export as Excel
      </Button>
    )}
</ExportAsExcel>
  </td></tr></table> {loading ? 
          <div className="relative h-16">
  <div className="absolute p-4 text-center transform -translate-x-1/2 translate-y-1/2 border top-1/2 left-1/2">
           <Circles
             height="200"
             width="200"
             color="silver"
             ariaLabel="circles-loading"
             wrapperStyle={{}}
             wrapperClass=""
             visible={true}
           /></div></div>
:
<> <ReactGrid onCellsChanged={handleChanges}  onColumnResized={handleColumnResize} enableRowSelection enableFillHandle enableRangeSelection  enableColumnSelection rows={rows} columns={columns} stickyTopRows={1} />
</>
 }

</div>
</div>
}


export default Rprt