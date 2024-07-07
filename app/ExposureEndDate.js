
import React,{ useState, useEffect } from 'react';
import moment from 'moment';
import DatePicker from 'react-date-picker';
function ExposureEndDate({ text,StartDate, closePopup , DurationVal, DurationUnit}) {
  const [endDate,setEndDate] = useState(new Date());
  useEffect(() => {
    if (DurationUnit.toLowerCase() == "years")
    {
        let dte = moment(StartDate).add(DurationVal,'y');
        setEndDate(dte);
    }
    else  if (DurationUnit.toLowerCase() == "weeks")
    {
        let dte = moment(StartDate).add(DurationVal,'w');
        setEndDate(dte);
    }
    else  if (DurationUnit.toLowerCase() == "months")
    {
        let dte = moment(StartDate).add(DurationVal,'M');
        setEndDate(dte);
    }
    else  if (DurationUnit.toLowerCase() == "days")
    {
        let dte = moment(StartDate).add(DurationVal,'d');
        setEndDate(dte);
    }
    else  if (DurationUnit.toLowerCase() == "hours")
    {
        let dte = moment(StartDate).add(DurationVal,'h');
        setEndDate(dte);
    }
    /*
     Dim CanCalc As Boolean = True
 Dim counter As Decimal = 0
 While (counter < Radjpm)
     If (units.ToLower() = "mj/m2".ToLower()) Then
         counter += GetRadidationOnDate(LoopDate)
     ElseIf (units.ToLower() = "gj/m2") Then
         counter += GetRadidationOnDate(LoopDate) / CDec(1000)
     ElseIf (units.ToLower() = "langleys") Then
         counter += GetRadidationOnDate(LoopDate) * 23
   
   
     ElseIf (units.ToLower() = "blue scale fade: 7-4".ToLower()) Then
         LoopDate = LoopDate.AddDays(6 * 7) ''Convert.ToInt32(Radjpm)
         counter += 6 * 7 ''Convert.ToInt32(Radjpm)
         Exit While
     
     
     
         CanCalc = False
         Exit While
     End If

     LoopDate = LoopDate.AddDays(1)
 End While
 If (CanCalc) Then
     lblMessage.Text = "from date " + startdate.ToString("dd-MMM-yyyy") + ", " + counter.ToString + " " + units + " of radiation is accumulated on a flat rack by " & LoopDate.ToString("dd-MMM-yyyy")
 Else
     lblMessage.Text = "Cannot calc end date. You must estimate a next check date"
 End If
 */
  }, []);

  function setStartDate()  {

  }
  return (
    <div className="popup-container">
     <div className="popup-body">
      <h1>{text}</h1>
      
      <div><b>From:</b><DatePicker format="dd/MM/yyyy"  onChange={setStartDate} value={StartDate} /></div>
      <div><b>Duration:</b>{DurationVal} {DurationUnit}</div>
      <div><b>To:</b><DatePicker format="dd/MM/yyyy"  onChange={setEndDate} value={endDate} /></div>
      <button onClick={closePopup}>Close X</button>
     </div>
    </div>
  );
};

export default ExposureEndDate