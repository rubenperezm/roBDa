import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
    ImageList,
    ImageListItem,
    ImageListItemBar,
    ListSubheader,
    useMediaQuery,
} from '@mui/material';




export default function ImgsList(props) {
    const { imagenes, formik, setOpenList } = props;
    const router = useRouter();
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));

    if (imagenes.length === 0) {
        return (
            <ImageList sx={{ height: 450 }}>
                <ImageListItem key="Subheader" cols={3} style={{ height: 'auto' }}>
                    <ListSubheader component="div">No hay imágenes</ListSubheader>
                </ImageListItem>
            </ImageList>
        );
    }    
    return (
        <ImageList 
            cols={lgUp? 3: (smUp? 2: 1)} 
            gap={8} 
            rowHeight={300}
        >
            {imagenes.map((item) => (
                <ImageListItem
                    key={item.path}
                    sx={{cursor: 'pointer'}}
                    onMouseOver={(e) => e.currentTarget.children[0].style.opacity = 0.5}
                    onMouseOut={(e) => e.currentTarget.children[0].style.opacity = 1}
                    onClick={formik 
                        ? () => {
                            formik.setFieldValue('image', item.id);
                            formik.setFieldValue('tema', item.tema);
                            setOpenList(false);
                        }: () => router.push(`/admin/questions/images/${item.id}`)}
                >
                    <img
                        src={item.path}
                        alt={item.nombre}
                        loading="lazy"
                        style={{ height: '100%', width: '100%', objectFit: 'fill'}}                        
                    />
                    <ImageListItemBar
                        sx={{ 
                            backgroundColor: 'neutral.800',
                            color: 'rgba(255, 255, 255, 0.9)',
                            pl:'10px',
                            '& .MuiImageListItemBar-title': {
                                fontWeight: 500,
                            }
                        }}
                        title={item.nombre}
                        subtitle={item.tema}
                        position="below"
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );

}