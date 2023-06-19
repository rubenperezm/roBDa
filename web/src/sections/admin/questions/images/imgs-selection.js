import { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    IconButton,
    InputAdornment,
    Pagination,
    SvgIcon,
    TextField,
} from '@mui/material';
import axiosAuth from 'src/utils/axiosAuth';
import ImgsList from './imgs-list';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';

export const ImgsSelection = (props) => {
    const { formik, tema } = props;
    const [items, setItems] = useState([]);
    const [openList, setOpenList] = useState(false);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const [pagina, setPagina] = useState(1);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenList(false);
    };

    useEffect(() => {
        const getImages = async () => {
            const params = {
                page: pagina,
            };
            if (tema) params.tema = tema;

            const res = await axiosAuth.get('/api/questions/images', {
                params
            }).then(res => res.data);
            setItems(res.results);
            setNumberOfResults(res.count);
        };
        getImages();
    }, [pagina]);

    return (
        <>
            <Dialog maxWidth="lg" fullWidth onClose={handleClose} open={openList}>
                <DialogTitle>Selecciona una imagen</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ImgsList
                        imagenes={items}
                        formik={formik}
                        setOpenList={setOpenList}
                    />
                    <Pagination
                        count={Math.ceil(numberOfResults / 30)}
                        page={pagina}
                        onChange={(e, value) => setPagina(value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenList(false)}>Cancelar</Button>
                    <Button onClick={() => { formik.setFieldValue('image', ''); setOpenList(false)}}>Sin imagen</Button>
                </DialogActions>
            </Dialog>
            <TextField
                disabled
                fullWidth
                label="Imagen"
                name="image"
                onChange={formik.handleChange}
                value={formik.values.image === '' ? 'Sin imagen' : formik.values.image}
                InputProps={{
                    endAdornment:
                        (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="seleccionar-imagen"
                                    onClick={() => setOpenList(true)}
                                >
                                    <SvgIcon fontSize="small">
                                        <PencilIcon />
                                    </SvgIcon>
                                </IconButton>
                            </InputAdornment>
                        ),
                }}
            >
            </TextField>
        </>
    )
}