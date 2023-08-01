import { Box, IconButton, List, ListItem, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import Search from '@mui/icons-material/Search';
import RightMenuList from '../components/RightMenuList';
import RightAudioList from '../components/RightAudioList';

const Container = styled(Box)({
    display: 'flex',
    height: '100vh'
})

const LeftContainer = styled(Box)({
    flex: '0.20',
    background: '#f48b00',
})

const RightContainer = styled(Box)({
    overflow: 'scroll',
    overflowX: 'hidden',
    overflowY: 'inherit',
    flex: '0.80',
    background: '#484c4c',
    padding: '25px 30px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
})

const ListWrapper = styled(List)({
    marginTop: 25,
    marginLeft: 55,
    display: 'flex',
    flexDirection: 'column',
    '& > li': {
        fontSize: 26,
        cursor: 'pointer',
    }
})

function Home() {

    const leftListItem = [
        {
            id: 0,
            item: 'Video',
            picked: true,
        },
        {
            id: 1,
            item: 'Audio',
            picked: false,
        },
        {
            id: 2,
            item: 'Playlists',
            picked: false,
        },
        {
            id: 3,
            item: 'History',
            picked: false,
        }
    ]

    const [selected, setSelected] = useState(leftListItem);
    const [files, setFiles] = useState({});

    const onLeftMenuItemSelected = (positon) => {
        for (let i = 0; i < 4; i++) {
            leftListItem[i].picked = false;
        }
        leftListItem[positon].picked = true;
        setSelected([...leftListItem]);
    }

    // useEffect(() => {
    //     fetch('http://localhost:5000/video').then(res => res.json()).then(result => {
    //         console.log(result);
    //         setFiles(result);
    //     })
    // }, [selected])

    useEffect(() => {
        const abortController = new AbortController();
        console.log(selected);
        if (selected[0].picked === true) {
            fetch('http://localhost:5000/video', { signal: abortController.signal }).then(res => res.json()).then(result => {
                console.log(result);
                setFiles(result);
            })
        } else if (selected[1].picked === true) {
            fetch('http://localhost:5000/audio', { signal: abortController.signal }).then(res => res.json()).then(result => {
                console.log(result);
                setFiles(result);
            })
        }

        return () => {
            abortController.abort();
        }
    }, [selected])

    return (
        <Container>
            <LeftContainer>
                <IconButton style={{ marginTop: 15, marginLeft: 24 }}>
                    <Search style={{ fontSize: 45, color: '#fff', background: '#ffa835', padding: '10px 10px', borderRadius: 50 }} />
                </IconButton>
                <ListWrapper>
                    {
                        selected.map((element, index) => (
                            (element.picked === true) ? (
                                <ListItem key={index} sx={{ color: '#fff' }}>
                                    <Typography style={{ fontSize: 34, transition: 'font-size 0.5s' }}>{element.item}</Typography>
                                </ListItem>
                            ) : (

                                <ListItem key={index} sx={{ color: '#000' }} onClick={() => onLeftMenuItemSelected(element.id)}>
                                    <Typography style={{ fontSize: 26 }}>{element.item}</Typography>
                                </ListItem>
                            )
                        ))
                    }
                </ListWrapper>
            </LeftContainer>
            <RightContainer>
                {
                    (() => {
                        if (selected[0].picked === true) {
                            {
                                return Object.values(files).map(file => (
                                    <RightMenuList key={file.id} type={file.type} name={file.name} path={file.path} setFiles={setFiles} />
                                ))
                            }
                        } else if (selected[1].picked === true) {
                            {
                                return Object.values(files).map(file => (
                                    <RightAudioList key={file.id} type={file.type} name={file.name} path={file.path} setFiles={setFiles} />
                                ))
                            }
                        }else if(selected[2].picked === true){
                            return <Box>
                                <Typography>
                                    playlist
                                </Typography>
                            </Box>
                        } else {
                            return <Box>
                                <Typography>
                                    History
                                </Typography>
                            </Box>
                        }
                    })()
                }
            </RightContainer>
        </Container>
    )
}

export default Home