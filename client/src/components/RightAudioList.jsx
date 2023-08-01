import { Box, Dialog, Typography } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import styled from "@emotion/styled";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { shortText } from "../util";
import { useState } from "react";

const Container = styled(Box)({

})

const dislogStyle = {
    height: '35%',
    width: '55%',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: 'none',
    borderRadius: '10px 10px 10px 10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

function RightAudioList({ type, name, path, setFiles }) {

    const [location, setLocation] = useState('');
    const [open, setOpen] = useState(false);

    const getAudiosFromDir = (dirName) => {
        fetch(`http://localhost:5000/audio/${dirName}`).then(res => res.json()).then(result => {
            console.log(result);
            setFiles(result);
        })
    }

    const playAudio = (audName) => {
        setLocation(audName);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Container>
            <Box>
                {
                    (type === 'audio') ? (
                        <MusicNoteIcon style={{ width: '23vw', height: '28vh', margin: '10px 10px' }} onClick={() => { playAudio(name) }} />
                    ) : (
                        <FolderIcon style={{ width: '23vw', height: '28vh', margin: '10px 10px' }} onClick={() => { getAudiosFromDir(name) }} />
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
                <audio src={`http://localhost:5000/play-audio/${location}`} controls>

                </audio>
            </Dialog>
        </Container>
    )
}

export default RightAudioList;