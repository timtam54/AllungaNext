import "@/components/part.css";
import Button from '@mui/material/Button';
type Props = {
  
    closeModal:  () => void;
  };


  export const SampleExplode  = ({  closeModal }:Props) => {

return (
    <div className="modal-container">
    <div className="modal" style={{backgroundColor:'whitesmoke'}} >
<h1 style={{fontSize:'24px',fontWeight:'bold'}}>Sample Explode</h1>

<Button type="submit" variant="outlined" onClick={(e)=>{e.preventDefault();closeModal()}}>Close</Button>
    <form>
        Exploded - to be completed
    </form>
    </div>
    </div>
)
  }
  export default SampleExplode
