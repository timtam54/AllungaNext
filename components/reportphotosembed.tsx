"use client"

import React, { useEffect, useState } from "react"
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack"
import CloseIcon from "@mui/icons-material/Close"
import PhotoModal from "@/components/PhotoModal"
import PhotoOpen from "./photoopen"
import { getToken } from "@/msal/msal"

interface Sample {
  SampleID: number
  description: string
  Number: number
  longdescription: string
  ExposureType: string
  EquivalentSamples: number
}

interface PhotoRow {
  id: number
  reportid: number
  sampleid: number
  description?: string
  photo?: string
}

type Props = {
  reportid: number
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}))

const PhotoImage = styled("img")({
  width: "150px",
  height: "150px",
  objectFit: "cover",
  cursor: "pointer",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
})

export default function ReportPhotosEmbed({ reportid }: Props) {
  const [samples, setSamples] = useState<Sample[]>([])
  const [data, setData] = useState<PhotoRow[]>([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sampleid, setSampleid] = useState(0)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string>("")

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    await fetchSamples()
    await fetchPhotos()
    setLoading(false)
  }

  const checkExists = (filename: string, reportid: number, sampleid: number): boolean => {
    const found = data.find(
      (i) => i.photo === `https://dentalinstalblob.blob.core.windows.net/files/allunga_pics/allunga~pic~${reportid}~${sampleid}~${filename}`
    )
    return !!found
  }

  const fetchSamples = async () => {
    try {
      const endpoint = `https://allungawebapi.azurewebsites.net/api/Samples/report/${reportid}`
      const response = await fetch(endpoint)
      const data = await response.json()
      setSamples(data)
    } catch (error) {
      console.error("Error fetching samples:", error)
    }
  }

  const fetchPhotos = async () => {
    try {
      const endpoint = `https://allungawebapicore.azurewebsites.net/api/ReportPhoto/{id}?reportid=${reportid}`
      const response = await fetch(endpoint)
      const jsonData = await response.json()
      setData(jsonData)
    } catch (error) {
      console.error("Error fetching photos:", error)
    }
  }

  const deletePhoto = async (id:number) => {
    try {
      const endpoint = `https://allungawebapicore.azurewebsites.net/api/ReportPhoto/`+id.toString();
      const token = await getToken()
      const headers = new Headers()
      const bearer = `Bearer ${token}`
      const options = {
        method: 'DELETE',
        headers: headers,
      }
      const response = fetch(endpoint, options);
      var ee = await response;
      if (!ee.ok) {
        alert((ee).statusText);
      }
     else
     {
      ;//alert('saved - add new row to parent - close');
      const data = await ee.json();
      const added:PhotoRow=data;
      console.table(added);
      photoadded(added);
     
     }

     // setData(jsonData)
    } catch (error) {
      console.error("Error fetching photos:", error)
    }
  }

  const photoadded = (photo: PhotoRow) => {
    setData([...data, photo])
  }

  const closeModalPhoto = () => {
    setIsModalOpen(false)
  }

  const openModal = (photoUrl: string) => {
    setSelectedPhoto(photoUrl)
    setModalIsOpen(true)
  }

  return (

    <div>
     <Box sx={{ bgcolor: "background.paper", p: 4, borderRadius: 2, boxShadow: 3 }}>
      {modalIsOpen && (
        <PhotoOpen closeModal={() => setModalIsOpen(false)} photoUrl={selectedPhoto} />
      )}

      {isModalOpen && (
        <PhotoModal
          photoadded={photoadded}
          checkExists={checkExists}
          reportid={reportid}
          sampleid={sampleid}
          closeModal={closeModalPhoto}
        />
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Report Photos
        </Typography>
   
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="report photos table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Sample No</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Exposure</StyledTableCell>
                <StyledTableCell colSpan={5}>Photos</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {samples.map((sample) => (
                <StyledTableRow key={sample.SampleID}>
                  <TableCell>{sample.Number}</TableCell>
                  <TableCell>{sample.description}</TableCell>
                  <TableCell>{sample.ExposureType}</TableCell>
                  {data
                    .filter((i) => i.sampleid === sample.SampleID)
                    .map((photo) => (
                      <TableCell key={photo.id}>
                        <PhotoImage
                          src={photo.photo}
                          onClick={() => openModal(photo.photo ?? "")}
                          alt={photo.description}
                        />
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          <a href={photo.photo ?? ""} target="_blank" rel="noopener noreferrer">
                            {photo.description}
                          </a>
                        </Typography>
                      </TableCell>
                    ))}
                  <TableCell>
                    <Button
                      variant="contained"
                      startIcon={<AddCircleIcon />}
                      endIcon={<PhotoCameraBackIcon />}
                      onClick={() => {
                        setSampleid(sample.SampleID)
                        setIsModalOpen(true)
                      }}
                    >
                      Add Photo
                    </Button>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
    </div>
    
  )
}