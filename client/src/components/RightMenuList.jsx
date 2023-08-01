import { Box, Typography, Dialog, IconButton } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import styled from "@emotion/styled";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { shortText } from "../util";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

const Container = styled(Box)({

})

const dislogStyle = {
    minHeight: '70%',
    width: '80%',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: 'none',
    borderRadius: '10px 10px 10px 10px',
    overflow: 'hidden'
}

function RightMenuList({ type, name, path, setFiles }) {

    const [location, setLocation] = useState('');

    const [open, setOpen] = useState(false);

    const getVideosFromDir = (dirName) => {
        fetch(`http://localhost:5000/video/${dirName}`).then(res => res.json()).then(result => {
            console.log(result);
            setFiles(result);
        })
    }

    const playVideo = (vidName) => {
        console.log(vidName);
        setLocation(vidName);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (

        <Container>
            <Box>
                {
                    (type === 'video') ? (
                        <PlayCircleIcon style={{ width: '23vw', height: '28vh', margin: '10px 10px' }} onClick={() => { playVideo(name) }} />
                    ) : (
                        <FolderIcon style={{ width: '23vw', height: '28vh', margin: '10px 10px' }} onClick={() => { getVideosFromDir(name) }} />
                    )
                }
                <Typography style={{ textAlign: 'center' }}>
                    {
                        shortText(name)
                    }
                </Typography>
            </Box>
            <Dialog open={open} onClose={handleClose} PaperProps={{
                sx: dislogStyle
            }}
            >
                <Box>
                    <IconButton style={{ display: 'flex', float: 'right' }}>
                        <CloseIcon onClick={() => { setOpen(false) }} />
                    </IconButton>
                </Box>
                <video src={`http://localhost:5000/play-video/${location}`} controls>

                </video>
            </Dialog>
        </Container>

    )
}

export default RightMenuList