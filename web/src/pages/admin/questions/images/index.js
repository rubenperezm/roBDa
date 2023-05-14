import { useEffect, useState } from 'react';
import axiosAuth from 'src/utils/axiosAuth';
import { withAuthorization } from 'src/hocs/with-authorization';

import { Pagination, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as QuestionsLayout } from 'src/layouts/questions/layout';
import ImgsList from 'src/sections/admin/questions/images/imgs-list';
import { ImgsFilters } from 'src/sections/admin/questions/images/imgs-filters';


const Page = () => {
    const [items, setItems] = useState([]);
    const [numberOfResults, setNumberOfResults] = useState(0);
    const [pagina, setPagina] = useState(1);

    useEffect(() => {
        const getImages = async () => {
            const res = await axiosAuth.get('/api/questions/images', {
                params: {
                    page: pagina
                }
            }).then(res => res.data);
            setItems(res.results);
            setNumberOfResults(res.count);
        };
        getImages();
    }, [pagina]);


    return (
        <QuestionsLayout
            buttonText="Subir imagen"
            creationLink="/admin/questions/images/create"
            title="Imágenes"
        >
            <Grid
                container
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Grid item xs={12}>
                    <ImgsFilters
                        setNumberOfResults={setNumberOfResults}
                        setImagenes={setItems}
                        setPagina={setPagina}
                    />
                </Grid>
                <ImgsList
                    imagenes={items}
                />
                <Pagination
                    count={Math.ceil(numberOfResults / 30)}
                    page={pagina}
                    onChange={(e, value) => setPagina(value)}
                />
            </Grid >
        </QuestionsLayout>
    );
};


export default withAuthorization(Page, true);

