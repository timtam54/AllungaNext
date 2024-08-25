"use client";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";
import PhotoModal from "@/components/PhotoModal";
import PhotoOpen from "./photoopen";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import "@/components/part.css";

interface Sample {
  SampleID: number;
  description: string;
  Number: number;
  longdescription: string;
  ExposureType: string;
  EquivalentSamples: number;
}

interface Report {
  type: string;
  parameters: string[];
  photos: string[];
}

interface PhotoRow {
  id: number;
  reportid: number;
  sampleid: number;
  description?: string;
  photo?: string;
}

type Props = {
  closeModal: () => void;
  reportid: number;
};

export default function ReportPhotos({ closeModal, reportid }: Props) {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [data, setData] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sampleid, setSampleid] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await fetchSamples();
    await fetchPhotos();
    setLoading(false);
  };

  const checkExists = (filename: string, reportid: number, sampleid: number): boolean => {
    const found = data.find(
      (i) => i.photo === `https://dentalinstalblob.blob.core.windows.net/files/allunga_pics/allunga~pic~${reportid}~${sampleid}~${filename}`
    );
    return !!found;
  };

  const fetchSamples = async () => {
    try {
      const endpoint = `https://allungawebapi.azurewebsites.net/api/Samples/report/${reportid}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setSamples(data);
    } catch (error) {
      console.error("Error fetching samples:", error);
    }
  };

  const fetchPhotos = async () => {
    try {
      const endpoint = `https://allungawebapicore.azurewebsites.net/api/ReportPhoto/{id}?reportid=${reportid}`;
      const response = await fetch(endpoint);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const photoadded = (photo: PhotoRow) => {
    setData([...data, photo]);
  };

  const closeModalPhoto = () => {
    setIsModalOpen(false);
  };

  const openModal = (photoUrl: string) => {
    setSelectedPhoto(photoUrl);
    setModalIsOpen(true);
  };

  return (
    <div className="modal-container">
      <div className="modal" style={{ backgroundColor: "white" }}>
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

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Report Photos</h1>
          <Button type="submit" variant="outlined" onClick={(e) => { e.preventDefault(); closeModal(); }}>
            Close
          </Button>
        </div>

        <div style={{ height: "500px", overflowY: "scroll" }}>
          <table>
            <thead>
              <tr>
                <th>Sample No</th>
                <th>Name</th>
                <th>Exposure</th>
                <th colSpan={5}>Photos</th>
              </tr>
            </thead>
            {loading ? (
              <div className="relative h-16">
                <div className="absolute p-4 text-center transform -translate-x-1/2 translate-y-1/2 border top-1/2 left-1/2">
                  <Circles
                    height="200"
                    width="200"
                    color="#944780"
                    ariaLabel="circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </div>
              </div>
            ) : (
              <tbody>
                {samples.map((sample) => (
                  <tr key={sample.SampleID}>
                    <td>{sample.Number}</td>
                    <td>{sample.description}</td>
                    <td>{sample.ExposureType}</td>
                    {data.filter((i) => i.sampleid === sample.SampleID).map((photo) => (
                      <td key={photo.id}>
                        <img
                          src={photo.photo}
                          style={{ width: "150px", height: "150px" }}
                          onClick={() => openModal(photo.photo ?? "")}
                          alt={photo.description}
                        />
                        <br />
                        <a target="other" href={photo.photo ?? ""}>
                          <u>{photo.description}</u>
                        </a>
                      </td>
                    ))}
                    <td>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setSampleid(sample.SampleID);
                          setIsModalOpen(true);
                        }}
                      >
                        <AddCircleIcon />
                        Photo
                        <PhotoCameraBackIcon />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}