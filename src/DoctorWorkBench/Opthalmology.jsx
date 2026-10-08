import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import { IconButton } from '@mui/material';

import AntImg from "../Assets/AntImg.png";
import Lens from "../Assets/Lens.png";
import Fundus1 from "../Assets/Fundus1.png";
import Fundus2 from "../Assets/Fundus2.png";
// import "../WorkBench/OtManagement.css";
import CanvasDraw from 'react-canvas-draw';



function Opthalmology() {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);
    const dispatch = useDispatch();

    const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    const DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.DoctorWorkbenchNavigation);
    console.log("DoctorWorkbenchNavigation", DoctorWorkbenchNavigation)
    const userRecord = useSelector((state) => state.userRecord?.UserData);


    const [OpthalformData, setOpthalformData] = useState({

        PGPODSph: "",
        PGPODCyl: "",
        PGPODAxs: "",

        PGPOsSph: "",
        PGPOsCyl: "",
        PGPOsAxs: "",

        ODadd: "",
        OSadd: "",//part-1

        chiefComplaints: "",
        history: "", //part-2




        ARODSph: "",
        ARODCyl: "",
        ARODAxs: "",

        AROsSph: "",
        AROsCyl: "",
        AROsAxs: "",//part-3

        powerODVision: "",
        powerOSVision: "",
        crxODVision: "",
        crxOSVision: "",
        cphODVision: "",
        cphOSVision: "",//part-4

        SubODSph: "", //part-5 start
        SubODCyl: "",
        SubODAxs: "",
        SubODVa: "",

        SubOsSph: "",
        SubOsCyl: "",
        SubOsAxs: "",
        SubOsVa: "",

        SubODadd: "",
        SubOSadd: "",

        DilODSph: "",
        DilODCyl: "",
        DilODAxs: "",

        DilOsSph: "",
        DilOsCyl: "",
        DilOsAxs: "",


        DilAccODSph: "",
        DilAccODCyl: "",
        DilAccODAxs: "",
        DilAccODVa: "",

        DilAccOSSph: "",
        DilAccOSCyl: "",
        DilAccOSAxs: "",
        DilAccOSVa: "", //part-5 end


        // AntSegOD: "",
        // AntSegOS: "",
        // LensOD: "",
        // LensOS: "", //part-6  // not saving

        // FundusOD: "",
        // FundusOS: "", //part-8 //not saving

        ATIOP: "",
        NCTIOP: "",
        OSATIOP: "",
        OSNCTIOP: "",

        SacSyringing: "",
        SacSyringingSecond: "", //part-7


        SubODDiagnosis: "",
        SubOSDiagnosis: "", //part-9

        Treatment: "",
        followUp: "", //part-10

        remarks: "", //part-16

        DilAccOD: "",
        DilAccOS: "", // unused
    });

    const [previewImage, setPreviewImage] = useState("");
    const [drainsData2, setDrainsData2] = useState([
        {
            rightSPH: "",
            rightCYL: "",
            rightAXIS: "",
            rightVA: "",
            leftSPH: "",
            leftCYL: "",
            leftAXIS: "",
            leftVA: "", //part-11 (1st row)

            rightNearSPH: "",
            rightNearCYL: "",
            rightNearAXIS: "",
            rightNearVA: "",
            leftNearSPH: "",
            leftNearCYL: "",
            leftNearAXIS: "",
            leftNearVA: "", //part-11 (2nd row)

            rightPrism: "", //4 checkboxes part-12
            rightPrismValue: "", //part -12 one input box
            leftPrism: "", //4 checkboxes part-13
            leftPrismValue: "", //part -13 one input box

            rightPrism2: "", //5 checkboxes part-14
            rightPrism2Value: "", //part -14 one input box

            leftPrism2: "", //5 checkboxes part-15
            leftPrism2Value: "",//part -15 one input box

        },
    ]);


    const handleChangeObstetric2 = (e, index, key) => {
        const updatedDrainsData2 = [...drainsData2];
        const prismKeys = ["rightPrism", "leftPrism", "rightPrism2", "leftPrism2"];

        if (prismKeys.includes(key)) {
            const side = key.startsWith("right") ? "right" : "left";
            const prismType = key.includes("2") ? `${side}Prism2` : `${side}Prism`;

            // Toggle the checkbox value
            if (updatedDrainsData2[index][prismType] === e.target.value) {
                updatedDrainsData2[index][prismType] = ""; // Unselect
            } else {
                updatedDrainsData2[index][prismType] = e.target.value; // Select
            }
        } else {
            updatedDrainsData2[index][key] = e.target.value;
        }

        setDrainsData2(updatedDrainsData2);
        console.log(updatedDrainsData2, 'updatedDrainsData2');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOpthalformData({
            ...OpthalformData,
            [name]: value,
        });

    };






    const [imageSrcAntSegOD, setImageSrcAntSegOD] = useState(null);
    const [imageSrcAntSegOS, setImageSrcAntSegOS] = useState(null);
    const [imageSrcLensOD, setImageSrcLensOD] = useState(null);
    const [imageSrcLensOS, setImageSrcLensOS] = useState(null);
    const [imageSrcFundusOD, setImageSrcFundusOD] = useState(null);
    const [imageSrcFundusOS, setImageSrcFundusOS] = useState(null);


    console.log('imageSrcAntSegOD---?????---', imageSrcAntSegOD);




    const antSegODRef = useRef(null);
    const antSegOSRef = useRef(null);
    const lensODRef = useRef(null);
    const lensOSRef = useRef(null);
    const fundusODRef = useRef(null);
    const fundusOSRef = useRef(null);

    const handleClear = (ref) => {
        if (ref.current) {
            ref.current.clear();
        }
    };
    const handleClear1 = (ref) => {
        if (ref) {
            setImageSrcAntSegOD(ref);
        }
    };


    const [gridData, setGridData] = useState([]);
    console.log(gridData, 'gridData');

    const [IsGetData, setIsGetData] = useState(false)
    const [IsViewMode, setIsViewMode] = useState(false)


    const OpthoColumns = [
        { key: 'id', name: 'S.No', frozen: true },
        { key: 'PatientId', name: 'Patient Id', frozen: true },
        { key: 'Date', name: 'Date', frozen: true },
        { key: 'Time', name: 'Time', frozen: true },
        // { key: 'PGPODSph', name: 'PGPODSph' },
        // { key: 'PGPODCyl', name: 'PGPODCyl' },
        // { key: 'PGPODAxs', name: 'PGPODAxs' },
        // { key: 'PGPOsSph', name: 'PGPOsSph' },
        // { key: 'PGPOsCyl', name: 'PGPOsCyl' },
        // { key: 'PGPOsAxs', name: 'PGPOsAxs' },

        // { key: 'ODadd', name: 'ODadd' },
        // { key: 'OSadd', name: 'OSadd' },

        // { key: 'chiefComplaints', name: 'chiefComplaints' },
        // { key: 'history', name: 'history' },

        // { key: 'ARODSph', name: 'ARODSph' },
        // { key: 'ARODCyl', name: 'ARODCyl' },
        // { key: 'ARODAxs', name: 'ARODAxs' },

        // { key: 'AROsSph', name: 'AROsSph' },
        // { key: 'AROsCyl', name: 'AROsCyl' },
        // { key: 'AROsAxs', name: 'AROsAxs' },

        // { key: 'powerODVision', name: 'powerODVision' },
        // { key: 'powerOSVision', name: 'powerOSVision' },
        // { key: 'crxODVision', name: 'crxODVision' },
        // { key: 'crxOSVision', name: 'crxOSVision' },
        // { key: 'cphODVision', name: 'cphODVision' },
        // { key: 'cphOSVision', name: 'cphOSVision' },

        // { key: 'SubODSph', name: 'SubODSph' },
        // { key: 'SubODCyl', name: 'SubODCyl' },
        // { key: 'SubODAxs', name: 'SubODAxs' },
        // { key: 'SubODVa', name: 'SubODVa' },

        // { key: 'SubOsSph', name: 'SubOsSph' },
        // { key: 'SubOsCyl', name: 'SubOsCyl' },
        // { key: 'SubOsAxs', name: 'SubOsAxs' },
        // { key: 'SubOsVa', name: 'SubOsVa' },

        // { key: 'SubODadd', name: 'SubODadd' },
        // { key: 'SubOSadd', name: 'SubOSadd' },

        // { key: 'DilODSph', name: 'DilODSph' },
        // { key: 'DilODCyl', name: 'DilODCyl' },
        // { key: 'DilODAxs', name: 'DilODAxs' },

        // { key: 'DilOsSph', name: 'DilOsSph' },
        // { key: 'DilOsCyl', name: 'DilOsCyl' },
        // { key: 'DilOsAxs', name: 'DilOsAxs' },

        // { key: 'DilAccODSph', name: 'DilAccODSph' },
        // { key: 'DilAccODCyl', name: 'DilAccODCyl' },
        // { key: 'DilAccODAxs', name: 'DilAccODAxs' },
        // { key: 'DilAccODVa', name: 'DilAccODVa' },

        // { key: 'DilAccOSSph', name: 'DilAccOSSph' },
        // { key: 'DilAccOSCyl', name: 'DilAccOSCyl' },
        // { key: 'DilAccOSAxs', name: 'DilAccOSAxs' },
        // { key: 'DilAccOSVa', name: 'DilAccOSVa' },

        // { key: 'ATIOP', name: 'ATIOP' },
        // { key: 'NCTIOP', name: 'NCTIOP' },
        // { key: 'OSATIOP', name: 'OSATIOP' },
        // { key: 'OSNCTIOP', name: 'OSNCTIOP' },
        // { key: 'SacSyringing', name: 'SacSyringing' },
        // { key: 'SacSyringingSecond', name: 'SacSyringingSecond' },

        // { key: 'SubODDiagnosis', name: 'SubODDiagnosis' },
        // { key: 'SubOSDiagnosis', name: 'SubOSDiagnosis' },
        // { key: 'Treatment', name: 'Treatment' },
        // { key: 'followUp', name: 'followUp' },
        // { key: 'remarks', name: 'remarks' },

        // { key: 'rightSPH', name: 'rightSPH' },
        // { key: 'rightCYL', name: 'rightCYL' },
        // { key: 'rightAXIS', name: 'rightAXIS' },
        // { key: 'rightVA', name: 'rightVA' },

        // { key: 'leftSPH', name: 'leftSPH' },
        // { key: 'leftCYL', name: 'leftCYL' },
        // { key: 'leftAXIS', name: 'leftAXIS' },
        // { key: 'leftVA', name: 'leftVA' },

        // { key: 'rightNearSPH', name: 'rightNearSPH' },
        // { key: 'rightNearCYL', name: 'rightNearCYL' },
        // { key: 'rightNearAXIS', name: 'rightNearAXIS' },
        // { key: 'rightNearVA', name: 'rightNearVA' },

        // { key: 'leftNearSPH', name: 'leftNearSPH' },
        // { key: 'leftNearCYL', name: 'leftNearCYL' },
        // { key: 'leftNearAXIS', name: 'leftNearAXIS' },
        // { key: 'leftNearVA', name: 'leftNearVA' },

        // { key: 'rightPrism', name: 'rightPrism' },
        // { key: 'rightPrismValue', name: 'rightPrismValue' },

        // { key: 'leftPrism', name: 'leftPrism' },
        // { key: 'leftPrismValue', name: 'leftPrismValue' },

        // { key: 'rightPrism2', name: 'rightPrism2' },
        // { key: 'rightPrism2Value', name: 'rightPrism2Value' },

        // { key: 'leftPrism2', name: 'leftPrism2' },
        // { key: 'leftPrism2Value', name: 'leftPrism2Value' },

        // { key: 'ATIOP', name: 'ATIOP' },
        // { key: 'ATIOP', name: 'ATIOP' },



        {
            key: 'view',
            name: 'View',
            frozen: true,
            renderCell: (params) => (
                <IconButton onClick={() => handleView(params.row)}>
                    <VisibilityIcon />
                </IconButton>
            ),
        },
    ];






    useEffect(() => {
        const RegistrationId = DoctorWorkbenchNavigation?.RegistrationId || IP_DoctorWorkbenchNavigation?.RegistrationId;

        if (RegistrationId) {
            axios.get(`${UrlLink}Workbench/Workbench_Opthalmology_Details?RegistrationId=${RegistrationId}`)
                .then((res) => {
                    setGridData(res.data.Opthalmology_Data || []);

                    console.log(res.data, '111Data received from API kjhgfyt');
                    console.log(res.data.Opthalmology_Data, '222Data received from API kjhgfyt');

                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            console.log('PatientId is required');
        }
    }, [IsGetData, UrlLink, DoctorWorkbenchNavigation,IP_DoctorWorkbenchNavigation]);





    const handleView = (data) => {
        if (data) {
            setIsViewMode(true);
            // Set the form data and other states with data from the clicked row
            setOpthalformData({
                PGPODSph: data.PGPODSph || '',
                PGPODCyl: data.PGPODCyl || '',
                PGPODAxs: data.PGPODAxs || '',
                PGPOsSph: data.PGPOsSph || '',
                PGPOsCyl: data.PGPOsCyl || '',
                PGPOsAxs: data.PGPOsAxs || '',
                ODadd: data.ODadd || '',
                OSadd: data.OSadd || '',
                chiefComplaints: data.chiefComplaints || '',
                history: data.history || '',
                ARODSph: data.ARODSph || '',
                ARODCyl: data.ARODCyl || '',
                ARODAxs: data.ARODAxs || '',
                AROsSph: data.AROsSph || '',
                AROsCyl: data.AROsCyl || '',
                AROsAxs: data.AROsAxs || '',
                powerODVision: data.powerODVision || '',
                powerOSVision: data.powerOSVision || '',
                crxODVision: data.crxODVision || '',
                crxOSVision: data.crxOSVision || '',
                cphODVision: data.cphODVision || '',
                cphOSVision: data.cphOSVision || '',
                SubODSph: data.SubODSph || '',
                SubODCyl: data.SubODCyl || '',
                SubODAxs: data.SubODAxs || '',
                SubODVa: data.SubODVa || '',
                SubOsSph: data.SubOsSph || '',
                SubOsCyl: data.SubOsCyl || '',
                SubOsAxs: data.SubOsAxs || '',
                SubOsVa: data.SubOsVa || '',
                SubODadd: data.SubODadd || '',
                SubOSadd: data.SubOSadd || '',
                DilODSph: data.DilODSph || '',
                DilODCyl: data.DilODCyl || '',
                DilODAxs: data.DilODAxs || '',
                DilOsSph: data.DilOsSph || '',
                DilOsCyl: data.DilOsCyl || '',
                DilOsAxs: data.DilOsAxs || '',
                DilAccODSph: data.DilAccODSph || '',
                DilAccODCyl: data.DilAccODCyl || '',
                DilAccODAxs: data.DilAccODAxs || '',
                DilAccODVa: data.DilAccODVa || '',
                DilAccOSSph: data.DilAccOSSph || '',
                DilAccOSCyl: data.DilAccOSCyl || '',
                DilAccOSAxs: data.DilAccOSAxs || '',
                DilAccOSVa: data.DilAccOSVa || '',
                ATIOP: data.Atiop || '',
                NCTIOP: data.Nctiop || '',
                OSATIOP: data.Osatiop || '',
                OSNCTIOP: data.Osnctiop || '',
                SacSyringing: data.SacSyringing || '',
                SacSyringingSecond: data.SacSyringingSecond || '',
                SubODDiagnosis: data.SubODDiagnosis || '',
                SubOSDiagnosis: data.SubOSDiagnosis || '',
                Treatment: data.Treatment || '',
                followUp: data.followUp || '',
                remarks: data.remarks || '',
            });
            setDrainsData2([
                {
                    rightSPH: data.rightSPH || '',
                    rightCYL: data.rightCYL || '',
                    rightAXIS: data.rightAXIS || '',
                    rightVA: data.rightVA || '',
                    leftSPH: data.leftSPH || '',
                    leftCYL: data.leftCYL || '',
                    leftAXIS: data.leftAXIS || '',
                    leftVA: data.leftVA || '',
                    rightNearSPH: data.rightNearSPH || '',
                    rightNearCYL: data.rightNearCYL || '',
                    rightNearAXIS: data.rightNearAXIS || '',
                    rightNearVA: data.rightNearVA || '',
                    leftNearSPH: data.leftNearSPH || '',
                    leftNearCYL: data.leftNearCYL || '',
                    leftNearAXIS: data.leftNearAXIS || '',
                    leftNearVA: data.leftNearVA || '',
                    rightPrism: data.rightPrism || '',
                    rightPrismValue: data.rightPrismValue || '',
                    leftPrism: data.leftPrism || '',
                    leftPrismValue: data.leftPrismValue || '',
                    rightPrism2: data.rightPrism2 || '',
                    rightPrism2Value: data.rightPrism2Value || '',
                    leftPrism2: data.leftPrism2 || '',
                    leftPrism2Value: data.leftPrism2Value || '',
                }
            ]);


            setImageSrcAntSegOD(data.antSegOD);
            setImageSrcAntSegOS(data.antSegOS);
            setImageSrcLensOD(data.lensOD);
            setImageSrcLensOS(data.lensOS)
            setImageSrcFundusOD(data.fundusOD);
            setImageSrcFundusOS(data.fundusOS);
        } else {
            console.error("Invalid data format");
        }
    };



    useEffect(() => {
        setImageSrcAntSegOD(AntImg);
        setImageSrcAntSegOS(AntImg);
        setImageSrcLensOD(Lens);
        setImageSrcLensOS(Lens);
        setImageSrcFundusOD(Fundus1);
        setImageSrcFundusOS(Fundus2);

    }, []);






    const handleDataClear = () => {
        // Clear canvas data



        setImageSrcAntSegOD(AntImg);
        setImageSrcAntSegOS(AntImg);
        setImageSrcLensOD(Lens);
        setImageSrcLensOS(Lens);
        setImageSrcFundusOD(Fundus1);
        setImageSrcFundusOS(Fundus2);
        // Optionally clear form data and other states
        setOpthalformData({
            PGPODSph: '',
            PGPODCyl: '',
            PGPODAxs: '',
            PGPOsSph: '',
            PGPOsCyl: '',
            PGPOsAxs: '',
            ODadd: '',
            OSadd: '',
            chiefComplaints: '',
            history: '',
            ARODSph: '',
            ARODCyl: '',
            ARODAxs: '',
            AROsSph: '',
            AROsCyl: '',
            AROsAxs: '',
            powerODVision: '',
            powerOSVision: '',
            crxODVision: '',
            crxOSVision: '',
            cphODVision: '',
            cphOSVision: '',
            SubODSph: '',
            SubODCyl: '',
            SubODAxs: '',
            SubODVa: '',
            SubOsSph: '',
            SubOsCyl: '',
            SubOsAxs: '',
            SubOsVa: '',
            SubODadd: '',
            SubOSadd: '',
            DilODSph: '',
            DilODCyl: '',
            DilODAxs: '',
            DilOsSph: '',
            DilOsCyl: '',
            DilOsAxs: '',
            DilAccODSph: '',
            DilAccODCyl: '',
            DilAccODAxs: '',
            DilAccODVa: '',
            DilAccOSSph: '',
            DilAccOSCyl: '',
            DilAccOSAxs: '',
            DilAccOSVa: '',
            ATIOP: '',
            NCTIOP: '',
            OSATIOP: '',
            OSNCTIOP: '',
            SacSyringing: '',
            SacSyringingSecond: '',
            SubODDiagnosis: '',
            SubOSDiagnosis: '',
            Treatment: '',
            followUp: '',
            remarks: '',
        });

        setDrainsData2([
            {
                rightSPH: '',
                rightCYL: '',
                rightAXIS: '',
                rightVA: '',
                leftSPH: '',
                leftCYL: '',
                leftAXIS: '',
                leftVA: '',
                rightNearSPH: '',
                rightNearCYL: '',
                rightNearAXIS: '',
                rightNearVA: '',
                leftNearSPH: '',
                leftNearCYL: '',
                leftNearAXIS: '',
                leftNearVA: '',
                rightPrism: '',
                rightPrismValue: '',
                leftPrism: '',
                leftPrismValue: '',
                rightPrism2: '',
                rightPrism2Value: '',
                leftPrism2: '',
                leftPrism2Value: '',
            }
        ]);

        // Reset view mode
        setIsViewMode(false);
    };

    const getAnnotatedImage = (imageSrc, canvasRef) => {
        return new Promise((resolve, reject) => {
            if (canvasRef.current) {
                const saveData = canvasRef.current.getSaveData();

                // Create a new canvas element to merge the annotations with the image
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                // Load the image that was passed in
                const img = new Image();
                img.src = imageSrc;

                img.onload = () => {
                    // Set canvas dimensions based on the original image size
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;

                    // Draw the original image onto the canvas
                    context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

                    // Check if the image has annotations
                    if (!saveData || saveData === "{}") {
                        // No annotations: return the base image only
                        const baseImage = canvas.toDataURL("image/png");
                        resolve(baseImage);
                        return;
                    }

                    // Parse and draw the annotations on top of the original image
                    const annotations = JSON.parse(saveData);
                    annotations.lines.forEach((line) => {
                        context.strokeStyle = line.brushColor;
                        context.lineWidth = line.brushRadius * 2;
                        context.beginPath();
                        for (let i = 0; i < line.points.length - 1; i++) {
                            const point = line.points[i];
                            const nextPoint = line.points[i + 1];
                            context.moveTo(
                                point.x * (img.naturalWidth / canvasRef.current.props.canvasWidth),
                                point.y * (img.naturalHeight / canvasRef.current.props.canvasHeight)
                            );
                            context.lineTo(
                                nextPoint.x * (img.naturalWidth / canvasRef.current.props.canvasWidth),
                                nextPoint.y * (img.naturalHeight / canvasRef.current.props.canvasHeight)
                            );
                        }
                        context.stroke();
                    });

                    // Convert the annotated image to base64 and return only the annotated version
                    const annotatedImage = canvas.toDataURL("image/png");
                    resolve(annotatedImage);
                };

                img.onerror = (error) => {
                    reject(error);
                };
            } else {
                reject(new Error("No canvas found!"));
            }
        });
    };





    const handleSubmit = () => {
        Promise.all([
            getAnnotatedImage(imageSrcAntSegOD, antSegODRef),
            getAnnotatedImage(imageSrcAntSegOS, antSegOSRef),
            getAnnotatedImage(imageSrcLensOD, lensODRef),
            getAnnotatedImage(imageSrcLensOS, lensOSRef),
            getAnnotatedImage(imageSrcFundusOD, fundusODRef),
            getAnnotatedImage(imageSrcFundusOS, fundusOSRef),
        ])

            .then((annotatedImages) => {
                console.log(annotatedImages)
                const dataToSave = {
                    ...OpthalformData,
                    drainsData2,
                    antSegOD: annotatedImages[0], // will be original if no annotations
                    antSegOS: annotatedImages[1],
                    lensOD: annotatedImages[2],
                    lensOS: annotatedImages[3],
                    fundusOD: annotatedImages[4],
                    fundusOS: annotatedImages[5],
                    PatientId: DoctorWorkbenchNavigation?.PatientId,
                    VisitId: DoctorWorkbenchNavigation?.VisitId,
                    RegistrationId: DoctorWorkbenchNavigation?.RegistrationId  || IP_DoctorWorkbenchNavigation?.RegistrationId,

                    created_by: userRecord?.username || '',
                };

                console.log(dataToSave, 'dataToSave');

                // Make the API request
                return axios.post(`${UrlLink}Workbench/Workbench_Opthalmology_Details`, dataToSave);
            })
            .then((response) => {
                const resData = response.data;
                const type = Object.keys(resData)[0];
                const message = Object.values(resData)[0];

                const toastData = {
                    message: message,
                    type: type,
                };

                // Dispatch toast notification or handle success
                dispatch({ type: 'toast', value: toastData });
                setIsGetData(prev => !prev);
                handleDataClear()

                // Clear the canvas references after submission
                [antSegODRef, antSegOSRef, lensODRef, lensOSRef, fundusODRef, fundusOSRef].forEach(handleClear);
            })
            .catch((error) => {
                // Handle any errors during submission
                console.error('Error submitting data:', error);
            });
    };







    return (
        <>
            {/* <div className="Main_container_app"> */}
            <div className="appointment ">
                <h4
                    style={{
                        color: "var(--labelcolor)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "start",
                        padding: "10px",
                    }}
                >
                    Opthalmology (Eye)
                </h4>

                <br />
                <div className="RegisFormcon" style={{ justifyContent: "center" }}>
                    <h4
                        style={{
                            color: "var(--labelcolor)",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            textAlign: "start",
                            padding: "10px",
                            width: "120px",
                        }}
                    >
                        PGP <span>-</span>
                    </h4>
                    <div className="RegisForm_1_Opthal ecdeeed">
                        <div className="kdlops90">
                            <label>Sph</label>
                            <label>Cyl</label>
                            <label>Axis</label>
                        </div>

                        <div className="ejdc7x">
                            <div>
                                <label htmlFor="">
                                    OD <span>:</span>
                                </label>
                            </div>
                            <div className="mlpocvfd">
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="PGPODSph"
                                        name="PGPODSph"
                                        value={OpthalformData.PGPODSph}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="PGPODCyl"
                                        name="PGPODCyl"
                                        value={OpthalformData.PGPODCyl}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="PGPODAxs"
                                        name="PGPODAxs"
                                        value={OpthalformData.PGPODAxs}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="ejdc7x">
                            <div>
                                <label htmlFor="">
                                    OS <span>:</span>
                                </label>
                            </div>
                            <div className="mlpocvfd">
                                <div className="idoop9">
                                    {/* <label>Sph</label> */}
                                    <input
                                        type="number"
                                        id="PGPOsSph"
                                        name="PGPOsSph"
                                        value={OpthalformData.PGPOsSph}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    {/* <label>Cyl</label> */}
                                    <input
                                        type="number"
                                        id="PGPOsCyl"
                                        name="PGPOsCyl"
                                        value={OpthalformData.PGPOsCyl}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    {/* <label>Axis</label> */}
                                    <input
                                        type="number"
                                        id="PGPOsAxs"
                                        name="PGPOsAxs"
                                        value={OpthalformData.PGPOsAxs}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="u78i7">
                        <h4
                            style={{
                                color: "var(--labelcolor)",
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                textAlign: "start",
                                padding: "10px",
                                width: "120px",
                            }}
                        >
                            Add <span>-</span>
                        </h4>
                        <div className="RegisForm_1_Opthal ecdeeed">
                            <div className="ejdc7x sdiidc">
                                <div className="fvgg">
                                    <label htmlFor="ODadd">
                                        OD <span>:</span>
                                    </label>
                                </div>
                                <input
                                    type="number"
                                    id="ODadd"
                                    name="ODadd"
                                    value={OpthalformData.ODadd}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ejdc7x">
                                <label htmlFor="">
                                    OS <span>:</span>
                                </label>
                                <input
                                    type="number"
                                    id="OSadd"
                                    name="OSadd"
                                    value={OpthalformData.OSadd}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <br />

                <div className="case_sheet_5con">
                    <div className="case_sheet_5con_20">
                        <label>
                            Chief Complaints <span>:</span>
                        </label>
                        <textarea
                            id="chiefComplaints"
                            name="chiefComplaints"
                            value={OpthalformData.chiefComplaints}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="case_sheet_5con_20">
                        <label>
                            History <span>:</span>
                        </label>
                        <textarea
                            id="history"
                            name="history"
                            value={OpthalformData.history}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>
                <br />

                <div className="RegisFormcon" style={{ justifyContent: "center" }}>
                    <h4
                        style={{
                            color: "var(--labelcolor)",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            textAlign: "start",
                            padding: "10px",
                            width: "120px",
                        }}
                    >
                        AR <span>-</span>
                    </h4>
                    <div className="RegisForm_1_Opthal ecdeeed">
                        <div className="kdlops90">
                            <label>Sph</label>
                            <label>Cyl</label>
                            <label>Axis</label>
                        </div>

                        <div className="ejdc7x">
                            <div>
                                <label htmlFor="">
                                    OD <span>:</span>
                                </label>
                            </div>
                            <div className="mlpocvfd">
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="ARODSph"
                                        name="ARODSph"
                                        value={OpthalformData.ARODSph}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="ARODCyl"
                                        name="ARODCyl"
                                        value={OpthalformData.ARODCyl}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="ARODAxs"
                                        name="ARODAxs"
                                        value={OpthalformData.ARODAxs}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="ejdc7x">
                            <div>
                                <label htmlFor="">
                                    OS <span>:</span>
                                </label>
                            </div>
                            <div className="mlpocvfd">
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="AROsSph"
                                        name="AROsSph"
                                        value={OpthalformData.AROsSph}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="AROsCyl"
                                        name="AROsCyl"
                                        value={OpthalformData.AROsCyl}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="AROsAxs"
                                        name="AROsAxs"
                                        value={OpthalformData.AROsAxs}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <br />
                <br />
                <div className="RegisFormcon" style={{ justifyContent: "center" }}>
                    <h4
                        style={{
                            color: "var(--labelcolor)",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            textAlign: "start",
                            padding: "10px",
                            width: "120px",
                        }}
                    >
                        Vision <span>-</span>
                    </h4>
                    <div
                        className="RegisForm_1_Opthal"
                        style={{ flexDirection: "column", width: "250px" }}
                    >
                        <div className="kdscmjshdyt5a">
                            <label htmlFor="powerODVision">
                                OD <span>:</span>
                            </label>
                            <input
                                type="number"
                                id="powerODVision"
                                name="powerODVision"
                                value={OpthalformData.powerODVision}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="kdscmjshdyt5a">
                            <label htmlFor="powerOSVision">
                                OS <span>:</span>
                            </label>
                            <input
                                type="number"
                                id="powerOSVision"
                                name="powerOSVision"
                                value={OpthalformData.powerOSVision}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <h4
                        style={{
                            color: "var(--labelcolor)",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            textAlign: "start",
                            padding: "10px",
                            width: "120px",
                        }}
                    >
                        with RX <span>-</span>
                    </h4>
                    <div
                        className="RegisForm_1_Opthal"
                        style={{ flexDirection: "column", width: "250px" }}
                    >
                        <div className="">
                            <input
                                type="number"
                                id="crxODVision"
                                name="crxODVision"
                                value={OpthalformData.crxODVision}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="">
                            <input
                                type="number"
                                id="crxOSVision"
                                name="crxOSVision"
                                value={OpthalformData.crxOSVision}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <h4
                        style={{
                            color: "var(--labelcolor)",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            textAlign: "start",
                            padding: "10px",
                            width: "120px",
                        }}
                    >
                        with PH <span>-</span>
                    </h4>
                    <div
                        className="RegisForm_1_Opthal"
                        style={{ flexDirection: "column", width: "250px" }}
                    >
                        <div className="">
                            <input
                                type="number"
                                id="cphODVision"
                                name="cphODVision"
                                value={OpthalformData.cphODVision}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="">
                            <input
                                type="number"
                                id="cphOSVision"
                                name="cphOSVision"
                                value={OpthalformData.cphOSVision}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>
                <br />
                <br />
                <h4
                    style={{
                        color: "var(--labelcolor)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "start",
                    }}
                >
                    Near Vision
                </h4>
                <br />
                <div className="RegisFormcon" style={{ justifyContent: "center" }}>
                    <h4
                        style={{
                            color: "var(--labelcolor)",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            textAlign: "start",
                            padding: "10px",
                            width: "120px",
                        }}
                    >
                        Sub Accep <span>-</span>
                    </h4>
                    <div className="RegisForm_1_Opthal ecdeeed">
                        <div className="kdlops90 jwehfjwey7">
                            <label>Sph</label>
                            <label>Cyl</label>
                            <label>Axis</label>
                            <label>VA</label>
                        </div>

                        <div className="ejdc7x">
                            <div>
                                <label htmlFor="">
                                    OD <span>:</span>
                                </label>
                            </div>
                            <div className="mlpocvfd">
                                <div className="idoop9 nbhgbhvg">
                                    <input
                                        type="number"
                                        id="SubODSph"
                                        name="SubODSph"
                                        value={OpthalformData.SubODSph}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9 nbhgbhvg">
                                    <input
                                        type="number"
                                        id="SubODCyl"
                                        name="SubODCyl"
                                        value={OpthalformData.SubODCyl}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9 nbhgbhvg">
                                    <input
                                        type="number"
                                        id="SubODAxs"
                                        name="SubODAxs"
                                        value={OpthalformData.SubODAxs}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9 nbhgbhvg">
                                    <input
                                        type="number"
                                        id="SubODVa"
                                        name="SubODVa"
                                        value={OpthalformData.SubODVa}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="ejdc7x">
                            <div>
                                <label htmlFor="">
                                    OS <span>:</span>
                                </label>
                            </div>
                            <div className="mlpocvfd">
                                <div className="idoop9 nbhgbhvg">
                                    <input
                                        type="number"
                                        id="SubOsSph"
                                        name="SubOsSph"
                                        value={OpthalformData.SubOsSph}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="idoop9 nbhgbhvg">
                                    <input
                                        type="number"
                                        id="SubOsCyl"
                                        name="SubOsCyl"
                                        value={OpthalformData.SubOsCyl}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9 nbhgbhvg">
                                    <input
                                        type="number"
                                        id="SubOsAxs"
                                        name="SubOsAxs"
                                        value={OpthalformData.SubOsAxs}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9 nbhgbhvg">
                                    <input
                                        type="number"
                                        id="SubOsVa"
                                        name="SubOsVa"
                                        value={OpthalformData.SubOsVa}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="u78i7">
                        <h4
                            style={{
                                color: "var(--labelcolor)",
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                textAlign: "start",
                                padding: "10px",
                                width: "120px",
                            }}
                        >
                            Add <span>-</span>
                        </h4>
                        <div className="RegisForm_1_Opthal ecdeeed">
                            <div className="ejdc7x sdiidc">
                                <div className="fvgg">
                                    <label htmlFor="ODadd">
                                        OD <span>:</span>
                                    </label>
                                </div>
                                <input
                                    type="number"
                                    id="SubODadd"
                                    name="SubODadd"
                                    value={OpthalformData.SubODadd}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ejdc7x">
                                <label htmlFor="">
                                    OS <span>:</span>
                                </label>
                                <input
                                    type="number"
                                    id="SubOSadd"
                                    name="SubOSadd"
                                    value={OpthalformData.SubOSadd}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <br />
                <br />
                <div className="RegisFormcon" style={{ justifyContent: "center" }}>
                    <h4
                        style={{
                            color: "var(--labelcolor)",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            textAlign: "start",
                            padding: "10px",
                            width: "120px",
                        }}
                    >
                        Dil AR <span>-</span>
                    </h4>
                    <div className="RegisForm_1_Opthal ecdeeed">
                        <div className="kdlops90">
                            <label>Sph</label>
                            <label>Cyl</label>
                            <label>Axis</label>
                        </div>
                        <div className="ejdc7x">
                            <div>
                                <label htmlFor="">
                                    OD <span>:</span>
                                </label>
                            </div>
                            <div className="mlpocvfd">
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="DilODSph"
                                        name="DilODSph"
                                        value={OpthalformData.DilODSph}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="DilODCyl"
                                        name="DilODCyl"
                                        value={OpthalformData.DilODCyl}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="DilODAxs"
                                        name="DilODAxs"
                                        value={OpthalformData.DilODAxs}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="ejdc7x">
                            <div>
                                <label htmlFor="">
                                    OS <span>:</span>
                                </label>
                            </div>
                            <div className="mlpocvfd">
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="DilOsSph"
                                        name="DilOsSph"
                                        value={OpthalformData.DilOsSph}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="DilOsCyl"
                                        name="DilOsCyl"
                                        value={OpthalformData.DilOsCyl}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="idoop9">
                                    <input
                                        type="number"
                                        id="DilOsAxs"
                                        name="DilOsAxs"
                                        value={OpthalformData.DilOsAxs}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="u78i7">
                        <h4
                            style={{
                                color: "var(--labelcolor)",
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                textAlign: "start",
                                padding: "10px",
                                width: "120px",
                            }}
                        >
                            Dil Accep <span>-</span>
                        </h4>
                        <div className="RegisForm_1_Opthal ecdeeed">
                            <div className="kdlops90 jwehfjwey7">
                                <label>Sph</label>
                                <label>Cyl</label>
                                <label>Axis</label>
                                <label>VA</label>
                            </div>
                            <div className="ejdc7x">
                                <div>
                                    <label htmlFor="">
                                        OD <span>:</span>
                                    </label>
                                </div>
                                <div className="mlpocvfd">
                                    <div className="idoop9 nbhgbhvg">
                                        <input
                                            type="number"
                                            id="DilAccODSph"
                                            name="DilAccODSph"
                                            value={OpthalformData.DilAccODSph}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="idoop9 nbhgbhvg">
                                        <input
                                            type="number"
                                            id="DilAccODCyl"
                                            name="DilAccODCyl"
                                            value={OpthalformData.DilAccODCyl}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="idoop9 nbhgbhvg">
                                        <input
                                            type="number"
                                            id="DilAccODAxs"
                                            name="DilAccODAxs"
                                            value={OpthalformData.DilAccODAxs}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="idoop9 nbhgbhvg">
                                        <input
                                            type="number"
                                            id="DilAccODVa"
                                            name="DilAccODVa"
                                            value={OpthalformData.DilAccODVa}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="ejdc7x">
                                <div>
                                    <label htmlFor="">
                                        OS <span>:</span>
                                    </label>
                                </div>
                                <div className="mlpocvfd">
                                    <div className="idoop9 nbhgbhvg">
                                        <input
                                            type="number"
                                            id="DilAccOSSph"
                                            name="DilAccOSSph"
                                            value={OpthalformData.DilAccOSSph}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="idoop9 nbhgbhvg">
                                        <input
                                            type="number"
                                            id="DilAccOSCyl"
                                            name="DilAccOSCyl"
                                            value={OpthalformData.DilAccOSCyl}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="idoop9 nbhgbhvg">
                                        <input
                                            type="number"
                                            id="DilAccOSAxs"
                                            name="DilAccOSAxs"
                                            value={OpthalformData.DilAccOSAxs}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="idoop9 nbhgbhvg">
                                        <input
                                            type="number"
                                            id="DilAccOSVa"
                                            name="DilAccOSVa"
                                            value={OpthalformData.DilAccOSVa}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Selected-table-container">
                    <table className="selected-medicine-table2">
                        <thead>
                            <tr>
                                <th></th>
                                <th>OD</th>
                                <th>OS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Ant. Seg.</td>

                                <td>
                                    <div className="img_lens_iujd">
                                        {
                                            IsViewMode ? (
                                                <img src={imageSrcAntSegOD} alt='imageSrcAntSegOD' />
                                            ) : (
                                                <>
                                                    <CanvasDraw
                                                        ref={antSegODRef}
                                                        imgSrc={imageSrcAntSegOD}
                                                        canvasWidth={400}
                                                        canvasHeight={200}
                                                        brushRadius={0.8}
                                                        brushColor="red"
                                                        style={{ position: 'relative' }}
                                                    />
                                                    <button onClick={() => handleClear(antSegODRef)}>
                                                        Clear
                                                    </button>
                                                </>
                                            )
                                        }

                                    </div>
                                </td>

                                <td>
                                    <div className="img_lens_iujd">
                                        {
                                            IsViewMode ? (
                                                <img src={imageSrcAntSegOS} alt='imageSrcAntSegOS' />
                                            ) : (
                                                <>
                                                    <CanvasDraw
                                                        ref={antSegOSRef}
                                                        imgSrc={imageSrcAntSegOS}
                                                        canvasWidth={400}
                                                        canvasHeight={200}
                                                        brushRadius={0.8}
                                                        brushColor="red"
                                                        style={{ position: 'relative' }}

                                                    />
                                                    <button onClick={() => handleClear(antSegOSRef)}>
                                                        Clear
                                                    </button>
                                                </>
                                            )
                                        }

                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>Lens</td>
                                <td>
                                    <div className="img_lens_iuj_lens">
                                        {
                                            IsViewMode ? (
                                                <img src={imageSrcLensOD} alt='imageSrcLensOD' />
                                            ) : (
                                                <>
                                                    <CanvasDraw
                                                        ref={lensODRef}
                                                        imgSrc={imageSrcLensOD}
                                                        canvasWidth={330}
                                                        canvasHeight={240}
                                                        brushRadius={0.8}
                                                        brushColor="red"
                                                        style={{ position: 'relative' }}
                                                    />
                                                    <button onClick={() => handleClear(lensODRef)}>Clear</button>
                                                </>
                                            )
                                        }

                                    </div>
                                </td>

                                <td>
                                    <div className="img_lens_iuj_lens">
                                        {
                                            IsViewMode ? (
                                                <img src={imageSrcLensOS} alt='imageSrcLensOS' />
                                            ) : (
                                                <>
                                                    <CanvasDraw
                                                        ref={lensOSRef}
                                                        imgSrc={imageSrcLensOS}
                                                        canvasWidth={330}
                                                        canvasHeight={240}
                                                        brushRadius={0.8}
                                                        brushColor="red"
                                                        style={{ position: 'relative' }}
                                                    />
                                                    <button onClick={() => handleClear(lensOSRef)}>Clear</button>
                                                </>
                                            )
                                        }

                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "30px",
                                        }}
                                    >
                                        <div>IOP</div>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexDirection: "column",
                                                rowGap: "45px",
                                                margin: "10px 0px",
                                            }}
                                        >
                                            <div>AT</div>
                                            <div>NCT</div>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            rowGap: "20px",
                                        }}
                                    >
                                        <div>
                                            <input
                                                id="ATIOP"
                                                name="ATIOP"
                                                value={OpthalformData.ATIOP}
                                                onChange={handleChange}
                                                className="edjuwydrt56_input"
                                            ></input>{" "}
                                            mmHg
                                        </div>

                                        <div>
                                            <input
                                                id="NCTIOP"
                                                name="NCTIOP"
                                                value={OpthalformData.NCTIOP}
                                                onChange={handleChange}
                                                className="edjuwydrt56_input"
                                            ></input>{" "}
                                            mmHg
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            rowGap: "20px",
                                        }}
                                    >
                                        <div>
                                            <input
                                                id="OSATIOP"
                                                name="OSATIOP"
                                                value={OpthalformData.OSATIOP}
                                                onChange={handleChange}
                                                className="edjuwydrt56_input"
                                            ></input>{" "}
                                            mmHg
                                        </div>

                                        <div>
                                            <input
                                                id="OSNCTIOP"
                                                name="OSNCTIOP"
                                                value={OpthalformData.OSNCTIOP}
                                                onChange={handleChange}
                                                className="edjuwydrt56_input"
                                            ></input>{" "}
                                            mmHg
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>Sac Syringing</td>
                                <td>
                                    <textarea
                                        id="SacSyringing"
                                        name="SacSyringing"
                                        value={OpthalformData.SacSyringing}
                                        className="edjuwydrt56"
                                        onChange={handleChange}

                                    ></textarea>
                                </td>

                                <td>
                                    <textarea
                                        id="SacSyringingSecond"
                                        name="SacSyringingSecond"
                                        value={OpthalformData.SacSyringingSecond}
                                        className="edjuwydrt56"
                                        onChange={handleChange}

                                    ></textarea>
                                </td>
                            </tr>

                            <tr>
                                <td>Fundus</td>
                                <td>
                                    <div className="img_lens_iuj_lens">
                                        {
                                            IsViewMode ? (
                                                <img src={imageSrcFundusOD} alt='imageSrcFundusOD' />
                                            ) : (
                                                <>
                                                    <CanvasDraw
                                                        ref={fundusODRef}
                                                        imgSrc={imageSrcFundusOD}
                                                        canvasWidth={250}
                                                        canvasHeight={250}
                                                        brushRadius={0.8}
                                                        brushColor="red"
                                                        style={{ position: 'relative' }}
                                                    />
                                                    <button onClick={() => handleClear(fundusODRef)}>
                                                        Clear
                                                    </button>
                                                </>
                                            )
                                        }

                                    </div>
                                </td>
                                <td className="img_lens_iuj_lens">
                                    <div className="img_lens_iuj_lens">
                                        {
                                            IsViewMode ? (
                                                <img src={imageSrcFundusOS} alt='imageSrcFundusOS' />
                                            ) : (
                                                <>
                                                    <CanvasDraw
                                                        ref={fundusOSRef}
                                                        imgSrc={imageSrcFundusOS}
                                                        canvasWidth={250}
                                                        canvasHeight={250}
                                                        brushRadius={0.8}
                                                        brushColor="red"
                                                        style={{ position: 'relative' }}
                                                    />

                                                    <button onClick={() => handleClear(fundusOSRef)}>
                                                        Clear
                                                    </button>
                                                    <button onClick={() => getAnnotatedImage(fundusOSRef)}>
                                                        Preview Annotated Image
                                                    </button>
                                                </>
                                            )
                                        }

                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* // */}
                <br />
                <br />

                <div className="u78i7">
                    <h4
                        style={{
                            color: "var(--labelcolor)",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            textAlign: "start",
                            padding: "10px",
                            width: "120px",
                        }}
                    >
                        Diagnosis <span>-</span>
                    </h4>
                    <div className="RegisForm_1_Opthal ecdeeed">
                        <div className="ejdc7x sdiidc">
                            <div className="fvgg">
                                <label htmlFor="SubODDiagnosis">
                                    OD <span>:</span>
                                </label>
                            </div>
                            <input
                                type="number"
                                id="SubODDiagnosis"
                                name="SubODDiagnosis"
                                value={OpthalformData.SubODDiagnosis}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="ejdc7x">
                            <label htmlFor="">
                                OS <span>:</span>
                            </label>
                            <input
                                type="number"
                                id="SubOSDiagnosis"
                                name="SubOSDiagnosis"
                                value={OpthalformData.SubOSDiagnosis}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>
                <br />
                <br />

                <div className="case_sheet_5con">
                    <div className="case_sheet_5con_20">
                        <label>
                            Treatment <span>:</span>
                        </label>
                        <textarea
                            id="Treatment"
                            name="Treatment"
                            value={OpthalformData.Treatment}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="case_sheet_5con_20">
                        <label>
                            Follow up<span>:</span>
                        </label>
                        <textarea
                            id="followUp"
                            name="followUp"
                            value={OpthalformData.followUp}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>
                <br />

                <div className="Selected-table-container">
                    <table className="selected-medicine-table2">
                        <thead>
                            <tr>
                                <th></th>
                                <th colSpan="4">Right</th>
                                <th colSpan="4">Left</th>
                            </tr>
                            <tr>
                                <th></th>
                                <th>SPH</th>
                                <th>CYL</th>
                                <th>AXIS</th>
                                <th>VA</th>
                                <th>SPH</th>
                                <th>CYL</th>
                                <th>AXIS</th>
                                <th>VA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drainsData2.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td>DIST</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.rightSPH}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "rightSPH")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.rightCYL}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "rightCYL")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.rightAXIS}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "rightAXIS")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.rightVA}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "rightVA")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.leftSPH}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "leftSPH")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.leftCYL}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "leftCYL")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.leftAXIS}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "leftAXIS")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.leftVA}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "leftVA")
                                                }
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NEAR</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.rightNearSPH}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "rightNearSPH")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.rightNearCYL}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "rightNearCYL")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.rightNearAXIS}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "rightNearAXIS")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.rightNearVA}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "rightNearVA")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.leftNearSPH}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "leftNearSPH")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.leftNearCYL}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "leftNearCYL")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.leftNearAXIS}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "leftNearAXIS")
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="wedscr54_secd_8643r sdef1_98y1"
                                                value={item.leftNearVA}
                                                onChange={(e) =>
                                                    handleChangeObstetric2(e, index, "leftNearVA")
                                                }
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Prism 1</td>
                                        <td colSpan="4">
                                            <div className="kuhuite2">
                                                <div className="uityre4567">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="ForConstantWear"
                                                            checked={item.rightPrism === "ForConstantWear"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "rightPrism")
                                                            }
                                                        />
                                                        For Constant Wear
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Bifocal"
                                                            checked={item.rightPrism === "Bifocal"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "rightPrism")
                                                            }
                                                        />
                                                        Bifocal
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Separate"
                                                            checked={item.rightPrism === "Separate"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "rightPrism")
                                                            }
                                                        />
                                                        Separate
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="ReadingOnly"
                                                            checked={item.rightPrism === "ReadingOnly"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "rightPrism")
                                                            }
                                                        />
                                                        Reading Only
                                                    </label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="wedscr54_secd_8643r sdef1_98y1"
                                                        value={item.rightPrismValue}
                                                        onChange={(e) =>
                                                            handleChangeObstetric2(e, index, "rightPrismValue")
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td colSpan="4">
                                            <div className="kuhuite2">
                                                <div className="uityre4567">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="ForConstantWear"
                                                            checked={item.leftPrism === "ForConstantWear"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "leftPrism")
                                                            }
                                                        />
                                                        For Constant Wear
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Bifocal"
                                                            checked={item.leftPrism === "Bifocal"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "leftPrism")
                                                            }
                                                        />
                                                        Bifocal
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Separate"
                                                            checked={item.leftPrism === "Separate"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "leftPrism")
                                                            }
                                                        />
                                                        Separate
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="ReadingOnly"
                                                            checked={item.leftPrism === "ReadingOnly"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "leftPrism")
                                                            }
                                                        />
                                                        Reading Only
                                                    </label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="wedscr54_secd_8643r sdef1_98y1"
                                                        value={item.leftPrismValue}
                                                        onChange={(e) =>
                                                            handleChangeObstetric2(e, index, "leftPrismValue")
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>Prism 2</td>
                                        <td colSpan="4">
                                            <div className="kuhuite2">
                                                <div className="uityre4567">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Plain"
                                                            checked={item.rightPrism2 === "Plain"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "rightPrism2")
                                                            }
                                                        />
                                                        Plain
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Tinted"
                                                            checked={item.rightPrism2 === "Tinted"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "rightPrism2")
                                                            }
                                                        />
                                                        Tinted
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="PhotoChromaticExecutive"
                                                            checked={item.rightPrism2 === "PhotoChromaticExecutive"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "rightPrism2")
                                                            }
                                                        />
                                                        Photo Chromatic Executive
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Cr39"
                                                            checked={item.rightPrism2 === "Cr39"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "rightPrism2")
                                                            }
                                                        />
                                                        Cr 39
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Highindex"
                                                            checked={item.rightPrism2 === "Highindex"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "rightPrism2")
                                                            }
                                                        />
                                                        High index
                                                    </label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="wedscr54_secd_8643r sdef1_98y1"
                                                        value={item.rightPrism2Value}
                                                        onChange={(e) =>
                                                            handleChangeObstetric2(e, index, "rightPrism2Value")
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td colSpan="4">
                                            <div className="kuhuite2">
                                                <div className="uityre4567">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Plain"
                                                            checked={item.leftPrism2 === "Plain"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "leftPrism2")
                                                            }
                                                        />
                                                        Plain
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Tinted"
                                                            checked={item.leftPrism2 === "Tinted"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "leftPrism2")
                                                            }
                                                        />
                                                        Tinted
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="PhotoChromaticExecutive"
                                                            checked={
                                                                item.leftPrism2 === "PhotoChromaticExecutive"
                                                            }
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "leftPrism2")
                                                            }
                                                        />
                                                        Photo Chromatic Executive
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Cr39"
                                                            checked={item.leftPrism2 === "Cr39"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "leftPrism2")
                                                            }
                                                        />
                                                        Cr 39
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="Highindex"
                                                            checked={item.leftPrism2 === "Highindex"}
                                                            onChange={(e) =>
                                                                handleChangeObstetric2(e, index, "leftPrism2")
                                                            }
                                                        />
                                                        High index
                                                    </label>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="wedscr54_secd_8643r sdef1_98y1"
                                                        value={item.leftPrism2Value}
                                                        onChange={(e) =>
                                                            handleChangeObstetric2(e, index, "leftPrism2Value")
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                <br />

                <div className="case_sheet_5con">
                    <div className="case_sheet_5con_20">
                        <label>
                            Remarks<span>:</span>
                        </label>
                        <textarea
                            id="remarks"
                            name="remarks"
                            value={OpthalformData.remarks}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                </div>

                <br />





            </div>
            {previewImage && (
                <div>
                    <h4>Annotated Image Preview:</h4>
                    <img src={previewImage} alt="Annotated Preview" />
                </div>
            )}

            <div className="Main_container_Btn">

                {IsViewMode && (
                    <button onClick={handleDataClear}>Clear</button>
                )}
                {!IsViewMode && (
                    <button onClick={handleSubmit}>Submit</button>
                )}
            </div>
            <div className='RegisFormcon_1 jjxjx_'>
                {gridData.length > 0 &&
                    <ReactGrid columns={OpthoColumns} RowData={gridData} />
                }
            </div>



            {/* </div> */}


            <ToastAlert Message={toast.message} Type={toast.type} />




        </>

    );
}

export default Opthalmology;


